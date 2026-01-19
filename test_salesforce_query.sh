#!/bin/bash

# Test query to get one lead from Salesforce
echo "🔍 Querying for one Lead in your Salesforce org..."
echo ""

sf data query \
  --query "SELECT Id, Name, Email, Company, Status FROM Lead LIMIT 1" \
  --target-org demo-org \
  --json | jq -r '.result.records[0] | "Lead found:\n  Name: \(.Name)\n  Email: \(.Email // "No email")\n  Company: \(.Company)\n  Status: \(.Status)"'

echo ""
echo "✅ Query completed!"
