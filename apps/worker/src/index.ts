export interface Env {
  CHANNELS: DurableObjectNamespace;
}

// Temporary placeholder for our channel Durable Object
export class ChannelDO implements DurableObject {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    return new Response("Channel DO ready", { status: 200 });
  }
}

// Main entry point for our Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", name: "hearth-worker", time: Date.now() }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Hearth Worker Relay is running.", { status: 200 });
  }
};