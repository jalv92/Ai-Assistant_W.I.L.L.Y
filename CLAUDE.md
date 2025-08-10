# 🤖 Claude Code - Guía de Desarrollo WILLY

## 📋 Información del Proyecto

**Proyecto**: WILLY Personal Assistant  
**Versión**: 1.0.0  
**Stack Principal**: React + Vite + Three.js + Supabase  
**Entorno**: Web PWA con soporte iOS/Android  

## 🎯 Objetivo Principal

Desarrollar un asistente personal inteligente con interfaz 3D futurista, autenticación biométrica (Face ID), y capacidades de automatización mediante N8N. El asistente debe ser instalable como PWA en dispositivos móviles y ofrecer una experiencia similar a JARVIS de Iron Man.

## ⚠️ INSTRUCCIONES CRÍTICAS DE GIT - LEER PRIMERO

### ❌ PROBLEMA CONOCIDO: git push NO funciona con CLI
**IMPORTANTE**: El comando `git push` desde la terminal **FALLARÁ** debido a falta de credenciales HTTPS.

### ✅ SOLUCIÓN OBLIGATORIA para hacer PUSH:
```javascript
// USAR SIEMPRE las herramientas MCP de GitHub:
mcp__github-mcp__create_or_update_file  // Para un archivo
mcp__github-mcp__push_files             // Para múltiples archivos
```

### 📝 Comandos git que SÍ funcionan:
- `git status`, `git add`, `git commit`, `git pull`, `git branch`, `git checkout`

### 🔗 Detalles completos en: `.claude/agents/GIT_AGENT_INSTRUCTIONS.md`

## 👥 Sistema de Sub-Agentes

### Arquitectura de Agentes

Este proyecto utiliza un sistema de 7 sub-agentes especializados. Cada agente tiene un dominio específico y debe respetar las responsabilidades de los demás agentes.

### 1️⃣ **UI_Agent** (Prioridad: ALTA)
**Responsabilidades:**
- Componentes React de interfaz
- Diseño responsive y accesibilidad
- Animaciones CSS y transiciones
- Gestión de estados UI
- Optimización de rendimiento visual

**Archivos principales:**
- `/src/components/ui/*`
- `/src/styles/*`
- `/public/index.html`

**Restricciones:**
- NO modificar lógica de negocio
- NO tocar servicios de backend
- Usar solo Tailwind CSS para estilos

**Prompt sugerido:**
```
Actúa como UI_Agent para WILLY. Tu responsabilidad es crear y mantener componentes de interfaz en React. 
Enfócate en UX futurista, accesibilidad y rendimiento. Usa Tailwind CSS y mantén consistencia visual.
```

### 2️⃣ **Core_Agent** (Prioridad: ALTA)
**Responsabilidades:**
- Lógica de negocio principal
- Gestión de estado global (Context API/Zustand)
- Coordinación entre componentes
- Procesamiento de comandos
- Manejo de errores global

**Archivos principales:**
- `/src/components/core/*`
- `/src/hooks/*`
- `/src/App.jsx`
- `/src/router.jsx`

**Restricciones:**
- NO modificar estilos directamente
- NO implementar llamadas API directas
- Mantener separación de responsabilidades

**Prompt sugerido:**
```
Actúa como Core_Agent para WILLY. Gestiona la lógica principal, estados y coordinación entre componentes.
Implementa patrones de React modernos y asegura un flujo de datos limpio.
```

### 3️⃣ **3D_Agent** (Prioridad: MEDIA)
**Responsabilidades:**
- Escenas Three.js
- Animaciones 3D y partículas
- Shaders y efectos visuales
- Optimización de renderizado 3D
- Gestión de recursos 3D

**Archivos principales:**
- `/src/components/3d/*`
- `/src/utils/three-helpers.js`

**Restricciones:**
- Mantener FPS > 30 en móviles
- NO usar más de 2MB en assets 3D
- Implementar LOD (Level of Detail)

**Prompt sugerido:**
```
Actúa como 3D_Agent para WILLY. Crea y optimiza visualizaciones Three.js.
Prioriza rendimiento móvil y efectos futuristas. Mantén 60 FPS en desktop, 30 FPS en móvil.
```

