# 🎯 WILLY AGENT DISPATCHER - Sistema Inteligente de Coordinación

## 🔧 CONFIGURACIÓN INICIAL

**PROYECTO**: WILLY Assistant  
**REPOSITORIO**: https://github.com/jalv92/Ai-Assistant_W.I.L.L.Y  
**MODO**: Auto-detección y coordinación de sub-agentes

## 🤖 ACTIVACIÓN AUTOMÁTICA

Este sistema se activa cuando detecta cualquiera de estas palabras/frases:
- agente, agentes, subagente, sub-agente
- ayuda, necesito, problema, error, bug
- implementa, crea, arregla, optimiza, actualiza
- "no funciona", "no se ve", "falla", "lento"
- commit, push, git, repositorio
- O cualquier descripción de tarea técnica

## 📊 MATRIZ DE DECISIÓN DE AGENTES

### ANÁLISIS AUTOMÁTICO DE CONTEXTO

Cuando recibas una solicitud, ejecuta este análisis:

```javascript
function analyzeTaskAndSelectAgents(userInput) {
  const analysis = {
    // 1. DETECTAR TIPO DE PROBLEMA
    problemType: detectProblemType(userInput),
    
    // 2. IDENTIFICAR ARCHIVOS AFECTADOS
    filesInvolved: extractFileReferences(userInput),
    
    // 3. DETERMINAR AGENTES NECESARIOS
    requiredAgents: [],
    
    // 4. ESTABLECER ORDEN DE EJECUCIÓN
    executionOrder: [],
    
    // 5. NIVEL DE URGENCIA
    priority: 'normal' // low | normal | high | critical
  };
  
  return analysis;
}
```

## 🎭 REGLAS DE SELECCIÓN DE AGENTES

### UI_Agent SE ACTIVA CUANDO:
- Palabras clave: interfaz, UI, UX, diseño, botón, componente, pantalla, responsive, móvil, estilo, CSS, Tailwind, color, animación, layout, navbar, footer, modal
- Archivos mencionados: *.jsx (componentes), *.css, tailwind.config.js
- Problemas: "no se ve bien", "está mal alineado", "falta un botón", "cambiar color"
- Acciones: crear interfaz, mejorar diseño, hacer responsive

