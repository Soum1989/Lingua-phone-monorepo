# Afternoon SSL Certificate Deployment Plan

## Current Status
- SSL certificate provisioning terminated
- Domain: lingua-phone.gketurns10.com
- Load Balancer IP: 34.54.239.230
- Service IP: 34.45.239.154

## Afternoon Deployment Strategy (3:00 PM onwards)

### Phase 1: Pre-Deployment Preparation (3:00 PM - 3:30 PM)

#### 1. Clean Up Existing Resources
```bash
# Delete existing managed certificate
kubectl delete managedcertificate lingua-frontend-certificate -n lingua-app

# Delete existing ingress
kubectl delete ingress lingua-ingress -n lingua-app
```

#### 2. Verify DNS Configuration
Before proceeding, ensure:
- A record for lingua-phone.gketurns10.com points to 34.54.239.230
- DNS has fully propagated (use dnschecker.org to verify)

### Phase 2: Robust SSL Certificate Deployment (3:30 PM - 4:30 PM)

#### 1. Update Configuration Files

**Update managed-certificate.yaml:**
```yaml
apiVersion: networking.gke.io/v1
kind: ManagedCertificate
metadata:
  name: lingua-frontend-certificate
  namespace: lingua-app
spec:
  domains:
    - lingua-phone.gketurns10.com
```

**Update ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: lingua-ingress
  namespace: lingua-app
  annotations:
    kubernetes.io/ingress.class: gce
    networking.gke.io/managed-certificates: lingua-frontend-certificate
    kubernetes.io/ingress.allow-http: "false"
spec:
  rules:
    - host: lingua-phone.gketurns10.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: lingua-frontend-service
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: lingua-backend-service
                port:
                  number: 3002
```

#### 2. Deploy Resources in Correct Order
```bash
# Apply the managed certificate first
kubectl apply -f k8s/managed-certificate.yaml

# Wait 30 seconds for certificate creation
sleep 30

# Apply the ingress
kubectl apply -f k8s/ingress.yaml
```

### Phase 3: Monitoring and Verification (4:30 PM - 5:00 PM)

#### 1. Continuous Monitoring Script
Use the MONITOR_SSL_CERTIFICATE.bat script created earlier:
```bash
MONITOR_SSL_CERTIFICATE.bat
```

#### 2. Manual Verification Commands
```bash
# Check certificate status
kubectl get managedcertificate lingua-frontend-certificate -n lingua-app

# Check detailed certificate information
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app

# Check ingress status
kubectl get ingress -n lingua-app

# Check ingress details
kubectl describe ingress lingua-ingress -n lingua-app
```

### Phase 4: Troubleshooting (If Needed)

#### Common Issues and Solutions:

1. **Certificate Stuck in Provisioning**
   ```bash
   # Delete and recreate
   kubectl delete managedcertificate lingua-frontend-certificate -n lingua-app
   kubectl apply -f k8s/managed-certificate.yaml
   ```

2. **Ingress Not Getting IP**
   ```bash
   # Check GKE cluster status
   kubectl get nodes
   
   # Check if load balancer service is working
   kubectl get svc -n lingua-app
   ```

3. **Domain Verification Failed**
   - Double-check DNS A record points to 34.54.239.230
   - Use online tools like dnschecker.org to verify propagation
   - Wait longer for DNS propagation (up to 1 hour)

### Phase 5: Final Testing (5:00 PM - 5:30 PM)

#### 1. HTTPS Access Test
- Visit https://lingua-phone.gketurns10.com
- Verify the certificate is valid and trusted

#### 2. Microphone Access Test
- Test microphone permissions in the browser
- Verify STT transcription works correctly

#### 3. Application Functionality Test
- Test all core features:
  - AI Shopping Assistant
  - Multilingual support
  - Google Cloud TTS
  - Bazaar Marketplace integration

## Important Notes for Afternoon Session

1. **DNS Propagation**: Ensure DNS changes have fully propagated before starting
2. **Timing**: Google-managed certificates can take 15 minutes to several hours to provision
3. **Monitoring**: Keep the monitoring script running during the process
4. **Backup Plan**: Have a self-managed certificate option ready if Google-managed fails

## Backup Plan: Self-Managed Certificate (If Needed)

If Google-managed certificates continue to fail:

1. Obtain a certificate from Let's Encrypt or another CA
2. Create a Kubernetes secret:
   ```bash
   kubectl create secret tls lingua-frontend-tls \
     --cert=path/to/certificate.crt \
     --key=path/to/private.key \
     --namespace=lingua-app
   ```

3. Update ingress.yaml to use the secret:
   ```yaml
   tls:
   - hosts:
     - lingua-phone.gketurns10.com
     secretName: lingua-frontend-tls
   ```

## Success Criteria

✅ Certificate Status: Active
✅ Domain Status: True
✅ Ingress IP: Assigned
✅ HTTPS Access: Working
✅ Microphone Access: Enabled
✅ Application Features: All working

## Rollback Plan

If issues persist:
1. Revert to HTTP-only access for immediate functionality
2. Use the direct IP access (34.45.239.154) for testing
3. Implement a temporary solution while investigating SSL issues

## Resources

- [SSL_CERTIFICATE_TROUBLESHOOTING.md](SSL_CERTIFICATE_TROUBLESHOOTING.md)
- [FIX_DNS_CONFIGURATION.md](FIX_DNS_CONFIGURATION.md)
- [MONITOR_SSL_CERTIFICATE.bat](MONITOR_SSL_CERTIFICATE.bat)

Get some rest and good luck with the deployment this afternoon!