### 4️⃣ **Auth_Agent** (Prioridad: ALTA)
**Responsabilidades:**
- Autenticación WebAuthn/Face ID
- Integración Supabase Auth
- Gestión de sesiones
- Seguridad y encriptación
- Tokens y refresh tokens

**Archivos principales:**
- `/src/components/auth/*`
- `/src/services/supabase/auth.js`
- `/src/services/webauthn/*`

**Restricciones:**
- NUNCA exponer credenciales
- Usar HTTPS siempre
- Implementar rate limiting

**Prompt sugerido:**
```
Actúa como Auth_Agent para WILLY. Implementa autenticación segura con WebAuthn y Supabase.
Prioriza seguridad, privacidad y compatibilidad con Face ID en iOS.
```

### 5️⃣ **Integration_Agent** (Prioridad: MEDIA)
**Responsabilidades:**
- Webhooks N8N
- APIs externas
- Funciones Netlify
- Procesamiento de comandos
- Queue management

**Archivos principales:**
- `/src/services/n8n/*`
- `/netlify/functions/*`
- `/src/services/api/*`

**Restricciones:**
- Implementar retry logic
- Manejar timeouts (30s max)
- Validar todas las entradas

**Prompt sugerido:**
```
Actúa como Integration_Agent para WILLY. Gestiona integraciones con N8N y APIs externas.
Implementa webhooks robustos y manejo de errores. Optimiza para latencia mínima.
```

### 6️⃣ **Voice_Agent** (Prioridad: MEDIA)
**Responsabilidades:**
- Web Speech API
- Reconocimiento de voz
- Síntesis de voz
- Comandos de voz
- Procesamiento de lenguaje natural

**Archivos principales:**
- `/src/services/voice/*`
- `/src/hooks/useVoice.js`

**Restricciones:**
- Soporte multi-idioma (es-ES, en-US)
- Funcionar sin conexión (comandos básicos)
- Respetar privacidad del usuario

**Prompt sugerido:**
```
Actúa como Voice_Agent para WILLY. Implementa reconocimiento y síntesis de voz.
Optimiza para precisión y velocidad. Soporta español e inglés.
```

### 7️⃣ **Problem_Solver** (Prioridad: ALTA)
**Responsabilidades:**
- Debugging y troubleshooting
- Optimización de rendimiento
- Resolución de conflictos entre agentes
- Testing y QA
- Documentación técnica

**Archivos principales:**
- `/tests/*`
- `/docs/*`
- `/.claude/agents/*`

**Restricciones:**
- NO romper funcionalidad existente
- Documentar todos los cambios
- Mantener cobertura de tests > 80%

**Prompt sugerido:**
```
Actúa como Problem_Solver para WILLY. Resuelve bugs, optimiza rendimiento y coordina entre agentes.
Prioriza estabilidad y mantenibilidad. Documenta soluciones implementadas.
```

## 🛠 Convenciones de Código

### Estructura de Componentes React
```jsx
// Siempre usar functional components con hooks
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // Estados primero
  const [state, setState] = useState(null);
  
  // Effects después
  useEffect(() => {
    // Logic
  }, []);
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

### Nomenclatura
- **Componentes**: PascalCase (`WillyCore.jsx`)
- **Funciones**: camelCase (`processCommand()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Archivos CSS**: kebab-case (`willy-theme.css`)
- **Branches Git**: `feature/nombre`, `fix/nombre`, `agent/nombre`

### Comentarios
```javascript
// TODO: [AGENT_NAME] - Descripción de la tarea pendiente
// FIXME: [AGENT_NAME] - Descripción del bug a corregir
// NOTE: [AGENT_NAME] - Nota importante para otros agentes
// HACK: [AGENT_NAME] - Solución temporal que necesita refactor
```

## 📝 Flujo de Trabajo

### 1. Inicio de Sesión
```bash
# Cada agente debe identificarse al comenzar
git checkout -b agent/[nombre-agente]/[feature]
```

### 2. Desarrollo
1. Revisar tareas asignadas en `/docs/agents/[AGENT_NAME].md`
2. Implementar cambios solo en archivos de tu dominio
3. Ejecutar tests relevantes
4. Documentar cambios significativos

### 3. Coordinación entre Agentes
```javascript
// Usar comentarios para comunicación inter-agente
// @UI_Agent: Necesito un componente de loading aquí
// @Auth_Agent: ¿Puedes validar este token?
// @Problem_Solver: Hay un bug de rendimiento aquí
```

