export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Keys are sent in a header, which only allows visible ASCII
const VALID_KEY = /^[\x21-\x7E]+$/;

function assertValidKey(token) {
  if (!VALID_KEY.test(token)) {
    throw new ApiError(
      400,
      "That doesn't look like a key. Paste only the key itself: one line, no spaces or extra text.",
    );
  }
}

async function request(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (token !== undefined) {
    assertValidKey(token);
    headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  const isJson = (res.headers.get("content-type") ?? "").includes(
    "application/json",
  );
  if (!isJson) {
    throw new ApiError(
      res.status,
      `Unexpected response from ${path} (${res.status}). Is the API running?`,
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.error ?? `Request failed (${res.status})`,
    );
  }
  return data;
}

export async function fetchPosts(before) {
  const query = before ? `?before=${encodeURIComponent(before)}` : "";
  const data = await request(`/api/posts${query}`);
  if (!Array.isArray(data?.posts)) {
    throw new ApiError(500, "Malformed posts response");
  }
  return data;
}

export async function createPost(token, body) {
  const data = await request("/api/posts", {
    method: "POST",
    token,
    body: { body },
  });
  if (!data?.post) throw new ApiError(500, "Malformed create response");
  return data.post;
}

export async function deletePost(token, id) {
  await request(`/api/posts/${id}`, { method: "DELETE", token });
}

export async function verifyToken(token) {
  await request("/api/auth", { token });
}
