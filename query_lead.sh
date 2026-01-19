#!/bin/bash

# Query for one lead with detailed information
echo "🔍 Querying Salesforce for Lead details..."
echo ""

sf data query \
  --query "SELECT Id, Name, Email, Company, Status, Phone, LeadSource, CreatedDate FROM Lead WHERE Email != NULL LIMIT 1" \
  --target-org demo-org

echo ""
echo "✅ Query complete!"
