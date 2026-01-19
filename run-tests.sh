#!/bin/bash

# Run Apex tests
echo "🧪 Running Apex tests in demo-org"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sf apex run test \
  --target-org demo-org \
  --result-format human \
  --code-coverage \
  --wait 10

echo ""
echo "✅ Tests complete!"
