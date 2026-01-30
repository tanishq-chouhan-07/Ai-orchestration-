# WorkflowOps Postman Testing Guide

This guide walks through importing the Postman collection and running requests in the correct order.

## 1) Import files
- Import the collection: postman/collection.json
- Import the environment: postman/env.json
- Select the environment “WorkflowOps Local” in Postman.

## 2) Update environment values
Open the environment and set:
- baseUrl (default: http://localhost:3000)
- email / password (for the test user)
- instanceApiKey (API key from your n8n instance)
- instanceUrl (ex: http://localhost:5678)
- webhookSignature (optional; only if webhook signature verification is enabled)

## 3) Start the app
Make sure the app is running locally:
- npm run dev

## 4) Run requests in order
### Auth
1. Auth → Register (run once per test email)
2. Auth → Login
3. Auth → Me

### Instances
4. Instances → Create
5. Instances → List
6. Instances → Get By Id
7. Instances → Update

### Workflows (requires instance + n8n)
8. Workflows → List
9. Workflows → Get By Id
10. Workflows → Activate
11. Workflows → Deactivate
12. Workflows → Bulk Activate
13. Workflows → Bulk Deactivate
14. Workflows → Update

### Executions (requires workflows/executions in n8n)
15. Executions → List
16. Executions → Get By Id
17. Executions → Retry
18. Executions → Delete

### Analytics
19. Analytics → Stats
20. Analytics → Costs
21. Analytics → Trends
22. Analytics → Anomalies

### Audit (admin only)
23. Audit → List
24. Audit → List (Before Cursor)

### Retention Policies (admin only)
25. Retention Policies → List
26. Retention Policies → Create
27. Retention Policies → Update
28. Retention Policies → Delete

### System
29. System → Health

### Webhooks
30. Webhooks → n8n Webhook

## Notes
- Login uses the credentials provider endpoint and relies on Postman’s cookie jar. Keep cookies enabled.
- Some requests depend on values captured from previous requests. The collection sets these automatically:
  - instanceId, workflowId, executionId, retentionPolicyId, auditBefore
- If a step fails, re-run the previous step and check environment values.