### 4. Testing
```bash
# Ejecutar tests específicos del agente
npm run test:[agent-name]

# Ejemplo:
npm run test:ui
npm run test:auth
npm run test:3d
```

## 🔐 Seguridad

### Reglas Críticas
1. **NUNCA** commitear `.env` o credenciales
2. **SIEMPRE** validar inputs del usuario
3. **USAR** HTTPS en producción
4. **IMPLEMENTAR** rate limiting en APIs
5. **ENCRIPTAR** datos sensibles
6. **SANITIZAR** HTML/SQL inputs
7. **VALIDAR** tokens en cada request

### Checklist de Seguridad
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] CSP headers implementados
- [ ] XSS protection activo
- [ ] SQL injection prevenido
- [ ] Rate limiting configurado
- [ ] Logs sin información sensible

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor desarrollo
npm run build               # Build producción
npm run preview             # Preview build

# Testing
npm test                    # Todos los tests
npm run test:unit          # Tests unitarios
npm run test:e2e           # Tests E2E

# Utilidades
npm run format             # Formatear código
npm run lint              # Verificar linting
npm run analyze           # Analizar bundle

# Deployment
npm run deploy:netlify    # Deploy a Netlify
npm run deploy:preview    # Deploy preview

# Supabase
npm run supabase:migrate  # Ejecutar migraciones
npm run supabase:seed     # Poblar base de datos
npm run supabase:types    # Generar tipos TypeScript
```

## 📊 Métricas de Calidad

### Performance Budget
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB (gzipped)
- **Lighthouse Score**: > 90

### Código
- **Test Coverage**: > 80%
- **No ESLint Errors**
- **No TypeScript Errors**
- **Documentación JSDoc**: 100%

## 🐛 Debugging

### Herramientas Recomendadas
1. **React DevTools**: Para debugging de componentes
2. **Redux DevTools**: Para estado global
3. **Three.js Inspector**: Para debugging 3D
4. **Lighthouse**: Para performance
5. **Netlify CLI**: Para funciones locales

### Logs Estructurados
```javascript
// Usar este formato para logs
console.log('[AGENT_NAME]', 'Context:', { data });
console.error('[AGENT_NAME]', 'Error:', error);
console.warn('[AGENT_NAME]', 'Warning:', message);
```

## 🔄 Estado Actual del Proyecto

### ✅ Completado
- [x] Arquitectura inicial
- [x] Estructura de carpetas
- [x] Documentación base

### 🚧 En Progreso
- [ ] Configuración Supabase
- [ ] Componente WillyCore
- [ ] Autenticación WebAuthn

### 📋 Por Hacer
- [ ] Integración N8N
- [ ] Voice commands
- [ ] PWA manifest
- [ ] Deploy Netlify
- [ ] Testing E2E

## 💡 Tips para Claude Code

1. **Contexto**: Siempre indica qué agente eres al inicio
2. **Scope**: Mantente en tu dominio de archivos
3. **Comunicación**: Usa comentarios para coordinar con otros agentes
4. **Testing**: Escribe tests para tu código
5. **Documentación**: Actualiza docs al hacer cambios significativos
6. **Performance**: Optimiza para móviles siempre
7. **Seguridad**: Valida y sanitiza todo input

## 📞 Contacto entre Agentes

Si necesitas ayuda de otro agente, usa este formato en comentarios:

```javascript
/**
 * @request-to: [AGENT_NAME]
 * @priority: HIGH | MEDIUM | LOW
 * @description: Descripción de lo que necesitas
 * @files: Lista de archivos afectados
 */
```

## 🎯 Objetivos Inmediatos

1. **UI_Agent**: Crear componente de autenticación
2. **Core_Agent**: Implementar Context API para estado global
3. **Auth_Agent**: Configurar WebAuthn
4. **3D_Agent**: Crear orbe animado básico
5. **Integration_Agent**: Setup webhook N8N
6. **Voice_Agent**: Implementar comando "Hey Willy"
7. **Problem_Solver**: Configurar testing framework

---

**Recuerda**: Cada agente es experto en su dominio. Respeta los límites y colabora efectivamente. 
El éxito de WILLY depende de la coordinación entre todos los agentes. 🤖✨