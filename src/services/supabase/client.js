import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to empty strings for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with error handling
let supabase = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  } else {
    console.warn('Supabase credentials not configured. Running in offline mode.');
    
    // Mock Supabase client for development
    supabase = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (callback) => {
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      },
      from: (table) => ({
        select: async () => ({ data: [], error: null }),
        insert: async (data) => ({ data, error: null }),
        update: async (data) => ({ data, error: null }),
        delete: async () => ({ data: null, error: null })
      }),
      channel: (name) => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {}
      })
    };
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  
  // Fallback mock client
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      signOut: async () => ({ error: null })
    }
  };
}

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Database operations
  async fetchData(table, options = {}) {
    try {
      let query = supabase.from(table).select(options.select || '*');
      
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
  },

  async insertData(table, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }
  },

  async updateData(table, id, updates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }
  },

  async deleteData(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }
  },

  // Realtime subscriptions
  subscribeToTable(table, callback, filter = null) {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter
        },
        callback
      )
      .subscribe();
    
    return channel;
  }
};

export { supabase };