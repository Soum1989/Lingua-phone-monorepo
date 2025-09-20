# Lingua Phone - GKE Deployment Fixes

## Issues Identified and Resolved

### 1. Volume Mounting Issue
**Problem**: The frontend pod was crashing with a "CrashLoopBackOff" error due to incorrect volume mounting configuration.
```
error mounting "/var/lib/kubelet/pods/.../volume-subpaths/nginx-config/lingua-frontend/0" to rootfs at "/etc/nginx/nginx.conf": create mountpoint for /etc/nginx/nginx.conf mount: cannot create subdirectories in "/run/containerd/.../rootfs/etc/nginx/nginx.conf": not a directory
```

**Solution**: Removed the problematic volume mount configuration from `k8s/frontend-deployment.yaml` since the nginx configuration is already baked into the Docker image.

### 2. Nginx Configuration Issue
**Problem**: The nginx configuration in the Docker image was referencing the wrong backend service name.
```
nginx: [emerg] host not found in upstream "backend:3002" in /etc/nginx/nginx.conf:10
```

**Solution**: Updated `docker/nginx-k8s.conf` to use the correct Kubernetes service name:
```nginx
upstream backend {
    server lingua-backend-service:3002;
}
```

## Deployment Status

✅ Frontend pod is now running successfully
✅ Backend pod is running
✅ Frontend service has external IP: 34.45.239.154
✅ Application should be accessible at: http://34.45.239.154

## Verification Commands

```bash
# Check pod status
kubectl get pods -n lingua-app

# Check service status
kubectl get svc -n lingua-app

# Check frontend service details
kubectl describe svc lingua-frontend-service -n lingua-app
```

## SSL Setup (Optional but Recommended)

For production deployments, it's recommended to set up SSL encryption. We've provided the following files to help with this:

1. `k8s/managed-certificate.yaml` - Configuration for Google-managed SSL certificate
2. `k8s/ingress.yaml` - Updated ingress configuration with SSL support
3. `SETUP_SSL.bat` - Script to deploy SSL configuration
4. `CHECK_INGRESS.bat` - Script to check ingress status
5. `SSL_SETUP.md` - Detailed documentation for SSL setup

To set up SSL:
1. Update the domain names in `k8s/managed-certificate.yaml` and `k8s/ingress.yaml`
2. Run `SETUP_SSL.bat`
3. Configure your DNS to point to the ingress IP
4. Wait for the certificate to be provisioned

## Browser Security Considerations

**Important**: Some features will not work properly over HTTP due to browser security restrictions:

### Speech-to-Text (STT) Issues
- **Problem**: Microphone access is blocked on HTTP connections
- **Solution**: Set up SSL (HTTPS) by registering your domain and following the SSL setup guide

### Scenario "Listen to Your Translation" Feature
- **Problem**: Audio playback may be restricted on HTTP
- **Solution**: Same as above - implement SSL for full functionality

### Testing Workaround (Development Only)
For testing purposes only, you can enable insecure origins in Chrome:
1. Open Chrome
2. Go to `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
3. Enable the flag
4. Add your IP address: `http://34.45.239.154`
5. Restart Chrome

**Warning**: This is not recommended for production use.

## Next Steps

1. Access the application at http://34.45.239.154
2. Test all functionality including:
   - Shopping assistant recommendations
   - Multilingual support
   - Product search and display
   - Google Cloud TTS integration
3. Monitor pod logs for any issues:
   ```bash
   kubectl logs -n lingua-app -l app=lingua-frontend
   kubectl logs -n lingua-app -l app=lingua-backend
   ```
4. (Optional) Set up SSL for production use following the SSL_SETUP.md guide to enable full functionality including STT and microphone features
