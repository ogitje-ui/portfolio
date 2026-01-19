#!/bin/bash

# Deploy Apex classes to Salesforce
echo "🚀 Deploying to Salesforce org: demo-org"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Deploy all classes
sf project deploy start \
  --source-dir force-app/main/default/classes \
  --target-org demo-org \
  --wait 10

echo ""
echo "✅ Deployment complete!"
echo ""
echo "To run tests, use: ./run-tests.sh"
