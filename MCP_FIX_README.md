# Salesforce MCP Disconnect Fix

## Problem
You were getting this error:
```
salesforce
failed

Command: /usr/local/bin/npx
Arguments: -y @salesforce/mcp --orgs demo-org --toolsets all
Error: Server disconnected
```

## Root Cause
The Salesforce MCP server was disconnecting because:

1. **Invalid org name**: The configuration used "demo-org" which isn't a valid authenticated Salesforce org
2. **Missing authentication**: The Salesforce CLI wasn't authenticated with any real Salesforce org
3. **Unnecessary for this project**: This is a static portfolio website with no Salesforce integration

## Solution Applied

I've created a `.claude/mcp-config.json` file that **disables** the Salesforce MCP server since it's not needed for this portfolio website.

## If You Need Salesforce MCP (Optional)

If you actually need Salesforce integration in the future, follow these steps:

### 1. Install Salesforce CLI
```bash
npm install -g @salesforce/cli
```

### 2. Authenticate with Your Org
```bash
sf org login web --alias my-org
# Or for a specific instance:
sf org login web --alias my-org --instance-url https://your-instance.salesforce.com
```

### 3. Verify Authentication
```bash
sf org list
```

### 4. Update MCP Configuration
Edit `.claude/mcp-config.json` and:
- Change `"disabled": true` to `"disabled": false`
- Replace `"YOUR_ORG_ALIAS_HERE"` with your actual org alias (e.g., "my-org")

### 5. Restart Claude Code
The MCP server should now connect successfully.

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
