# Fix DNS Configuration for SSL Certificate

## Problem

The SSL certificate for `lingua-phone.gketurns10.com` is failing because the domain is pointing to the service IP (`34.45.239.154`) instead of the Load Balancer IP (`34.54.239.230`).

## Solution

You need to update your DNS A record to point to the correct Load Balancer IP.

## Steps to Fix DNS Configuration

### 1. Identify Your DNS Provider

Common DNS providers include:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- AWS Route 53
- Azure DNS

### 2. Access Your DNS Management Console

Log in to your DNS provider's management console.

### 3. Locate the A Record

Find the A record for `lingua-phone.gketurns10.com` or the root domain if that's what you're using.

### 4. Update the IP Address

Change the IP address from `34.45.239.154` to `34.54.239.230`.

### 5. Save Changes

Save the DNS record changes.

## DNS Provider Specific Instructions

### GoDaddy
1. Log in to your GoDaddy account
2. Go to "Domains" > "Manage"
3. Select your domain
4. Click "DNS" > "Records"
5. Find the A record for your domain
6. Edit the IP address to `34.54.239.230`
7. Click "Save"

### Namecheap
1. Log in to your Namecheap account
2. Go to "Domain List"
3. Click "Manage" next to your domain
4. Go to "Advanced DNS"
5. Find the A record
6. Update the IP to `34.54.239.230`
7. Click the green checkmark to save

### Google Domains
1. Log in to Google Domains
2. Select your domain
3. Go to "DNS" > "Custom resource records"
4. Find the A record
5. Update the IP to `34.54.239.230`
6. Click "Save"

### Cloudflare
1. Log in to Cloudflare
2. Select your domain
3. Go to "DNS"
4. Find the A record for your domain
5. Click the edit icon
6. Change the IP to `34.54.239.230`
7. Click "Save"

## Verification

After updating the DNS record:

1. Wait 15-30 minutes for DNS propagation
2. Verify the change with:
   ```
   nslookup lingua-phone.gketurns10.com
   ```

3. The result should show:
   ```
   Name:    lingua-phone.gketurns10.com
   Address:  34.54.239.230
   ```

## Monitoring DNS Propagation

You can use online tools to check DNS propagation:
- https://dnschecker.org/
- https://www.whatsmydns.net/

Enter your domain name and check if all DNS servers are returning the correct IP address (`34.54.239.230`).

## After DNS Update

Once DNS propagation is complete:
1. Monitor the SSL certificate status using the `MONITOR_SSL_CERTIFICATE.bat` script
2. The certificate should become active within a few minutes to an hour
3. Access your application via HTTPS: https://lingua-phone.gketurns10.com

## Troubleshooting

If the certificate doesn't become active after DNS propagation:

1. Delete and recreate the managed certificate:
   ```bash
   kubectl delete managedcertificate lingua-frontend-certificate -n lingua-app
   kubectl apply -f k8s/managed-certificate.yaml
   ```

2. Restart the ingress:
   ```bash
   kubectl delete ingress lingua-ingress -n lingua-app
   kubectl apply -f k8s/ingress.yaml
   ```

3. Check the certificate status again:
   ```bash
   kubectl get managedcertificate -n lingua-app
   ```
