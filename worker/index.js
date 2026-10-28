const MAX_LENGTH = 500; // keep in sync with diary.maxLength in src/content.js
const PAGE_SIZE = 20;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

/* ---------- Auth ---------- */

async function safeEqual(a, b) {
  const enc = new TextEncoder();
  // Hash both sides so lengths match and the comparison is constant-time
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

async function requireAuth(request, env) {
  if (!env.DIARY_TOKEN) {
    throw new HttpError(500, "DIARY_TOKEN secret is not configured");
  }
  const header = request.headers.get("Authorization") ?? "";
  const match = header.match(/^Bearer (.+)$/);
  if (!match) throw new HttpError(401, "Missing key");
  if (!(await safeEqual(match[1], env.DIARY_TOKEN))) {
    throw new HttpError(401, "Invalid key");
  }
}

/* ---------- Handlers ---------- */

async function listPosts(env, url) {
  const beforeParam = url.searchParams.get("before");
  let before = null;
  if (beforeParam !== null) {
    if (!/^\d+$/.test(beforeParam)) {
      throw new HttpError(400, "Invalid 'before' cursor");
    }
    before = Number(beforeParam);
  }

  const stmt =
    before === null
      ? env.DB.prepare(
          "SELECT id, body, created_at FROM posts ORDER BY id DESC LIMIT ?",
        ).bind(PAGE_SIZE + 1)
      : env.DB.prepare(
          "SELECT id, body, created_at FROM posts WHERE id < ? ORDER BY id DESC LIMIT ?",
        ).bind(before, PAGE_SIZE + 1);

  const { results } = await stmt.all();
  const hasMore = results.length > PAGE_SIZE;
  const posts = hasMore ? results.slice(0, PAGE_SIZE) : results;

  return json({
    posts,
    nextCursor: hasMore ? posts[posts.length - 1].id : null,
  });
}

async function createPost(request, env) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new HttpError(415, "Expected application/json");
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    throw new HttpError(400, "Body is not valid JSON");
  }

  if (typeof payload?.body !== "string") {
    throw new HttpError(400, "'body' must be a string");
  }

  const body = payload.body.trim();
  const length = [...body].length; // count characters, not UTF-16 units
  if (length === 0) throw new HttpError(400, "Post is empty");
  if (length > MAX_LENGTH) {
    throw new HttpError(400, `Post is longer than ${MAX_LENGTH} characters`);
  }

  const post = await env.DB.prepare(
    "INSERT INTO posts (body) VALUES (?) RETURNING id, body, created_at",
  )
    .bind(body)
    .first();

  if (!post) throw new Error("Insert returned no row");
  return json({ post }, 201);
}

async function deletePost(env, id) {
  const result = await env.DB.prepare("DELETE FROM posts WHERE id = ?")
    .bind(id)
    .run();
  if (result.meta.changes === 0) throw new HttpError(404, "Post not found");
  return new Response(null, { status: 204 });
}

/* ---------- Router ---------- */

async function handleApi(request, env, url) {
  const { pathname } = url;
  const { method } = request;

  if (pathname === "/api/posts") {
    if (method === "GET") return listPosts(env, url);
    if (method === "POST") {
      await requireAuth(request, env);
      return createPost(request, env);
    }
    throw new HttpError(405, "Method not allowed");
  }

  const postMatch = pathname.match(/^\/api\/posts\/(\d+)$/);
  if (postMatch) {
    if (method !== "DELETE") throw new HttpError(405, "Method not allowed");
    await requireAuth(request, env);
    return deletePost(env, Number(postMatch[1]));
  }

  if (pathname === "/api/auth") {
    if (method !== "GET") throw new HttpError(405, "Method not allowed");
    await requireAuth(request, env);
    return new Response(null, { status: 204 });
  }

  throw new HttpError(404, "Not found");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    try {
      return await handleApi(request, env, url);
    } catch (err) {
      if (err instanceof HttpError) {
        return json({ error: err.message }, err.status);
      }
      console.error(err);
      return json({ error: "Internal error" }, 500);
    }
  },
};