### Core_Agent SE ACTIVA CUANDO:
- Palabras clave: lógica, estado, state, context, hook, función, proceso, comando, flujo, datos, gestión, coordinación
- Archivos mencionados: App.jsx, hooks/*, context/*, store/*
- Problemas: "no funciona la lógica", "estado incorrecto", "datos no se actualizan"
- Acciones: implementar lógica, gestionar estado, procesar comandos

### 3D_Agent SE ACTIVA CUANDO:
- Palabras clave: 3D, Three.js, orbe, esfera, partículas, animación 3D, shader, WebGL, canvas, escena, cámara, render
- Archivos mencionados: components/3d/*, three-helpers.js
- Problemas: "el orbe no gira", "faltan partículas", "baja FPS", "no se ve el 3D"
- Acciones: crear visualización 3D, optimizar gráficos, animar orbe

### Auth_Agent SE ACTIVA CUANDO:
- Palabras clave: login, autenticación, Face ID, Touch ID, biométrico, seguridad, contraseña, sesión, token, WebAuthn, Supabase auth
- Archivos mencionados: components/auth/*, services/supabase/auth.js
- Problemas: "no puedo entrar", "Face ID no funciona", "error de autenticación"
- Acciones: configurar autenticación, implementar seguridad

### Integration_Agent SE ACTIVA CUANDO:
- Palabras clave: API, webhook, N8N, integración, endpoint, fetch, axios, serverless, Netlify function, backend
- Archivos mencionados: services/n8n/*, netlify/functions/*, services/api/*
- Problemas: "no conecta con N8N", "webhook falla", "timeout en API"
- Acciones: integrar servicio, configurar webhook, conectar API

### Voice_Agent SE ACTIVA CUANDO:
- Palabras clave: voz, audio, micrófono, hablar, escuchar, comando de voz, speech, reconocimiento, síntesis
- Archivos mencionados: services/voice/*, hooks/useVoice.js
- Problemas: "no reconoce voz", "no habla", "micrófono no funciona"
- Acciones: implementar voz, configurar comandos de voz

### Problem_Solver SE ACTIVA CUANDO:
- Palabras clave: bug, error, debug, optimizar, lento, performance, test, problema, crash, falla, no funciona
- Múltiples agentes involucrados
- Conflictos entre componentes
- Problemas de rendimiento general
- Necesidad de debugging profundo

### Git_Agent SE ACTIVA CUANDO:
- Palabras clave: commit, push, pull, git, repositorio, actualizar repo, subir cambios, GitHub, branch
- Acciones: después de completar cualquier tarea
- Automático: al finalizar trabajo de otros agentes

## 🔄 PLANTILLA DE ANÁLISIS AUTOMÁTICO

```markdown
## 🔍 ANÁLISIS DE TAREA

**Input del usuario**: [descripción del problema]

### 📋 DIAGNÓSTICO AUTOMÁTICO

1. **TIPO DE PROBLEMA DETECTADO**: 
   - [ ] Visual/UI
   - [ ] Lógica/Funcionalidad  
   - [ ] 3D/Animación
   - [ ] Autenticación/Seguridad
   - [ ] Integración/API
   - [ ] Voz/Audio
   - [ ] Performance/Debug
   - [ ] Versionado/Git

2. **ARCHIVOS PROBABLEMENTE AFECTADOS**:
   - [Lista de archivos detectados o inferidos]

3. **AGENTES NECESARIOS** (en orden de ejecución):
   1. [Agente Principal]: [razón]
   2. [Agente Secundario]: [razón]
   3. [Git_Agent]: Actualizar repositorio

4. **PLAN DE ACCIÓN**:
   - Paso 1: [Agente X] - [acción específica]
   - Paso 2: [Agente Y] - [acción específica]
   - Paso 3: [Git_Agent] - Commit y push

### 🚀 EJECUTANDO SOLUCIÓN

[Aquí comienza el trabajo de los agentes seleccionados]
```

## 🎯 EJEMPLOS DE AUTO-DETECCIÓN

### EJEMPLO 1: "El botón de login no se ve bien en móviles"
```
ANÁLISIS: 
- Problema detectado: UI + Responsive
- Agentes activados:
  1. UI_Agent (principal) - Arreglar diseño responsive
  2. Problem_Solver (apoyo) - Verificar en diferentes dispositivos
  3. Git_Agent - Actualizar repo
```

### EJEMPLO 2: "Face ID no funciona y el orbe no gira"
```
ANÁLISIS:
- Problemas detectados: Autenticación + 3D
- Agentes activados:
  1. Auth_Agent - Diagnosticar WebAuthn
  2. 3D_Agent - Revisar animación del orbe
  3. Problem_Solver - Verificar conflictos
  4. Git_Agent - Commit de fixes
```

### EJEMPLO 3: "Necesito agregar un comando de voz para abrir configuración"
```
ANÁLISIS:
- Tarea detectada: Nueva funcionalidad de voz + UI
- Agentes activados:
  1. Voice_Agent - Implementar comando
  2. Core_Agent - Añadir lógica
  3. UI_Agent - Crear/actualizar panel
  4. Git_Agent - Commit de feature
```

### EJEMPLO 4: "La app está muy lenta"
```
ANÁLISIS:
- Problema detectado: Performance
- Agentes activados:
  1. Problem_Solver (principal) - Análisis completo
  2. 3D_Agent - Optimizar renderizado
  3. Core_Agent - Revisar re-renders
  4. UI_Agent - Optimizar componentes
  5. Git_Agent - Commit optimizaciones
```

## 🔧 COMANDOS ESPECIALES DE CONTROL

### FORZAR AGENTE ESPECÍFICO
```
@force:UI_Agent - [tarea]
```

### EXCLUIR AGENTE
```
@exclude:Git_Agent - No actualices el repo aún
```

### MODO DIAGNÓSTICO
```
@diagnose - Solo analiza, no ejecutes
```

### TODOS LOS AGENTES
```
@all-agents - Revisión completa del sistema
```

## 📝 PROTOCOLO DE COORDINACIÓN

### FASE 1: DETECCIÓN
```python
def detect_required_agents(input_text):
    agents = []
    
    # Análisis de keywords
    keywords = extract_keywords(input_text)
    
    # Mapeo a agentes
    for keyword in keywords:
        agent = map_keyword_to_agent(keyword)
        if agent not in agents:
            agents.append(agent)
    
    # Análisis de archivos mencionados
    files = extract_file_paths(input_text)
    for file in files:
        agent = map_file_to_agent(file)
        if agent not in agents:
            agents.append(agent)
    
    return prioritize_agents(agents)
```

### FASE 2: EJECUCIÓN
```python
def execute_agents_sequence(agents, task):
    results = []
    
    for agent in agents:
        print(f"🤖 Activando {agent.name}...")
        result = agent.execute(task, previous_results=results)
        results.append(result)
        
        if result.has_errors:
            activate_problem_solver(result)
    
    # Siempre terminar con Git
    if changes_made:
        Git_Agent.commit_and_push(results)
    
    return compile_final_report(results)
```

### FASE 3: REPORTE
```markdown
## 📊 REPORTE DE EJECUCIÓN

✅ **Agentes Utilizados**: 
- UI_Agent: Componente actualizado
- Core_Agent: Lógica implementada  
- Git_Agent: Commit realizado

📁 **Archivos Modificados**:
- /src/components/ui/Button.jsx
- /src/hooks/useButton.js

🔗 **Commit**: [hash] "feat(ui): improve button responsive design"

⚡ **Próximos Pasos Sugeridos**:
- Testear en dispositivos reales
- Optimizar animaciones
```

## 🚨 REGLAS DE EMERGENCIA

### SI HAY CONFLICTO ENTRE AGENTES:
1. Problem_Solver toma el control
2. Analiza dependencias
3. Establece orden de resolución
4. Ejecuta secuencialmente

### SI UN AGENTE FALLA:
1. Reintentar con parámetros ajustados
2. Si falla 2 veces, llamar a Problem_Solver
3. Si es crítico, detener y reportar

### SI NO SE DETECTAN AGENTES:
1. Pedir clarificación al usuario
2. Sugerir agentes probables
3. Ofrecer análisis manual

## 💬 FRASES DE ACTIVACIÓN RÁPIDA

- "agente ayuda con [problema]" → Auto-detección
- "subagente para [tarea]" → Auto-selección
- "arregla [componente]" → Análisis y fix
- "optimiza todo" → Problem_Solver + todos
- "actualiza repo" → Git_Agent directo
- "debug completo" → Problem_Solver líder

## 🎮 MODO INTERACTIVO

Cuando no estés seguro, pregunta:

```
🤖 WILLY Agent Dispatcher detectó que necesitas ayuda con: [problema]

Creo que necesitas estos agentes:
1. [Agente A] - Para [tarea A]
2. [Agente B] - Para [tarea B]

¿Procedo con este plan? (sí/no/modificar)
```

---

**INSTRUCCIÓN FINAL**: 
Siempre que detectes palabras clave de activación o cualquier problema técnico, ejecuta este sistema de análisis automático ANTES de comenzar cualquier trabajo. Selecciona los agentes apropiados y coordina su ejecución en el orden óptimo.

**RECUERDA**: No todos los problemas necesitan todos los agentes. Sé inteligente y eficiente en la selección.