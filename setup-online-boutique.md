# Online Boutique Setup for GKE Hackathon

## 1. Clone and Deploy Online Boutique

```bash
# Clone Google's Online Boutique
git clone https://github.com/GoogleCloudPlatform/microservices-demo.git online-boutique
cd online-boutique

# Deploy to GKE
kubectl apply -f ./release/kubernetes-manifests.yaml

# Get external IP
kubectl get service frontend-external
```

## 2. Verify Base Application

```bash
# Check all pods are running
kubectl get pods

# Test the application
# Visit the external IP in browser
```

## 3. Understanding Online Boutique APIs

Key services we'll integrate with:
- **Product Catalog Service**: Get product information
- **Cart Service**: Manage shopping cart
- **Recommendation Service**: Get product recommendations
- **Frontend Service**: Main user interface

## 4. Integration Points

Our AI agents will interact with:
- `/api/products` - Product catalog
- `/api/cart` - Shopping cart operations
- `/api/recommendations` - Product recommendations
- WebSocket connections for real-time chat

## 5. Next Steps

1. Deploy Online Boutique
2. Create our AI agent services alongside it
3. Integrate via service mesh or direct API calls
4. Add multilingual chat interface overlay
