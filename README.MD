# 🤖 WILLY - Personal AI Assistant

![WILLY Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20iOS%20%7C%20Android-lightgrey)

## 📋 Descripción

WILLY es un asistente personal inteligente con interfaz 3D futurista, autenticación biométrica y capacidades de automatización avanzadas. Diseñado para funcionar como una PWA (Progressive Web App) con soporte completo para Face ID en dispositivos iOS.

## 🚀 Características Principales

- **🔐 Autenticación Biométrica**: Face ID/Touch ID nativo vía WebAuthn
- **🌐 Interfaz 3D**: Visualización con Three.js inspirada en asistentes de ciencia ficción
- **🎤 Control por Voz**: Comandos de voz y respuestas sintetizadas
- **🔗 Integración N8N**: Automatizaciones y workflows personalizados
- **📱 PWA**: Instalable como app nativa en iOS/Android
- **☁️ Supabase Backend**: Base de datos y autenticación en la nube
- **🔒 Seguridad**: Encriptación end-to-end y almacenamiento seguro

## 🛠 Tech Stack

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 18 + Vite |
| 3D Graphics | Three.js |
| Styling | Tailwind CSS |
| Authentication | WebAuthn + Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Hosting | Netlify |
| Automation | N8N |
| Voice | Web Speech API |
| Package Manager | npm |

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm 9+
- Cuenta en Supabase
- Cuenta en Netlify
- Instancia de N8N (opcional)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/willy-assistant.git
cd willy-assistant
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_N8N_WEBHOOK=https://tu-n8n.cloud/webhook/willy
```

4. **Configurar Supabase**
```bash
npm run supabase:init
npm run supabase:migrate
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

## 🏗 Arquitectura

```
┌─────────────────────────────────────┐
│           Cliente (PWA)              │
│  ┌─────────┐ ┌──────┐ ┌──────────┐ │
│  │   UI    │ │ 3D   │ │  Voice   │ │
│  │  React  │ │Three │ │   API    │ │
│  └────┬────┘ └──┬───┘ └────┬─────┘ │
│       └─────────┼───────────┘       │
│                 │                    │
└─────────────────┼───────────────────┘
                  │
        ┌─────────▼──────────┐
        │    Netlify Edge    │
        │    Functions       │
        └─────────┬──────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
┌────▼────┐ ┌────▼────┐ ┌────▼────┐
│Supabase │ │   N8N   │ │WebAuthn │
│   DB    │ │Webhooks │ │  Auth   │
└─────────┘ └─────────┘ └─────────┘
```

## 🎮 Uso

### Comandos de Voz

- **"Hey Willy"** - Activar asistente
- **"Estado del sistema"** - Ver diagnóstico
- **"Modo privado"** - Activar encriptación
- **"Ejecuta rutina matutina"** - Automatización personalizada

### Gestos Táctiles (Móvil)

- **Tap**: Activar/Desactivar
- **Swipe Up**: Menú de comandos
- **Long Press**: Configuración

## 🧪 Testing

```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Todos los tests
npm test
```

## 📱 Deployment

### Netlify

1. Conectar repositorio en Netlify
2. Configurar variables de entorno
3. Deploy automático en push a `main`

```bash
# Deploy manual
npm run deploy
```

### iOS/Android

1. Abrir en Safari/Chrome
2. Tap en "Compartir" 
3. "Añadir a pantalla de inicio"

## 🔧 Configuración Avanzada

### Personalizar WILLY

Editar `/src/utils/constants.js`:

```javascript
export const WILLY_CONFIG = {
  name: "WILLY",
  voice: "es-ES",
  theme: "cyberpunk",
  animations: true,
  particles: 1000
};
```

### Agregar Comandos

Editar `/src/services/n8n/commands.js`:

```javascript
export const CUSTOM_COMMANDS = {
  "mi comando": {
    action: "customAction",
    response: "Ejecutando comando personalizado"
  }
};
```

## 📚 Documentación

- [Guía de Agentes](./docs/agents/)
- [API Reference](./docs/API.md)
- [Seguridad](./docs/SECURITY.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Claude Code Guide](./Claude.md)

## 🤝 Contribución

Este es un proyecto personal, pero sugerencias son bienvenidas:

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspiración: JARVIS de Iron Man
- Claude de Anthropic para desarrollo asistido por IA
- Comunidad de React y Three.js

## 📞 Soporte

Para soporte, abrir un issue en GitHub o contactar a: tu-email@ejemplo.com

---

**WILLY** - *Tu asistente personal inteligente* 🤖✨