#!/usr/bin/env node
// reg-push2-mcp · MCP stdio server wrapping reg-push2-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'reg-push2-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'reg-push2_load_registry',
    description: 'loadRegistry · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadRegistry } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof loadRegistry === 'function' ? await loadRegistry(args) : { error: 'loadRegistry not callable' };
    }
  },
  {
    name: 'reg-push2_render_chips',
    description: 'renderChips · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderChips } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof renderChips === 'function' ? await renderChips(args) : { error: 'renderChips not callable' };
    }
  },
  {
    name: 'reg-push2_matches_query',
    description: 'matchesQuery · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { matchesQuery } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof matchesQuery === 'function' ? await matchesQuery(args) : { error: 'matchesQuery not callable' };
    }
  },
  {
    name: 'reg-push2_card',
    description: 'card · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { card } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof card === 'function' ? await card(args) : { error: 'card not callable' };
    }
  },
  {
    name: 'reg-push2_escape_html',
    description: 'escapeHtml · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { escapeHtml } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof escapeHtml === 'function' ? await escapeHtml(args) : { error: 'escapeHtml not callable' };
    }
  },
  {
    name: 'reg-push2_escape_attr',
    description: 'escapeAttr · from reg-push2-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { escapeAttr } = await import('@ai-native-solutions/reg-push2-sdk');
      return typeof escapeAttr === 'function' ? await escapeAttr(args) : { error: 'escapeAttr not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('reg-push2-mcp v1.0.0 · stdio ready');
