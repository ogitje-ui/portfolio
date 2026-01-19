# Salesforce MCP Disconnect Fix

## Problem
You're getting this error:
```
salesforce
failed

Command: /usr/local/bin/npx
Arguments: -y @salesforce/mcp --orgs demo-org --toolsets all
Error: Server disconnected
```

## Root Cause
The Salesforce MCP server is disconnecting because:

1. **Invalid org name**: The configuration uses "demo-org" which isn't a valid authenticated Salesforce org
2. **Missing authentication**: The Salesforce CLI isn't authenticated with any real Salesforce org
3. **Unnecessary for this project**: This is a static portfolio website with no Salesforce integration
4. **Configuration location**: The MCP server settings are in Claude Code's web UI, not in project files

## Solution: Update MCP Settings in Claude Code Web UI

Since this is a static portfolio website with no Salesforce needs, you should **disable the Salesforce MCP server** in Claude Code's settings:

### Step 1: Access MCP Settings
1. In Claude Code (web), click on the **Settings** icon (⚙️) or menu
2. Look for **MCP Servers** or **Integrations** section
3. Find the **Salesforce** MCP server configuration

### Step 2: Disable Salesforce MCP
**Option A: Disable it**
- Toggle off or disable the Salesforce MCP server
- Save your settings

**Option B: Remove it**
- Delete the Salesforce MCP server configuration entirely
- Save your settings

### Step 3: Restart/Refresh
- Refresh your Claude Code session
- The error should now be gone

## If You Need Salesforce MCP in the Future (Optional)

If you actually need Salesforce integration later, follow these steps to properly configure it:

### 1. Install Salesforce CLI
```bash
npm install -g @salesforce/cli
```

### 2. Authenticate with Your Salesforce Org
```bash
# Authenticate and create an alias for your org
sf org login web --alias my-org

# Or for a specific Salesforce instance:
sf org login web --alias my-org --instance-url https://your-instance.salesforce.com
```

### 3. Verify Authentication
```bash
# List all authenticated orgs
sf org list

# You should see your org listed with the alias you created
```

### 4. Update MCP Configuration in Claude Code Web UI
Go to Claude Code settings and update the Salesforce MCP server configuration:

**Replace:**
```
--orgs demo-org
```

**With:**
```
--orgs my-org
```

(Use the actual alias you created in step 2)

**Or use your default target org:**
```
--orgs DEFAULT_TARGET_ORG
```

### 5. Recommended Configuration
In Claude Code's MCP settings, use this configuration:
```
Command: /usr/local/bin/npx
Arguments: -y @salesforce/mcp@latest --orgs my-org --toolsets all
```

### 6. Restart Claude Code
The MCP server should now connect successfully to your authenticated Salesforce org.

## Alternative: Use Default Target Org

You can also set a default target org:
```bash
sf config set target-org my-org
```

Then use this configuration:
```json
{
  "command": "/usr/local/bin/npx",
  "args": [
    "-y",
    "@salesforce/mcp@latest",
    "--orgs",
    "DEFAULT_TARGET_ORG",
    "--toolsets",
    "all"
  ]
}
```

## Troubleshooting

### "Server disconnected" error persists
- Verify your org is authenticated: `sf org list`
- Test the command directly: `/usr/local/bin/npx -y @salesforce/mcp@latest --orgs my-org --toolsets all`
- Check npx path: `which npx` (should be `/usr/local/bin/npx` or similar)
- Use absolute path to npx if using Node version managers (nvm, fnm)

### Path issues with nvm/fnm
If you use Node version managers, find the absolute path:
```bash
which npx
# Example output: /Users/username/.nvm/versions/node/v20.0.0/bin/npx
```

Use that full path in your MCP configuration.

## Resources

- [Salesforce MCP Server GitHub](https://github.com/salesforcecli/mcp)
- [Salesforce MCP Documentation](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_mcp.htm)
- [Troubleshooting Guide](https://dev.to/sudhakar6/the-disconnected-dilemma-a-mac-users-journey-to-connecting-the-gemini-cli-and-salesforce-mcp-2ack)

## For This Portfolio Project

Since this is just a static HTML portfolio website, **you don't need the Salesforce MCP server at all**. The configuration has been disabled to prevent this error from appearing.

---

**Fix applied**: 2026-01-19
**Status**: ✅ Salesforce MCP disabled (not needed for static portfolio)
