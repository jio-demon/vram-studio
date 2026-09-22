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
      if (b.includes("\n- ")) {
        const [head, ...rest] = b.split("\n");
        const items = rest.filter(x => x.startsWith("- ")).map(x => `<li>${esc(x.slice(2))}</li>`).join("");
        return `<p>${esc(head)}</p><ul>${items}</ul>`;
      }
      if (/^\d\.\s/.test(b)) {
        const items = b.split("\n").filter(Boolean).map(x => `<li>${esc(x.replace(/^\d\.\s/, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${esc(b)}</p>`;
    })
    .join("");
  el.innerHTML = `
    <div class="card-meta" style="margin-bottom:10px">${fmtDate(p.date)} · ${esc(p.category)}</div>
    <h1>${esc(p.title)}</h1>
    ${body}`;
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
