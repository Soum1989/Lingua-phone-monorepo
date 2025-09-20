# SSL Setup for Lingua Phone on GKE

## Overview

This guide explains how to set up SSL for your Lingua Phone application running on Google Kubernetes Engine (GKE) using Google-managed SSL certificates.

## Prerequisites

1. A domain name (e.g., example.com)
2. Your domain's DNS management access
3. A running GKE cluster with the Lingua Phone application deployed
4. kubectl configured to access your cluster

## Current Application Access

Your application is currently accessible at: http://34.45.239.154

## Steps to Set Up SSL

### 1. Register Your Domain

Before setting up SSL, you need to register your domain `gketurns10.com` with a domain registrar such as:
- Google Domains
- GoDaddy
- Namecheap
- Porkbun
- Cloudflare Registrar

### 2. Configure DNS

After registering your domain, create an A record in your DNS provider's control panel:

- **Name/Host**: `lingua-phone` (or `@` for root domain)
- **Type**: A
- **Value/IP Address**: `34.45.239.154`
- **TTL**: 300 (or default)

This will make your application accessible at: http://lingua-phone.gketurns10.com

Wait for DNS propagation (this can take anywhere from a few minutes to several hours).

### 3. Update Configuration Files

Before applying the configurations, you need to update the domain names in the following files:

#### k8s/managed-certificate.yaml
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

#### k8s/ingress.yaml
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

### 4. Apply the Configuration

Run the setup script:
```bash
./SETUP_SSL.bat
```

### 5. Monitor Certificate Provisioning

Check the certificate status:
```bash
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app
```

The certificate provisioning process can take several minutes to complete after DNS is properly configured.

## Troubleshooting

### Common Issues

1. **Certificate stuck in "Failed" or "Provisioning" state**
   - Verify that your DNS is correctly configured and propagated
   - Ensure there are no typos in the domain name
   - Check that the domain is accessible from the public internet

2. **Ingress not getting an IP address**
   - Verify that the GKE cluster has the necessary permissions
   - Check that the ingress controller is running properly

3. **Mixed content issues**
   - Ensure your application is configured to use HTTPS
   - Update any hardcoded HTTP URLs in your application

## Security Best Practices

1. Always use managed certificates when possible (they auto-renew)
2. Disable HTTP access once HTTPS is working (set `kubernetes.io/ingress.allow-http: "false"`)
3. Regularly monitor certificate expiration dates
4. Use strong encryption settings for your ingress

## Useful Commands

```bash
# Check certificate status
kubectl get managedcertificate -n lingua-app

# Describe certificate details
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app

# Check ingress status
kubectl get ingress lingua-ingress -n lingua-app

# Describe ingress details
kubectl describe ingress lingua-ingress -n lingua-app
```
