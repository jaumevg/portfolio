# Portfolio AWS Architecture Guide

## Overview
This guide describes how to host a static portfolio website on AWS using S3 for static content and Lambda for handling contact form submissions.

## Architecture Components

### 1. Static Website Hosting (S3)
- Host all static files (HTML, CSS, JS) in S3 bucket
- Enable S3 static website hosting
- Optional: Add CloudFront for CDN benefits

### 2. Contact Form Handler (Lambda + API Gateway)
- API Gateway endpoint for form submissions
- Lambda function triggers on form submit
- Can integrate with:
  - AWS SES (Simple Email Service) for sending emails
  - DynamoDB for storing submissions

## Architecture Diagram
```
User -> S3 (Static Website)
     -> API Gateway -> Lambda -> SES (Email)
                            -> DynamoDB (Optional)
```

## Benefits

### Cost-Effective
- S3 hosting is very cheap
- Lambda charges only when form is submitted
- Practically free for low traffic

### Scalable
- Handles any amount of static content traffic
- Lambda auto-scales for form submissions

### Secure
- No exposed server
- AWS handles security patches
- Can add CORS, rate limiting, and WAF

### Maintainable
- Separate concerns (static content vs form handling)
- Easy to update either part independently
- AWS handles infrastructure

## Example Lambda Function

```javascript
exports.handler = async (event) => {
    // Parse form data from event
    const formData = JSON.parse(event.body);
    
    // Send email using SES
    const params = {
        Destination: { ToAddresses: ["your@email.com"] },
        Message: {
            Body: { Text: { Data: formData.message } },
            Subject: { Data: "New Portfolio Contact" }
        },
        Source: "noreply@yourdomain.com"
    };
    
    try {
        await ses.sendEmail(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send email" })
        };
    }
};
```

## Implementation Steps (Future Reference)

1. **S3 Setup**
   - Create S3 bucket
   - Enable static website hosting
   - Configure bucket policy for public access
   - Upload static files

2. **Lambda Setup**
   - Create Lambda function
   - Set up API Gateway trigger
   - Configure necessary IAM roles
   - Implement form handling logic

3. **API Gateway Setup**
   - Create REST API
   - Set up CORS
   - Connect to Lambda function
   - Deploy API

4. **Domain & SSL (Optional)**
   - Set up Route 53 for custom domain
   - Configure CloudFront distribution
   - Add SSL certificate via ACM

## Cost Considerations
- S3: Storage + Data transfer
- Lambda: Free tier includes 1M requests/month
- API Gateway: Free tier includes 1M calls/month
- CloudFront: Optional, pay for data transfer
- SES: Free tier includes 62,000 outbound messages/month

## Security Best Practices
1. Enable CORS properly
2. Implement rate limiting
3. Use AWS WAF for additional security
4. Keep S3 bucket public but restricted
5. Use minimal IAM permissions
