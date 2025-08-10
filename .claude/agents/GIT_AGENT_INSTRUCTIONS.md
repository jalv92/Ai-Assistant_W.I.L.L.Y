# 🔧 GIT AGENT - Instrucciones Críticas para Control de Versiones

## ⚠️ ADVERTENCIA IMPORTANTE - LEER ANTES DE HACER PUSH

### ❌ PROBLEMA CONOCIDO: git push CLI NO FUNCIONA
El comando `git push` desde la línea de comandos **FALLARÁ** con el siguiente error:
```
fatal: could not read Username for 'https://github.com': No such device or address
```

### ✅ SOLUCIÓN OBLIGATORIA: Usar MCP de GitHub

## 📋 Flujo de Trabajo Correcto

### 1. Para operaciones LOCALES (✅ Funcionan con git CLI):
```bash
# Estos comandos SÍ funcionan:
git status
git add .
git commit -m "mensaje"
git branch
git checkout
git merge
git pull
git log
git diff
```

### 2. Para PUSH a GitHub (⚠️ USAR MCP):

#### Opción A: Push de archivo único
```javascript
// Usar la herramienta MCP:
mcp__github-mcp__create_or_update_file
// Parámetros:
{
  "owner": "jalv92",
  "repo": "Ai-Assistant_W.I.L.L.Y",
  "path": "ruta/archivo.js",
  "content": "contenido del archivo",
  "message": "commit message",
  "branch": "master",
  "sha": "SHA_actual" // Requerido si el archivo ya existe
}
```

#### Opción B: Push de múltiples archivos
```javascript
// Usar la herramienta MCP:
mcp__github-mcp__push_files
// Parámetros:
{
  "owner": "jalv92",
  "repo": "Ai-Assistant_W.I.L.L.Y",
  "branch": "master",
  "files": [
    {"path": "archivo1.js", "content": "contenido1"},
    {"path": "archivo2.js", "content": "contenido2"}
  ],
  "message": "commit message"
}
```

## 🚀 Flujo Recomendado para Git Agent

### Paso 1: Hacer cambios localmente
```bash
# Editar archivos
# Usar git add y commit localmente
git add .
git commit -m "feat: nueva funcionalidad"
```

### Paso 2: Obtener lista de archivos modificados
```bash
git diff --name-only HEAD~1
# O para archivos staged:
git diff --cached --name-only
```

### Paso 3: Leer contenido de archivos modificados
```bash
# Para cada archivo modificado
cat archivo.js
```

### Paso 4: Push usando MCP
```javascript
// Recopilar todos los archivos y usar:
mcp__github-mcp__push_files
```

## 📌 Información del Repositorio

- **Owner**: jalv92
- **Repo**: Ai-Assistant_W.I.L.L.Y
- **Branch principal**: master
- **URL**: https://github.com/jalv92/Ai-Assistant_W.I.L.L.Y

## 🔄 Sincronización

### Pull (✅ Funciona con git CLI):
```bash
git pull origin master --rebase
```

### Push (⚠️ SOLO con MCP):
- NO usar: `git push`
- SÍ usar: herramientas MCP de GitHub

## 🛠️ Troubleshooting

### Si necesitas verificar el SHA de un archivo:
```javascript
mcp__github-mcp__get_file_contents
{
  "owner": "jalv92",
  "repo": "Ai-Assistant_W.I.L.L.Y",
  "path": "archivo.js"
}
// El SHA estará en la respuesta
```

### Si necesitas crear un branch:
```javascript
mcp__github-mcp__create_branch
{
  "owner": "jalv92",
  "repo": "Ai-Assistant_W.I.L.L.Y",
  "branch": "nuevo-branch",
  "from_branch": "master"
}
```

## ⚡ Script Helper Recomendado

Para facilitar el proceso, puedes crear este script helper:

```bash
#!/bin/bash
# git-push-mcp.sh
echo "🔍 Detectando archivos modificados..."
FILES=$(git diff --name-only HEAD~1)

echo "📦 Preparando push via MCP..."
for file in $FILES; do
    echo "  - $file"
done

echo "⚠️  Recuerda: Usa mcp__github-mcp__push_files para hacer el push"
echo "📝 Archivos listos para push via MCP"
```

## 🚨 RECORDATORIO FINAL

**NUNCA** intentes hacer `git push` directamente.
**SIEMPRE** usa las herramientas MCP de GitHub para push.
**CONFIRMA** que el push fue exitoso verificando en GitHub.

---
*Última actualización: 2025-08-10*
*Problema identificado y documentado por Claude Code*