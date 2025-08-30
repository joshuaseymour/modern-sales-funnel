# 🚀 **Complete MCP Servers Setup Guide for 2025 Tech Stack**

## **🎯 Overview - Your Complete MCP Setup**

You now have **6 official MCP servers** configured for the ultimate development experience:

1. **🎨 Magic UI Pro** - Premium component library (Individual License)
2. **🧩 shadcn/ui** - Complete UI component ecosystem  
3. **🗄️ Supabase** - Database and backend operations
4. **📚 Framework Docs** - Real-time Next.js/React/TypeScript documentation
5. **🎨 Figma Integration** - Design-to-code workflow
6. **⚡ n8n Automation** - Workflow automation and node documentation

## **Step-by-Step Installation**

### **1. Locate Your Claude Desktop Config**

**macOS:**
```bash
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%/Claude/claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

### **2. Get Your API Keys**

#### **Magic UI Pro API Key:**
1. Log into your Magic UI Pro account
2. Navigate to Settings → API Keys
3. Generate a new API key for MCP integration
4. Copy the key for later use

#### **Supabase Setup:**
1. Go to your Supabase dashboard
2. Navigate to Settings → Access Tokens
3. Create a new personal access token
4. Name it "Claude MCP Server"
5. Copy both your project ref and access token

#### **Figma Token (Optional):**
1. Go to Figma → Settings → Account
2. Scroll to Personal Access Tokens
3. Generate a new token
4. Copy for later use

#### **Vercel Token (Optional):**
1. Go to Vercel dashboard
2. Navigate to Settings → Tokens
3. Create a new token for MCP integration

#### **n8n Setup (Optional):**
1. Go to your n8n instance (self-hosted or cloud)
2. Navigate to Settings → API
3. Generate a new API key
4. Copy your n8n instance URL (e.g., https://your-n8n.domain.com)

### **3. Configure Claude Desktop**

Replace the placeholder values in the provided `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "magicui-pro": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"],
      "env": {
        "MAGICUI_API_KEY": "mui_pro_xxxxxxxxxxxxxxxx"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y", 
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=abcdefghijklmnop"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_xxxxxxxxxxxxxxxx"
      }
    },
    "augments-docs": {
      "command": "npx",
      "args": ["-y", "augments-mcp-server@latest"],
      "env": {
        "FRAMEWORKS": "nextjs,react,typescript,tailwindcss,framer-motion"
      }
    },
    "n8n-mcp": {
      "command": "npx",
      "args": ["-y", "n8n-mcp@latest"],
      "env": {
        "N8N_INSTANCE_URL": "YOUR_N8N_INSTANCE_URL_HERE",
        "N8N_API_KEY": "YOUR_N8N_API_KEY_HERE"
      }
    }
  }
}
```

### **4. Apply Configuration**

1. Copy the contents from `claude_desktop_config.json` in this project
2. Paste it into your Claude Desktop config file location
3. Replace all placeholder values with your actual API keys
4. Save the file
5. Restart Claude Desktop

### **5. Verify Installation**

After restarting Claude Desktop:

1. Start a new conversation
2. Look for the hammer (🔨) icon indicating MCP servers are loaded
3. You should see all configured servers listed
4. Test by asking: "Show me Magic UI Pro components for hero sections"

## **What Each MCP Server Provides**

### **🎨 Magic UI Pro**
- **Premium Components**: Advanced animations, effects, layouts
- **Hero Sections**: Video dialogs, interactive backgrounds
- **Text Effects**: Morphing text, gradient animations, sparkles
- **Layout Components**: Bento grids, dock menus, file trees
- **Interactive Elements**: Orbiting circles, progress bars, marquees

### **🗄️ Supabase**  
- **Database Operations**: Query execution, table management
- **Real-time Features**: Live data updates, subscriptions
- **Authentication**: User management, session handling
- **Storage**: File upload/download, bucket management
- **Edge Functions**: Serverless function management

### **📚 Augments Documentation**
- **Next.js 15.5.2**: Latest App Router, Turbopack features
- **React 19.1.1**: Server Components, Actions, latest hooks
- **TypeScript 5.9.2**: Advanced types, strict mode patterns
- **TailwindCSS 4.1.12**: @theme syntax, CSS-first configuration
- **Framer Motion 12.23.12**: Latest animation patterns

### **🎨 Figma to React** (Optional)
- **Design Conversion**: Figma designs → React components
- **Tailwind Integration**: Automatic Tailwind class generation
- **Accessibility**: Auto-generated ARIA attributes
- **Component Export**: Ready-to-use React components

### **🚀 Vercel Integration** (Optional)
- **Deployment Management**: Direct deployment from Claude
- **Project Configuration**: Environment variables, settings
- **Analytics**: Performance metrics, usage data
- **Edge Functions**: Serverless function deployment

### **⚡ n8n Workflow Automation** (Optional)
- **Node Documentation**: Access to 535 n8n nodes with 99% property coverage
- **Workflow Creation**: AI-assisted workflow building and optimization
- **Node Operations**: 63.6% node operation coverage for advanced automation
- **AI-Capable Nodes**: 263 nodes specifically optimized for AI integrations
- **Safety Features**: Built-in warnings for production workflow protection

## **Troubleshooting**

### **Common Issues:**

1. **MCP servers not appearing:**
   - Ensure Node.js is installed
   - Check file path is correct
   - Restart Claude Desktop completely

2. **Authentication errors:**
   - Verify API keys are correct
   - Check token permissions/scopes
   - Ensure no extra spaces in keys

3. **Command not found errors:**
   - Run `npm install -g npm@latest` to update npm
   - Clear npm cache: `npm cache clean --force`

### **Testing Commands:**

```bash
# Test Magic UI Pro
npx -y @magicuidesign/mcp@latest --help

# Test Supabase MCP
npx -y @supabase/mcp-server-supabase@latest --help

# Test Augments
npx -y augments-mcp-server@latest --help

# Test n8n MCP
npx -y n8n-mcp@latest --help
```

## **Next Steps**

Once configured, you can:

1. **Ask for Magic UI components**: "Show me a hero section with video background"
2. **Manage Supabase data**: "Create a table for user profiles"
3. **Get latest docs**: "What's new in Next.js 15.2.2 App Router?"
4. **Convert designs**: "Turn this Figma design into a React component"
5. **Automate workflows**: "Create an n8n workflow for lead generation"

Your Claude Code environment will now have direct access to all the premium tools and documentation for your cutting-edge 2025 tech stack!