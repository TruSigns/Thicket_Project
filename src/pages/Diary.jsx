import { useCallback, useEffect, useState } from "react";
import PageBanner from "../components/PageBanner";
import { diary } from "../content";
import {
  ApiError,
  createPost,
  deletePost,
  fetchPosts,
  verifyToken,
} from "../lib/diaryApi";
import "../styles/diary.css";

const TOKEN_KEY = "thicket.diaryToken";
const POLL_MS = 30_000;
const CLOCK_MS = 60_000;

/* ---------- Token storage ---------- */
function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null; // storage blocked: owner just re-enters the key
  }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: key lives for this visit only
  }
}

/* ---------- Formatting ---------- */
const fullDate = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});
const shortDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});
const yearDate = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function timeAgo(iso, now) {
  const then = new Date(iso);
  const seconds = Math.max(0, Math.round((now - then.getTime()) / 1000));
  if (seconds < 45) return "now";
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.round(seconds / 86400)}d`;
  return then.getFullYear() === new Date(now).getFullYear()
    ? shortDate.format(then)
    : yearDate.format(then);
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

function renderBody(text) {
  return text.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer noopener">
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      part
    ),
  );
}

const initials = diary.author.name
  .split(/\s+/)
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

/* ---------- Icons ---------- */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function LockIcon({ open }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" {...stroke} />
      <path
        d={
          open ? "M5.5 7V5a2.5 2.5 0 0 1 4.8-1" : "M5.5 7V5a2.5 2.5 0 0 1 5 0v2"
        }
        {...stroke}
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"
        {...stroke}
      />
    </svg>
  );
}

/* ---------- Pieces ---------- */
function Avatar() {
  return (
    <div className="avatar" aria-hidden="true">
      {initials}
    </div>
  );
}

function UnlockForm({ onUnlock, onCancel }) {
  const [key, setKey] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  async function submit(event) {
    event.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) return;
    setChecking(true);
    setError(null);
    try {
      await verifyToken(trimmed);
      onUnlock(trimmed);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "That key didn't work."
          : err.message,
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <form className="unlock" onSubmit={submit}>
      <input
        className="diary-input"
        type="password"
        placeholder="Diary key"
        autoComplete="current-password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="btn btn--primary"
        disabled={checking || !key.trim()}
      >
        {checking ? "Checking…" : "Unlock"}
      </button>
      <button type="button" className="btn btn--ghost" onClick={onCancel}>
        Cancel
      </button>
      {error && (
        <p className="diary-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

function Composer({ token, onPosted, onAuthLost }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const length = [...text.trim()].length;
  const remaining = diary.maxLength - length;
  const canPost = length > 0 && remaining >= 0 && !sending;

  async function submit(event) {
    event?.preventDefault();
    if (!canPost) return;
    setSending(true);
    setError(null);
    try {
      const post = await createPost(token, text.trim());
      setText("");
      onPosted(post);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onAuthLost();
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) submit();
  }

  let countClass = "composer-count";
  if (remaining < 0) countClass += " is-over";
  else if (remaining <= 20) countClass += " is-near";

  return (
    <form className="composer" onSubmit={submit}>
      <Avatar />
      <div className="composer-main">
        <label htmlFor="diary-compose" className="visually-hidden">
          New post
        </label>
        <textarea
          id="diary-compose"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={diary.placeholder}
          rows={3}
        />
        <div className="composer-bar">
          <span className={countClass}>{remaining}</span>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!canPost}
          >
            {sending ? "Posting…" : "Post"}
          </button>
        </div>
        {error && (
          <p className="diary-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function Post({ post, now, canDelete, onDelete }) {
  const created = new Date(post.created_at);
  return (
    <article className="post">
      <Avatar />
      <div className="post-main">
        <header className="post-head">
          <span className="post-name">{diary.author.name}</span>
          <span className="post-handle">@{diary.author.handle}</span>
          <span className="post-dot" aria-hidden="true">
            ·
          </span>
          <time
            className="post-time"
            dateTime={post.created_at}
            title={fullDate.format(created)}
          >
            {timeAgo(post.created_at, now)}
          </time>
          {canDelete && (
            <button
              type="button"
              className="post-delete"
              aria-label="Delete post"
              onClick={() => onDelete(post.id)}
            >
              <TrashIcon />
            </button>
          )}
        </header>
        <p className="post-body">{renderBody(post.body)}</p>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="post-list" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div className="post post--skeleton" key={i}>
          <div className="avatar" />
          <div className="post-main">
            <span className="skeleton-line skeleton-line--short" />
            <span className="skeleton-line" />
            <span className="skeleton-line skeleton-line--mid" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */
export default function Diary() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [token, setToken] = useState(readToken);
  const [unlocking, setUnlocking] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Initial load
  useEffect(() => {
    let cancelled = false;
    fetchPosts()
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setCursor(data.nextCursor);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pull in new posts while the page is open
  const pollForNew = useCallback(async () => {
    try {
      const data = await fetchPosts();
      setPosts((prev) => {
        const newestId = prev[0]?.id ?? 0;
        const fresh = data.posts.filter((p) => p.id > newestId);
        return fresh.length ? [...fresh, ...prev] : prev;
      });
    } catch (err) {
      // A missed poll shouldn't wipe the feed; the next one will retry
      console.warn("Diary poll failed:", err);
    }
  }, []);

  useEffect(() => {
    if (status !== "ready") return;

    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") pollForNew();
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") pollForNew();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, pollForNew]);

  // Keep "5m" / "2h" labels fresh
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), CLOCK_MS);
    return () => window.clearInterval(tick);
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    setActionError(null);
    try {
      const data = await fetchPosts(cursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  function unlock(key) {
    writeToken(key);
    setToken(key);
    setUnlocking(false);
  }

  function lock() {
    writeToken(null);
    setToken(null);
  }

  function handlePosted(post) {
    setNow(Date.now());
    setPosts((prev) => [post, ...prev.filter((p) => p.id !== post.id)]);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    setActionError(null);
    try {
      await deletePost(token, id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) lock();
      setActionError(err.message);
    }
  }

  return (
    <main>
      <PageBanner
        seed={diary.seed}
        eyebrow={diary.eyebrow}
        word={diary.bigWord}
        title={diary.heading}
        intro={diary.intro}
      />

      <section className="section diary">
        <div className="diary-feed">
          <div className="diary-toolbar">
            <p className="eyebrow">
              <span className="rule" />
              Latest
            </p>
            {token ? (
              <button type="button" className="diary-lock" onClick={lock}>
                <LockIcon open />
                Sign out
              </button>
            ) : (
              !unlocking && (
                <button
                  type="button"
                  className="diary-lock"
                  onClick={() => setUnlocking(true)}
                  aria-label="Owner sign in"
                >
                  <LockIcon />
                </button>
              )
            )}
          </div>

          {!token && unlocking && (
            <UnlockForm
              onUnlock={unlock}
              onCancel={() => setUnlocking(false)}
            />
          )}

          {token && (
            <Composer token={token} onPosted={handlePosted} onAuthLost={lock} />
          )}

          {actionError && (
            <p className="diary-error diary-error--block" role="alert">
              {actionError}
            </p>
          )}

          {status === "loading" && <Skeleton />}

          {status === "error" && (
            <div className="diary-empty">
              <p>Couldn't load the diary.</p>
              <p className="diary-error">{loadError}</p>
            </div>
          )}

          {status === "ready" && posts.length === 0 && (
            <div className="diary-empty">
              <p>{diary.emptyMessage}</p>
            </div>
          )}

          {status === "ready" && posts.length > 0 && (
            <div className="post-list">
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  now={now}
                  canDelete={Boolean(token)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {status === "ready" && cursor !== null && (
            <div className="diary-more">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading…" : "Load older posts"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
