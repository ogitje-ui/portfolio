# Salesforce MCP Setup Guide

## Step 1: Authenticate on Your Local Machine

Since Claude Code runs in a web environment, you need to authenticate with Salesforce from your local machine first.

### On Your Local Machine:

1. **Install Salesforce CLI** (if not already installed):
```bash
npm install -g @salesforce/cli
```

2. **Authenticate with your Production/Developer org**:
```bash
sf org login web --alias salesforce-mcp --instance-url https://login.salesforce.com
```

This will:
- Open a browser window
- Prompt you to log in to Salesforce
- Grant access to the Salesforce CLI
- Save the authentication with alias "salesforce-mcp"

3. **Verify authentication**:
```bash
sf org list
```

You should see your org listed with the alias "salesforce-mcp".

4. **Display org details** (to get the username):
```bash
sf org display --target-org salesforce-mcp
```

## Step 2: Configure MCP in Claude Code Web UI

Now that you have an authenticated org on your local machine, update the MCP configuration in Claude Code:

1. **Access Settings** in Claude Code (web)
2. **Find MCP Servers** section
3. **Update the Salesforce MCP configuration**:

**Current Configuration (Broken):**
```
Command: /usr/local/bin/npx
Arguments: -y @salesforce/mcp --orgs demo-org --toolsets all
```

**New Configuration (Fixed):**
```
Command: /usr/local/bin/npx
Arguments: -y @salesforce/mcp@latest --orgs salesforce-mcp --toolsets all
```

**Key Changes:**
- Changed `demo-org` → `salesforce-mcp` (your authenticated org alias)
- Added `@latest` to ensure latest version
- Using the same alias you created during authentication

4. **Save settings** and **refresh** your Claude Code session

## Step 3: Alternative - Use Default Target Org

If you prefer to use your default target org:

1. **Set default org** (on your local machine):
```bash
sf config set target-org salesforce-mcp
```

2. **Update MCP configuration** to use:
```
Arguments: -y @salesforce/mcp@latest --orgs DEFAULT_TARGET_ORG --toolsets all
```

## Step 4: Test the Connection

After updating the configuration in Claude Code:

1. Refresh/restart your Claude Code session
2. The Salesforce MCP should now show as **Connected** ✅
3. You should have access to Salesforce tools and data

## Available Toolsets

The `--toolsets all` flag enables all Salesforce tools. You can specify specific toolsets:

- `orgs` - Org management commands
- `metadata` - Metadata operations
- `data` - Data manipulation
- `users` - User management
- `apex` - Apex code operations

Example with specific toolsets:
```
Arguments: -y @salesforce/mcp@latest --orgs salesforce-mcp --toolsets orgs,metadata,data
```

## Troubleshooting

### "Server disconnected" error persists
- Verify org is authenticated: `sf org list`
- Check org is still active: `sf org display --target-org salesforce-mcp`
- Try re-authenticating: `sf org login web --alias salesforce-mcp`

### "Authentication expired"
```bash
# Re-authenticate with the same alias
sf org login web --alias salesforce-mcp --instance-url https://login.salesforce.com
```

### Can't find npx path
```bash
# Find npx location
which npx

# Use the full path in MCP configuration
# Example: /usr/local/bin/npx or /Users/yourname/.nvm/versions/node/v20.0.0/bin/npx
```

## Security Note

Authentication tokens are stored securely by Salesforce CLI. The MCP server uses these credentials to connect to your Salesforce org. Make sure you're connecting to the correct org (production vs sandbox).

---

**Next Steps:**
1. ✅ Authenticate on your local machine (Step 1)
2. ✅ Update Claude Code MCP settings (Step 2)
3. ✅ Test the connection (Step 4)
