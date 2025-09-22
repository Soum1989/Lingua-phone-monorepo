# Afternoon SSL Deployment - Readiness Checklist

## Pre-Session Preparation (Before 3:00 PM)

### ✅ DNS Configuration
- [ ] Verify A record for lingua-phone.gketurns10.com points to 34.54.239.230
- [ ] Confirm DNS propagation using dnschecker.org
- [ ] Document DNS provider and access credentials

### ✅ Environment Setup
- [ ] Ensure kubectl is properly configured
- [ ] Verify gcloud authentication
- [ ] Test access to GKE cluster
- [ ] Prepare terminal/command prompt with proper permissions

### ✅ Files and Scripts Ready
- [ ] k8s/managed-certificate.yaml
- [ ] k8s/ingress.yaml
- [ ] MONITOR_SSL_CERTIFICATE.bat
- [ ] Backup certificate files (if using self-managed)

### ✅ Monitoring Tools
- [ ] Browser tabs for:
  - [ ] Google Cloud Console
  - [ ] dnschecker.org
  - [ ] Application testing URL
- [ ] Terminal windows ready
- [ ] Text editor for log capture

## Deployment Session (3:00 PM Start)

### Phase 1: Cleanup (3:00 PM)
- [ ] Delete existing managed certificate
- [ ] Delete existing ingress
- [ ] Verify resources are removed

### Phase 2: Deployment (3:30 PM)
- [ ] Apply managed certificate
- [ ] Wait 30 seconds
- [ ] Apply ingress
- [ ] Verify resources are created

### Phase 3: Monitoring (4:00 PM)
- [ ] Start MONITOR_SSL_CERTIFICATE.bat
- [ ] Check status every 5 minutes
- [ ] Document any changes or errors

### Phase 4: Testing (When Active)
- [ ] Access https://lingua-phone.gketurns10.com
- [ ] Test certificate validity
- [ ] Test microphone access
- [ ] Test core application features

## Success Indicators

### Certificate Status
- [ ] kubectl get managedcertificate shows "Active"
- [ ] Domain status shows "True"
- [ ] Browser shows valid certificate

### Application Access
- [ ] HTTPS access works without warnings
- [ ] Microphone permissions granted
- [ ] STT transcription functional
- [ ] All application features working

## Troubleshooting Quick Reference

### If Certificate Fails
- [ ] Check DNS A record again
- [ ] Verify propagation with dnschecker.org
- [ ] Delete and recreate certificate
- [ ] Consider self-managed certificate

### If Ingress Fails
- [ ] Check GKE cluster status
- [ ] Verify service configurations
- [ ] Check firewall rules
- [ ] Review ingress annotations

### If Application Issues
- [ ] Check pod statuses
- [ ] Review logs
- [ ] Verify service connections
- [ ] Test direct IP access

## Emergency Contacts/Links

- Google Cloud Support: [Support Console](https://console.cloud.google.com/support)
- GKE Documentation: [GKE Docs](https://cloud.google.com/kubernetes-engine/docs)
- DNS Checker: [dnschecker.org](https://dnschecker.org)
- Certificate Troubleshooting: [SSL_CERTIFICATE_TROUBLESHOOTING.md](SSL_CERTIFICATE_TROUBLESHOOTING.md)

## Session Notes

Space for documenting what works, what doesn't, and any issues encountered during the deployment:

---

**Session Start Time:** _____
**DNS Confirmed:** _____
**Certificate Deployed:** _____
**Certificate Active:** _____
**Application Working:** _____
**Session End Time:** _____

---

Sweet dreams and see you this afternoon for a successful SSL deployment!