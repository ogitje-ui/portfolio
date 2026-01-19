#!/bin/bash

# Query for multiple leads with nice formatting
echo "🔍 Querying Salesforce for Lead details..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Query for 5 leads
sf data query \
  --query "SELECT Id, Name, Email, Company, Status, Phone, LeadSource FROM Lead WHERE Email != NULL ORDER BY CreatedDate DESC LIMIT 5" \
  --target-org demo-org \
  --json | jq -r '
  if .result.records | length > 0 then
    "Found \(.result.totalSize) lead(s):\n",
    (.result.records[] |
      "\n📧 Lead: \(.Name)",
      "   Company: \(.Company)",
      "   Email: \(.Email // "No email")",
      "   Phone: \(.Phone // "No phone")",
      "   Status: \(.Status)",
      "   Source: \(.LeadSource // "Unknown")",
      "   ID: \(.Id)",
      "   " + ("─" * 60)
    )
  else
    "No leads found in your org."
  end
'

echo ""
echo "✅ Query complete!"
