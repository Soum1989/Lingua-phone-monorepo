# GKE Deployment Checklist for GKE Turns 10 Hackathon

## Pre-deployment Checklist

### 1. Project Setup
- [ ] Google Cloud Project created with billing enabled
- [ ] Required APIs enabled (GKE, Translation, TTS, STT, Gemini)
- [ ] IAM service account created with proper permissions
- [ ] Service account key generated and secured

### 2. GKE Cluster Configuration
- [ ] GKE cluster created with appropriate node configuration
- [ ] kubectl context configured to connect to GKE cluster
- [ ] Cluster has sufficient resources for deployment

### 3. Application Configuration
- [ ] Environment variables updated in Kubernetes manifests
- [ ] Docker images built and pushed to Google Container Registry
- [ ] Secrets created for API keys and service account
- [ ] Configuration files validated for syntax errors

### 4. Security
- [ ] Network policies configured (if needed)
- [ ] Proper RBAC roles assigned
- [ ] Secrets properly managed (no hardcoded keys)
- [ ] TLS certificates configured for HTTPS (if needed)

## Deployment Steps

### 1. Prepare Kubernetes Resources
- [ ] Update `YOUR_PROJECT_ID` placeholders in all YAML files
- [ ] Verify all image tags in deployment files
- [ ] Check resource requests and limits
- [ ] Validate service configurations

### 2. Deploy Base Application (Online Boutique)
- [ ] Clone Google's Online Boutique repository
- [ ] Deploy to GKE using provided manifests
- [ ] Verify all services are running
- [ ] Test base application functionality

### 3. Deploy AI Shopping Assistant
- [ ] Apply backend deployment
- [ ] Apply frontend deployment
- [ ] Apply service configurations
- [ ] Apply ingress configuration
- [ ] Apply HPA configurations

### 4. Configure Secrets and Environment
- [ ] Create Google Cloud service account secret
- [ ] Create AI API key secrets
- [ ] Verify environment variables are correctly set
- [ ] Test service connectivity

## Post-deployment Verification

### 1. Service Availability
- [ ] Frontend service accessible via LoadBalancer
- [ ] Backend API endpoints responding
- [ ] AI services (Gemini, Translation, TTS, STT) functional
- [ ] Online Boutique services integrated properly

### 2. Functionality Testing
- [ ] Multilingual chat functionality working
- [ ] Voice input/output functioning
- [ ] Product search and recommendations working
- [ ] Cart management operations successful

### 3. Performance and Scaling
- [ ] HPA configured and functional
- [ ] Resource utilization within expected limits
- [ ] Response times acceptable
- [ ] Application handles concurrent users

### 4. Monitoring
- [ ] Logging configured
- [ ] Monitoring dashboards set up
- [ ] Health checks passing
- [ ] Alerting configured (if needed)

## Hackathon Submission Requirements

### 1. Technical Submission
- [ ] Hosted project URL accessible
- [ ] Public code repository URL provided
- [ ] Architecture diagram included
- [ ] ~3-minute demo video recorded

### 2. Documentation
- [ ] Text description of features and technologies
- [ ] Technologies used clearly documented (GKE, ADK, MCP, A2A)
- [ ] Data sources and integration methods explained
- [ ] Findings and learnings summarized

### 3. Compliance Verification
- [ ] Base application (Online Boutique) not modified
- [ ] New components built as separate services
- [ ] Integration only through existing APIs
- [ ] All required technologies implemented

## Optional Enhancements
- [ ] Agent Development Kit (ADK) integration
- [ ] Model Context Protocol (MCP) implementation
- [ ] Agent2Agent (A2A) protocol usage
- [ ] kubectl-ai integration
- [ ] Gemini CLI usage

## Final Pre-submission Checklist
- [ ] All checklist items completed
- [ ] Demo video reviewed and finalized
- [ ] Documentation proofread and finalized
- [ ] Repository made public
- [ ] Hosted URL tested and working
- [ ] All team members can access submission
