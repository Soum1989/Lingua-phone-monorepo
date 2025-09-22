# Built With

## Languages

### Frontend
- **TypeScript** - Primary language for type-safe development
- **JavaScript (ES6+)** - For frontend functionality
- **HTML5** - For structuring the web interface
- **CSS3** - For styling and layout
- **GLSL** - For WebGL shaders in 3D components

### Backend
- **TypeScript** - Primary language for backend services
- **JavaScript (Node.js)** - Runtime environment

## Frameworks & Libraries

### Frontend
- **React 18+** - Component-based UI library
- **Vite** - Next-generation frontend tooling and build system
- **Tailwind CSS** - Utility-first CSS framework
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **axios** - Promise-based HTTP client
- **react-icons** - Icon library for React applications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **@google/generative-ai** - Google Generative AI SDK for Gemini integration
- **@google-cloud/translate** - Google Cloud Translation API client
- **@google-cloud/text-to-speech** - Google Cloud Text-to-Speech API client
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## Platforms & Infrastructure

### Development
- **npm** - Package manager and script runner
- **Monorepo architecture** - Using npm workspaces for managing multiple packages
- **Windows** - Primary development environment (Windows 22H2)

### Deployment
- **Docker** - Containerization platform
- **Google Kubernetes Engine (GKE)** - Managed Kubernetes service
- **Google Cloud Platform (GCP)** - Cloud infrastructure provider

## Cloud Services

### Google Cloud Platform (GCP)
- **Google Cloud Translation API** - For real-time language translation
- **Google Cloud Text-to-Speech (TTS)** - For speech synthesis
- **Google Cloud Speech-to-Text** - For speech recognition (planned)
- **Google Gemini AI** - For shopping assistant and intelligent recommendations
- **Google Cloud Storage** - For storing static assets and service account keys
- **Google Container Registry (GCR)** - For storing Docker images

## Databases

- **In-memory storage** - For temporary data storage in backend services
- **JSON files** - For configuration and mock data

## APIs & Integrations

### Internal APIs
- **RESTful API** - Communication between frontend and backend services
- **WebSocket** - For real-time communication (potential future enhancement)

### External APIs
- **Google Generative AI (Gemini) API** - For AI-powered shopping recommendations
- **Google Cloud Translation API** - For multilingual support
- **Google Cloud Text-to-Speech API** - For audio responses
- **Bazaar Marketplace API** - For product data and recommendations

## Development Tools

### Build Tools
- **Vite** - Frontend build tool with hot module replacement
- **TypeScript Compiler (tsc)** - For compiling TypeScript to JavaScript
- **Docker CLI** - For container management
- **kubectl** - Kubernetes command-line tool

### Code Quality & Testing
- **ESLint** - Static code analysis
- **Prettier** - Code formatting
- **Jest** - JavaScript testing framework (potential future enhancement)

### Version Control
- **Git** - Distributed version control system
- **GitHub** - Git repository hosting service

## DevOps & CI/CD

### Containerization
- **Docker** - For creating containerized applications
- **Docker Compose** - For local development environment orchestration

### Orchestration
- **Kubernetes** - Container orchestration platform
- **Google Kubernetes Engine (GKE)** - Managed Kubernetes service

### Configuration Management
- **Kubernetes ConfigMaps** - For configuration data
- **Kubernetes Secrets** - For sensitive information like API keys

## Security

### Authentication
- **Service Account Keys** - For authenticating with Google Cloud services
- **API Key Management** - For securing external API access

### Data Protection
- **Environment Variables** - For managing sensitive configuration
- **HTTPS** - For secure communication (required for browser APIs)

## Performance & Monitoring

### Performance Optimization
- **Vite** - Fast build times and hot module replacement
- **Tree Shaking** - For reducing bundle sizes
- **Code Splitting** - For optimized loading

### Monitoring
- **Kubernetes Monitoring** - Built-in GKE monitoring
- **Google Cloud Monitoring** - For infrastructure and application metrics

## User Experience

### Accessibility
- **ARIA Labels** - For screen reader support
- **Keyboard Navigation** - For users who cannot use a mouse
- **Responsive Design** - For multiple device sizes

### Internationalization
- **Dynamic Language Support** - 50+ languages supported
- **RTL Support** - For right-to-left languages

## Architecture Patterns

### Design Patterns
- **Microservices Architecture** - Frontend and backend as separate services
- **Service-Oriented Architecture** - Modular backend services
- **Proxy Pattern** - Vite proxy for backend API during development
- **Observer Pattern** - For state management in React components

### State Management
- **React State (useState, useEffect)** - For component-level state
- **Context API** - For global state management

## Networking

### Protocols
- **HTTP/HTTPS** - For API communication
- **TCP** - For Kubernetes service communication

### Load Balancing
- **Google Cloud Load Balancer** - For distributing traffic to frontend service

## Storage

### Static Assets
- **Google Cloud Storage** - For storing images and other static assets

### Configuration
- **Kubernetes ConfigMaps** - For application configuration
- **Environment Variables** - For runtime configuration

## Testing

### Manual Testing
- **Browser Testing** - For UI/UX validation
- **Cross-Language Testing** - For verifying translation functionality
- **Device Testing** - For responsive design validation

## Documentation

### Tools
- **Markdown** - For documentation files
- **GitHub README** - For project documentation

## Deployment Strategy

### Environments
- **Local Development** - Using Docker Compose
- **Production** - Deployed on Google Kubernetes Engine

### Rollout Strategy
- **Blue-Green Deployment** - Potential future enhancement
- **Rolling Updates** - Kubernetes default update strategy

---
*This document provides a comprehensive overview of all technologies, frameworks, platforms, and services used in building the Lingua Phone application.*