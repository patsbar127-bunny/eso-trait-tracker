interface Env {
  ESO_DATA: KVNamespace;
}

function corsHeaders(origin = "*"): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data: unknown, status = 200, origin = "*"): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);

    // GET /debug
    if (url.pathname === "/debug") {
      return jsonResponse({
        ok: true,
        method: request.method,
        pathname: url.pathname,
        storage: "Cloudflare KV",
        hasKV: !!env.ESO_DATA,
      }, 200, origin);
    }

    // POST /save-character
    if (request.method === "POST" && url.pathname === "/save-character") {
      try {
        const body = await request.json() as {
          ownerId: string;
          ownerDisplayName?: string;
          characterName: string;
          traitData: unknown;
        };
        const { ownerId, ownerDisplayName, characterName, traitData } = body;

        if (!ownerId || !characterName) {
          return jsonResponse({ error: "ownerId and characterName required" }, 400, origin);
        }

        const key = `${ownerId}::${characterName}`;
        const content = {
          ownerId,
          ownerDisplayName: ownerDisplayName || "",
          characterName,
          updatedAt: new Date().toISOString(),
          traitData,
        };

        await env.ESO_DATA.put(key, JSON.stringify(content));

        return jsonResponse({ ok: true, key }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: String((err as Error).message || err) }, 500, origin);
      }
    }

    // GET /load-character?ownerId=...&characterName=...
    if (request.method === "GET" && url.pathname === "/load-character") {
      try {
        const ownerId = url.searchParams.get("ownerId");
        const characterName = url.searchParams.get("characterName");

        if (!ownerId || !characterName) {
          return jsonResponse({ error: "ownerId and characterName required" }, 400, origin);
        }

        const key = `${ownerId}::${characterName}`;
        const raw = await env.ESO_DATA.get(key);

        if (!raw) {
          return jsonResponse({ ok: false, error: "Not found" }, 404, origin);
        }

        const content = JSON.parse(raw);
        return jsonResponse({ ok: true, content }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: String((err as Error).message || err) }, 500, origin);
      }
    }

    // GET /list-characters?ownerId=...
    if (request.method === "GET" && url.pathname === "/list-characters") {
      try {
        const ownerId = url.searchParams.get("ownerId");

        if (!ownerId) {
          return jsonResponse({ error: "ownerId required" }, 400, origin);
        }

        const list = await env.ESO_DATA.list({ prefix: `${ownerId}::` });
        const characters = list.keys.map(k => k.name.replace(`${ownerId}::`, ""));

        return jsonResponse({ ok: true, characters }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: String((err as Error).message || err) }, 500, origin);
      }
    }

    // DELETE /delete-character?ownerId=...&characterName=...
    if (request.method === "DELETE" && url.pathname === "/delete-character") {
      try {
        const ownerId = url.searchParams.get("ownerId");
        const characterName = url.searchParams.get("characterName");

        if (!ownerId || !characterName) {
          return jsonResponse({ error: "ownerId and characterName required" }, 400, origin);
        }

        const key = `${ownerId}::${characterName}`;
        await env.ESO_DATA.delete(key);

        return jsonResponse({ ok: true, deleted: key }, 200, origin);
      } catch (err) {
        return jsonResponse({ error: String((err as Error).message || err) }, 500, origin);
      }
    }

    return jsonResponse({ error: "Not found", pathname: url.pathname }, 404, origin);
  },
};