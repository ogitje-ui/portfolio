# Quick Start - Running Salesforce Queries

## Step 1: Find Your Portfolio Directory

On your Mac, the repository might be in one of these locations:
```bash
# Common locations:
~/portfolio
~/Documents/portfolio
~/Desktop/portfolio
~/Projects/portfolio
~/github/portfolio
```

**To find it, run:**
```bash
# Search for the portfolio directory
find ~ -name "portfolio" -type d 2>/dev/null | grep -v node_modules

# Or use mdfind (Spotlight search)
mdfind -name portfolio | grep -v node_modules
```

## Step 2: Navigate to the Directory

Once you find it, navigate there:
```bash
cd /path/to/your/portfolio
```

For example:
```bash
cd ~/Documents/portfolio
# or
cd ~/Desktop/portfolio
```

## Step 3: Pull Latest Changes

Make sure you have the latest scripts:
```bash
git pull origin claude/fix-salesforce-mcp-disconnect-qowax
```

## Step 4: Run the Query Scripts

**Simple query (1 lead):**
```bash
./query_lead.sh
```

**Detailed query (5 leads with formatting):**
```bash
./query_leads_detailed.sh
```

**Basic test:**
```bash
./test_salesforce_query.sh
```

## Alternative: Run Directly Without Navigating

If you find the path, you can run directly:
```bash
/full/path/to/portfolio/query_lead.sh
```

## Or Clone Fresh (if you don't have it locally)

```bash
cd ~/Desktop  # or wherever you want it
git clone https://github.com/ogitje-ui/portfolio.git
cd portfolio
git checkout claude/fix-salesforce-mcp-disconnect-qowax
./query_lead.sh
```

## Quick One-Liner Query

If you just want to query immediately without the scripts:
```bash
sf data query --query "SELECT Id, Name, Email, Company, Status FROM Lead LIMIT 1" --target-org demo-org
```

This will show you one lead from your Salesforce org (babicko@plauti.com).
