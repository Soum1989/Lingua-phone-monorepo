# SSL Certificate Troubleshooting for Lingua Phone Application

## Current Status

The Google-managed SSL certificate `mcrt-0e4ae9e0-4b5c-4a0b-8735-a65870bf6ccd` for `lingua-phone.gketurns10.com` is currently in `PROVISIONING` status with domain status `FAILED_NOT_VISIBLE`. This indicates that Google's certificate authority cannot verify ownership of the domain.

## Root Cause Analysis

Based on our investigation, the issue is likely due to one of the following reasons:

1. **DNS Propagation Delay**: The DNS records may not have fully propagated yet
2. **DNS Configuration Issues**: The A record might not be correctly pointing to the Load Balancer IP
3. **Firewall Restrictions**: Network restrictions might be preventing certificate validation
4. **Domain Verification Issues**: Google's certificate authority cannot verify domain ownership

## Diagnostic Results

### Service and Ingress Status
- Frontend Service External IP: `34.45.239.154`
- Ingress Load Balancer IP: `34.54.239.230`
- Domain Resolution: ✅ `lingua-phone.gketurns10.com` resolves to `34.45.239.154`
- Ping Test: ✅ Domain is reachable

### Certificate Status
- Certificate Name: `mcrt-0e4ae9e0-4b5c-4a0b-8735-a65870bf6ccd`
- Status: `PROVISIONING`
- Domain Status: `FAILED_NOT_VISIBLE`

## Detailed Troubleshooting Steps

### 1. Verify DNS Configuration

The domain `lingua-phone.gketurns10.com` should point to the Load Balancer IP (`34.54.239.230`), not the service IP (`34.45.239.154`).

#### Current DNS Issue:
The domain is currently pointing to the service IP instead of the Load Balancer IP.

#### Solution:
Update your DNS A record to point to the Load Balancer IP:
```
A record: lingua-phone.gketurns10.com → 34.54.239.230
```

### 2. Check DNS Propagation

After updating DNS records, wait for propagation:
```bash
# Check DNS resolution
nslookup lingua-phone.gketurns10.com

# Check if it resolves to the Load Balancer IP
dig lingua-phone.gketurns10.com A
```

### 3. Verify Load Balancer Configuration

Ensure the ingress is properly configured:
```bash
# Check ingress status
kubectl get ingress -n lingua-app

# Check ingress details
kubectl describe ingress lingua-ingress -n lingua-app

# Check managed certificate
kubectl get managedcertificate -n lingua-app
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app
```

### 4. Check Firewall Rules

Ensure HTTP/HTTPS traffic is allowed:
```bash
# Check firewall rules
gcloud compute firewall-rules list --filter="name~lingua"
```

## Solution Implementation

### Step 1: Update DNS Records

1. Access your DNS provider's management console
2. Locate the A record for `lingua-phone.gketurns10.com`
3. Update the IP address from `34.45.239.154` to `34.54.239.230`
4. Save the changes

### Step 2: Wait for DNS Propagation

DNS propagation can take anywhere from a few minutes to 48 hours. Typically it takes 15-30 minutes.

### Step 3: Monitor Certificate Status

After DNS propagation, monitor the certificate status:
```bash
# Check certificate status every 5 minutes
kubectl get managedcertificate -n lingua-app

# Check detailed status
kubectl describe managedcertificate lingua-frontend-certificate -n lingua-app
```

### Step 4: Force Certificate Re-provisioning (If Needed)

If the certificate doesn't update after DNS propagation:

1. Delete the existing managed certificate:
```bash
kubectl delete managedcertificate lingua-frontend-certificate -n lingua-app
```

2. Recreate the managed certificate:
```bash
kubectl apply -f k8s/managed-certificate.yaml
```

3. Update the ingress to reference the new certificate:
```bash
kubectl apply -f k8s/ingress.yaml
```

## Automated Monitoring Script

Create a script to monitor the certificate status:

```bash
#!/bin/bash
# monitor-ssl-status.sh

echo "Monitoring SSL Certificate Status for lingua-phone.gketurns10.com"
echo "============================================================="

while true; do
    echo "$(date): Checking certificate status..."

    STATUS=$(kubectl get managedcertificate lingua-frontend-certificate -n lingua-app -o jsonpath='{.status.certificateStatus}')
    DOMAIN_STATUS=$(kubectl get managedcertificate lingua-frontend-certificate -n lingua-app -o jsonpath='{.status.domainStatus[0].status}')

    echo "Certificate Status: $STATUS"
    echo "Domain Status: $DOMAIN_STATUS"

    if [ "$STATUS" == "Active" ] && [ "$DOMAIN_STATUS" == "True" ]; then
        echo "✅ SSL Certificate is now Active!"
        echo "Your application should be accessible via HTTPS at https://lingua-phone.gketurns10.com"
        break
    fi

    echo "⏳ Waiting for certificate activation... Checking again in 60 seconds."
    echo "-------------------------------------------------------------"
    sleep 60
done
```

## Verification Steps

Once the certificate is active:

1. Access your application via HTTPS:
   - https://lingua-phone.gketurns10.com

2. Verify the certificate is valid:
   - Click the lock icon in your browser
   - Check that the certificate is issued by Google Trust Services

3. Test microphone and STT functionality:
   - The browser should now allow microphone access over HTTPS
   - STT transcription should work properly

## Common Issues and Solutions

### Issue 1: Certificate Stuck in PROVISIONING
**Solution**:
- Verify DNS points to Load Balancer IP, not Service IP
- Wait for DNS propagation (up to 48 hours)
- Delete and recreate the certificate if needed

### Issue 2: Domain Status FAILED_NOT_VISIBLE
**Solution**:
- Ensure DNS A record points to correct Load Balancer IP
- Check DNS propagation with online tools
- Confirm domain is publicly resolvable

### Issue 3: Microphone Access Still Denied
**Solution**:
- Ensure you're accessing the application via HTTPS
- Check that the certificate is valid and trusted
- Clear browser cache and try again

## Prevention for Future Deployments

1. Always configure DNS to point to Load Balancer IP before creating SSL certificates
2. Use DNS management tools that provide propagation status
3. Implement monitoring for certificate status
4. Document the correct IP addresses for future reference

## Additional Resources

- [Google Cloud Load Balancing SSL Certificates Documentation](https://cloud.google.com/load-balancing/docs/ssl-certificates)
- [GKE Ingress with Google-managed SSL certificates](https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs)
- [DNS Propagation Checker Tools](https://dnschecker.org/)

## Next Steps

1. Update DNS records to point to Load Balancer IP (`34.54.239.230`)
2. Wait for DNS propagation (15-30 minutes)
3. Monitor certificate status with the provided script
4. Verify HTTPS access once certificate is active
5. Test microphone and STT functionality
