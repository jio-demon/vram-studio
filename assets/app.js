const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(d) {
  return d.replace(/-/g, ".");
}

function workCard(w) {
  return `
    <article class="card" data-id="${w.id}">
      <div class="card-thumb">
        <img src="${esc(w.file)}" alt="${esc(w.title)}" loading="lazy">
        <span class="badge ${w.type === "video" ? "video" : ""}">${w.type === "video" ? "视频" : "图像"}</span>
      </div>
      <div class="card-body">
        <h3>${esc(w.title)}</h3>
        <div class="card-meta">${fmtDate(w.date)} · ${esc(w.model)}</div>
      </div>
    </article>`;
}

function renderWorks(selector, items) {
  const el = $(selector);
  if (!el) return;
  el.innerHTML = items.length ? items.map(workCard).join("") : '<div class="empty">这个分类下还没有作品</div>';
  $$(".card", el).forEach(c => c.addEventListener("click", () => openModal(c.dataset.id)));
}

function openModal(id) {
  const w = WORKS.find(x => x.id === id);
  if (!w) return;
  const box = $("#modal");
  const params = Object.entries(w.params)
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
    .join("");
  $("#modal-body").innerHTML = `
    <div class="modal-media"><img src="${esc(w.file)}" alt="${esc(w.title)}"></div>
    <div class="modal-info">
      <h3>${esc(w.title)}</h3>
      <div class="card-meta">${fmtDate(w.date)} · ${esc(w.model)}</div>
      <dl class="kv">${params}</dl>
      <div class="card-meta" style="margin-bottom:8px">提示词</div>
      <div class="prompt-box">${esc(w.prompt)}</div>
      <div class="card-meta" style="margin:18px 0 6px">手记</div>
      <p style="font-size:14px;color:#cfd5e0;margin:0">${esc(w.note)}</p>
    </div>`;
  box.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modal").classList.remove("open");
  document.body.style.overflow = "";
}

function renderPostList(selector, items) {
  const el = $(selector);
  if (!el) return;
  el.innerHTML = items
    .map(p => `
      <a class="post-item" href="post.html?id=${p.id}">
        <span class="post-date">${fmtDate(p.date)}</span>
        <span>
          <span class="post-title">${esc(p.title)}<span class="tag">${esc(p.category)}</span></span>
          <div class="post-excerpt">${esc(p.excerpt)}</div>
        </span>
      </a>`)
    .join("");
}

function renderPost(selector) {
  const el = $(selector);
  if (!el) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = POSTS.find(x => x.id === id) || POSTS[0];
  document.title = p.title + " · " + SITE.name;
  const body = p.body
    .map(b => {
      if (b.startsWith("## ")) return `<h2>${esc(b.slice(3))}</h2>`;
      if (b.startsWith("```")) {
        const lines = b.split("\n");
        const code = lines.slice(1, lines[lines.length - 1].trim() === "```" ? -1 : undefined).join("\n");
        return `<pre><code>${esc(code)}</code></pre>`;
      }
      if (b.includes("\n- ")) {
        const [head, ...rest] = b.split("\n");
        const items = rest.filter(x => x.startsWith("- ")).map(x => `<li>${esc(x.slice(2))}</li>`).join("");
        return `<p>${esc(head)}</p><ul>${items}</ul>`;
      }
      const lines = b.split("\n");
      if (lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l.trim()))) {
        return `<ol>${lines.map(x => `<li>${esc(x.replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`;
      }
      if (lines.length > 1 && lines.slice(1).every(l => /^\d+\.\s/.test(l.trim()))) {
        const items = lines.slice(1).map(x => `<li>${esc(x.replace(/^\d+\.\s/, ""))}</li>`).join("");
        return `<p>${esc(lines[0])}</p><ol>${items}</ol>`;
      }
      if (lines.length > 1 && lines.slice(1).every(l => l.startsWith("- "))) {
        const items = lines.slice(1).map(x => `<li>${esc(x.slice(2))}</li>`).join("");
        return `<p>${esc(lines[0])}</p><ul>${items}</ul>`;
      }
      return `<p>${esc(b)}</p>`;
    })
    .join("");
  const chars = p.body.join("").replace(/```/g, "").length;
  const mins = Math.max(1, Math.round(chars / 350));
  const idx = POSTS.findIndex(x => x.id === p.id);
  const newer = idx > 0 ? POSTS[idx - 1] : null;
  const older = idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
  const nav = `<nav class="post-nav">${
    newer
      ? `<a href="post.html?id=${newer.id}"><span>上一篇 · 较新</span>${esc(newer.title)}</a>`
      : "<span></span>"
  }${
    older
      ? `<a class="r" href="post.html?id=${older.id}"><span>下一篇 · 较旧</span>${esc(older.title)}</a>`
      : "<span></span>"
  }</nav>`;
  el.innerHTML = `
    <div class="card-meta" style="margin-bottom:12px">${fmtDate(p.date)} · ${esc(p.category)} · 约 ${mins} 分钟</div>
    <h1>${esc(p.title)}</h1>
    ${body}${nav}`;
}

function mountNav(active) {
  const nav = $("#nav-links");
  if (!nav) return;
  const items = [["index.html", "首页"], ["works.html", "作品"], ["blog.html", "笔记"], ["about.html", "关于"]];
  nav.innerHTML = items
    .map(([href, label]) => `<a href="${href}" class="${href === active ? "active" : ""}">${label}</a>`)
    .join("");
}

function mountBrand() {
  const b = $("#brand-name");
  if (b) b.textContent = SITE.name;
  const t = document.title;
  if (t && t.indexOf("·") === -1) document.title = t;
}

document.addEventListener("DOMContentLoaded", () => {
  mountBrand();
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  const modal = $("#modal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal || e.target.classList.contains("modal-close")) closeModal();
    });
  }
});
