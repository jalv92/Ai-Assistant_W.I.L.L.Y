# 🔐 Configuración Segura de Supabase para WILLY

## ⚠️ IMPORTANTE: Seguridad

**NUNCA** subas credenciales reales a un repositorio público. Este proyecto usa Supabase para almacenamiento y autenticación.

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda el **Project ID**

### 2. Obtener Credenciales
1. Ve a **Settings > API** en tu dashboard de Supabase
2. Copia:
   - **Project URL**: `https://YOUR_PROJECT_ID.supabase.co`
   - **Anon Key**: La clave pública (anon/public)

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Mantén las demás configuraciones del .env.example
```

### 4. Base de Datos Ya Configurada

El esquema de base de datos ya está creado con las siguientes tablas:
- `user_profiles` - Perfiles de usuarios
- `webauthn_credentials` - Credenciales biométricas
- `user_sessions` - Gestión de sesiones
- `command_history` - Historial de comandos
- `user_preferences` - Preferencias del usuario
- `usage_metrics` - Métricas de uso
- `security_audit_log` - Auditoría de seguridad

**Row Level Security (RLS)** está habilitado en todas las tablas.

## 🚨 Checklist de Seguridad

- [ ] `.env.local` está en `.gitignore`
- [ ] Nunca commitear credenciales reales
- [ ] Usar variables de entorno del servidor en producción
- [ ] Rotar keys regularmente
- [ ] Habilitar 2FA en tu cuenta de Supabase

## 🔑 Para el Proyecto Actual

El proyecto ID configurado es: `qhstovnzfymvzmlgtpdp`

**NOTA**: Las credenciales reales deben mantenerse privadas y seguras.

## 📚 Documentación

- [Supabase Docs](https://supabase.com/docs)
- [Seguridad en Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [WebAuthn con Supabase](https://supabase.com/docs/guides/auth/passwordless-login)