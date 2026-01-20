# Things 3 MCP Server

A Model Context Protocol (MCP) server that connects Claude Desktop with Things 3 task management application on macOS.

## Overview

This MCP server enables Claude to interact with Things 3, providing comprehensive task management capabilities through natural language. Claude can read, create, and update todos and projects, search across your task database, and access all standard Things lists and organizational structures.

## Features

### List Views
- **Inbox**: View unorganized tasks
- **Today**: Tasks scheduled for today
- **Upcoming**: Future scheduled tasks
- **Anytime**: Tasks without specific scheduling
- **Someday**: Tasks for later consideration
- **Logbook**: Completed tasks (with configurable time periods)
- **Trash**: Deleted items

### Data Management
- Retrieve todos, projects, areas, tags, and headings
- Optional nested item inclusion for organizational containers
- Complete metadata access including checklists, deadlines, and modification history

### Search Capabilities
- Simple text search across titles and notes
- Advanced filtering by status, dates, tags, areas, and item types
- Recent item queries by creation date

### Task Operations
- Create new todos and projects with full metadata
- Update existing items including status changes
- Natural language scheduling (e.g., "tomorrow", "2024-01-15@14:30")
- Navigation and search within Things app

### Human-Readable Timestamps
Tasks display creation and modification ages in natural language ("3 days ago", "2 weeks ago"), helping identify stale items and track activity.

## Prerequisites

- **macOS**: Things 3 is macOS-only
- **Things 3**: With URL scheme enabled
- **Claude Desktop** or **Claude Code**: For MCP integration
- **uv**: Python package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

## Installation

### Option 1: MCPB Installation (Recommended)

1. Download the `.mcpb` bundle file from the releases
2. Double-click the file to install automatically in Claude Desktop

### Option 2: Manual Setup

1. Clone this repository:
```bash
git clone https://github.com/hald/things-mcp.git
cd things-mcp
```

2. Install dependencies:
```bash
uv sync
```

3. Configure Claude Desktop by editing `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "things": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/things-mcp",
        "run",
        "things_server.py"
      ]
    }
  }
}
```

4. Restart Claude Desktop

## Usage

Once installed, you can ask Claude to interact with your Things tasks:

- "Show me my tasks for today"
- "Create a new todo: Finish the quarterly report, due tomorrow"
- "What tasks are in my Work project?"
- "Search for tasks about the client meeting"
- "Show me tasks I completed in the last week"

## Configuration

### Transport Mode

The server supports two transport modes:

- **stdio** (default): Standard input/output for Claude Desktop
- **http**: HTTP server for alternative integrations

Configure via environment variables in `.env`:
```bash
THINGS_MCP_TRANSPORT=stdio
THINGS_MCP_HOST=127.0.0.1
THINGS_MCP_PORT=8000
```

### Scheduling Format

The `when` parameter accepts:
- Keywords: `today`, `tomorrow`, `evening`, `anytime`, `someday`
- Date strings: `2024-01-15`
- DateTime with reminder: `2024-01-15@14:30`

## Development

### Running Tests
```bash
uv run pytest
```

### Project Structure
```
things-mcp/
├── things_server.py    # Main MCP server
├── url_scheme.py       # Things URL scheme integration
├── formatters.py       # Data formatting utilities
├── pyproject.toml      # Project configuration
├── manifest.json       # MCPB manifest
└── tests/              # Test suite
```

## License

MIT License - see LICENSE file for details

## Credits

Original implementation by [Hal Dick](https://github.com/hald)

Built with:
- [FastMCP](https://github.com/jlowin/fastmcp) - MCP server framework
- [Things.py](https://github.com/thingsapi/things.py) - Things 3 database access
- Things URL Scheme - macOS automation

## Links

- [GitHub Repository](https://github.com/hald/things-mcp)
- [Things 3](https://culturedcode.com/things/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
