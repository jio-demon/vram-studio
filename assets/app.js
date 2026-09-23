/* ==========================================================================
   MakerMake · 渲染与交互
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function fmtDate(d) {
  return d.replace(/-/g, ".");
}

/* ---------- 作品卡片 ---------- */

let modalList = [];        // 当前弹层可切换的作品集合
let modalIndex = -1;       // 当前索引

function workCard(w) {
  // 视频类作品按 16:9 呈现，图像按 1:1 —— 匹配素材真实比例，避免裁切
  const ratio = w.type === "video" ? "16 / 9" : "1 / 1";
  const label = w.type === "video" ? "视频" : "图像";
  return `
    <article class="card" data-id="${esc(w.id)}" tabindex="0" role="button"
             aria-haspopup="dialog" aria-label="查看作品详情：${esc(w.title)}">
      <div class="card-thumb" style="--thumb-ratio:${ratio}">
        <img src="${esc(w.file)}" alt="${esc(w.title)}" loading="lazy" decoding="async">
        <span class="badge ${w.type === "video" ? "video" : ""}">${label}</span>
      </div>
      <div class="card-body">
        <h3 aria-hidden="true">${esc(w.title)}</h3>
        <div class="card-foot">
          <span class="card-meta">${fmtDate(w.date)} · ${esc(w.model)}</span>
          <span class="card-more">详情 →</span>
        </div>
      </div>
    </article>`;
}

function renderWorks(selector, items) {
  const el = $(selector);
  if (!el) return;
  modalList = items;
  el.innerHTML = items.length
    ? items.map(workCard).join("")
    : '<div class="empty">这个分类下还没有作品</div>';
  $$(".card", el).forEach(c => {
    c.addEventListener("click", () => openModal(c.dataset.id));
    // 键盘可达：Enter / Space 打开
    c.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(c.dataset.id);
      }
    });
  });
}

/* ---------- 作品详情弹层 ---------- */

function openModal(id) {
  const w = WORKS.find(x => x.id === id);
  if (!w) return;

  modalIndex = modalList.findIndex(x => x.id === id);
  if (modalIndex === -1) {
    modalList = WORKS;
    modalIndex = WORKS.findIndex(x => x.id === id);
  }

  const hasPrev = modalIndex > 0;
  const hasNext = modalIndex < modalList.length - 1;

  const params = Object.entries(w.params || {})
    .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
    .join("");

  const tags = (w.tags || [])
    .map(t => `<span class="tag">${esc(t)}</span>`)
    .join("");

  $("#modal-body").innerHTML = `
    <div class="modal-media"><img src="${esc(w.file)}" alt="${esc(w.title)}"></div>
    <div class="modal-info">
      <h3 id="modal-title">${esc(w.title)}</h3>
      <div class="card-meta" style="margin-top:6px">${fmtDate(w.date)} · ${esc(w.model)}</div>
      ${tags ? `<div class="modal-tags">${tags}</div>` : ""}

      <div class="modal-section-label">生成参数</div>
      <dl class="kv">${params}</dl>

      <div class="modal-section-label">
        <span>提示词</span>
        <button class="btn-copy" id="copy-prompt" type="button"
                data-prompt="${esc(w.prompt)}">复制</button>
      </div>
      <div class="prompt-box">${esc(w.prompt)}</div>

      <div class="modal-section-label">手记</div>
      <p class="modal-note">${esc(w.note)}</p>

      <div class="modal-navbar">
        <button class="modal-navbtn" id="modal-prev" ${hasPrev ? "" : "disabled"} style="${hasPrev ? "" : "opacity:.35;cursor:default"}">← 上一件</button>
        <span class="modal-hint"><kbd>←</kbd><kbd>→</kbd> 切换 <kbd>Esc</kbd> 关闭</span>
        <button class="modal-navbtn" id="modal-next" ${hasNext ? "" : "disabled"} style="${hasNext ? "" : "opacity:.35;cursor:default"}">下一件 →</button>
      </div>
    </div>`;

  const box = $("#modal");
  box.classList.add("open");
  document.body.style.overflow = "hidden";
  $(".modal-close").focus({ preventScroll: true });

  // 复制提示词
  const copyBtn = $("#copy-prompt");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = copyBtn.dataset.prompt;
      const ok = await copyText(text);
      copyBtn.textContent = ok ? "已复制" : "复制失败";
      copyBtn.classList.toggle("done", ok);
      setTimeout(() => {
        copyBtn.textContent = "复制";
        copyBtn.classList.remove("done");
      }, 1800);
    });
  }

  if (hasPrev) $("#modal-prev").addEventListener("click", () => stepModal(-1));
  if (hasNext) $("#modal-next").addEventListener("click", () => stepModal(1));
}

function stepModal(delta) {
  const next = modalIndex + delta;
  if (next < 0 || next >= modalList.length) return;
  openModal(modalList[next].id);
}

function closeModal() {
  const box = $("#modal");
  if (!box) return;
  box.classList.remove("open");
  document.body.style.overflow = "";
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) { /* 降级 */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

/* ---------- 笔记列表 ---------- */

function renderPostList(selector, items) {
  const el = $(selector);
  if (!el) return;
  el.innerHTML = items.length
    ? items.map(p => `
      <a class="post-item" href="post.html?id=${esc(p.id)}">
        <span class="post-date">${fmtDate(p.date)}</span>
        <span class="post-main">
          <span class="post-title">${esc(p.title)}</span><span class="tag">${esc(p.category)}</span>
          <div class="post-excerpt">${esc(p.excerpt)}</div>
        </span>
      </a>`).join("")
    : '<div class="empty">这个分类下还没有文章</div>';
}

/* ---------- 正文渲染 ---------- */

/* Markdown 表格：`| a | b |` 连续两行以上，第二行为分隔行 */
function isTableBlock(b) {
  const lines = b.split("\n").map(l => l.trim()).filter(Boolean);
  return lines.length >= 2 && lines.every(l => l.startsWith("|")) &&
    /^\|[\s:|-]+\|$/.test(lines[1]) && lines[1].includes("-");
}

function renderTable(b) {
  const cells = l => l.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
  const lines = b.split("\n").map(l => l.trim()).filter(Boolean);
  const head = cells(lines[0]);
  const rows = lines.slice(2).map(cells);
  const aligns = cells(lines[1]).map(a =>
    a.endsWith(":") && a.startsWith(":") ? "center" : a.endsWith(":") ? "right" : "left");
  const th = head.map((h, i) => `<th style="text-align:${aligns[i] || "left"}">${inline(h)}</th>`).join("");
  const tb = rows.map(r =>
    `<tr>${r.map((c, i) => `<td style="text-align:${aligns[i] || "left"}">${inline(c)}</td>`).join("")}</tr>`
  ).join("");
  return `<div class="table-scroll"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`;
}

/* 行内标记：**粗体** / `代码` / 允许极少量白名单内联标签（如涨跌着色）
   注意：先放行白名单标签，再对剩余内容做转义，否则标签会被 esc() 打成实体 */
const INLINE_ALLOW = ["span", "kbd", "strong", "em", "code", "br"];

function inline(s) {
  const store = [];
  let t = String(s).replace(
    /<\/?([a-zA-Z0-9]+)(?:\s[^>]*)?>/g,
    (m, tag) => {
      if (!INLINE_ALLOW.includes(tag.toLowerCase())) return m;
      store.push(m);
      return "\u0000" + (store.length - 1) + "\u0000";
    }
  );
  t = esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => store[+i]);
}

function renderBody(blocks) {
  const tocItems = [];
  const html = blocks.map(b => {
    if (b.startsWith("### ")) {
      return `<h3>${inline(b.slice(4))}</h3>`;
    }
    if (b.startsWith("## ")) {
      const t = b.slice(3);
      tocItems.push(t);
      return `<h2 id="h${tocItems.length}">${inline(t)}</h2>`;
    }
    if (b.startsWith("```")) {
      const lines = b.split("\n");
      const end = lines[lines.length - 1].trim() === "```" ? -1 : undefined;
      const code = lines.slice(1, end).join("\n");
      return `<pre><code>${esc(code)}</code><button class="copy-code" type="button" data-code="${esc(code)}">复制</button></pre>`;
    }
    if (b.startsWith("> ")) {
      return `<blockquote>${inline(b.slice(2))}</blockquote>`;
    }
    if (isTableBlock(b)) return renderTable(b);
    const lines = b.split("\n");

    if (lines.length > 1 && lines.every(l => /^-\s/.test(l.trim()))) {
      return `<ul>${lines.map(x => `<li>${inline(x.trim().slice(2))}</li>`).join("")}</ul>`;
    }
    if (lines.length > 1 && lines.every(l => /^\d+\.\s/.test(l.trim()))) {
      return `<ol>${lines.map(x => `<li>${inline(x.trim().replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`;
    }
    // 首行是段落、其后为列表
    const rest = lines.slice(1);
    if (rest.length && rest.every(l => /^-\s/.test(l.trim()))) {
      return `<p>${inline(lines[0])}</p><ul>${rest.map(x => `<li>${inline(x.trim().slice(2))}</li>`).join("")}</ul>`;
    }
    if (rest.length && rest.every(l => /^\d+\.\s/.test(l.trim()))) {
      return `<p>${inline(lines[0])}</p><ol>${rest.map(x => `<li>${inline(x.trim().replace(/^\d+\.\s/, ""))}</li>`).join("")}</ol>`;
    }
    if (b.includes("\n- ")) {
      const [head, ...r] = b.split("\n");
      return `<p>${inline(head)}</p><ul>${r.filter(x => x.trim().startsWith("- ")).map(x => `<li>${inline(x.trim().slice(2))}</li>`).join("")}</ul>`;
    }
    return `<p>${inline(b)}</p>`;
  }).join("");
  return { html, tocItems };
}

function renderPost(selector) {
  const el = $(selector);
  if (!el) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = POSTS.find(x => x.id === id) || POSTS[0];
  document.title = p.title + " · " + SITE.name;

  // 文章页 canonical + 分享卡片随文章变化（?id= 是同一页面，需动态设置）
  const canonical = "https://makermake.top/post.html?id=" + p.id;
  const setMeta = (selector, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr.startsWith("og:") ? "property" : "name", attr);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  };
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonical;
  setMeta('meta[name="description"]', "description", p.excerpt);
  setMeta('meta[property="og:title"]', "og:title", p.title);
  setMeta('meta[property="og:description"]', "og:description", p.excerpt);
  setMeta('meta[property="og:type"]', "og:type", "article");

  const { html: body, tocItems } = renderBody(p.body);
  const chars = p.body.join("").replace(/```/g, "").length;
  const mins = Math.max(1, Math.round(chars / 350));

  const idx = POSTS.findIndex(x => x.id === p.id);
  const newer = idx > 0 ? POSTS[idx - 1] : null;
  const older = idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
  const nav = `<nav class="post-nav">${
    newer
      ? `<a href="post.html?id=${esc(newer.id)}"><span>上一篇 · 较新</span>${esc(newer.title)}</a>`
      : "<span></span>"
  }${
    older
      ? `<a class="r" href="post.html?id=${esc(older.id)}"><span>下一篇 · 较旧</span>${esc(older.title)}</a>`
      : "<span></span>"
  }</nav>`;

  el.innerHTML = `
    <div class="post-meta-bar">
      <span>${fmtDate(p.date)}</span>
      <span class="tag" style="margin-left:0">${esc(p.category)}</span>
      <span>约 ${mins} 分钟读完</span>
    </div>
    <h1>${esc(p.title)}</h1>
    ${body}${nav}`;

  // 代码块一键复制
  $$(".copy-code", el).forEach(btn => {
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.dataset.code);
      btn.textContent = ok ? "已复制" : "失败";
      btn.classList.toggle("done", ok);
      setTimeout(() => {
        btn.textContent = "复制";
        btn.classList.remove("done");
      }, 1800);
    });
  });

  // 目录
  const tocEl = $("#toc");
  if (tocEl) {
    if (tocItems.length) {
      tocEl.innerHTML = `<div class="toc-title">本文目录</div>` +
        tocItems.map((t, i) => `<a href="#h${i + 1}" data-h="h${i + 1}">${esc(t)}</a>`).join("");
      watchToc(tocEl);
    } else {
      tocEl.style.display = "none";
    }
  }
}

/* 目录滚动高亮 */
function watchToc(tocEl) {
  const links = $$("a", tocEl);
  const heads = links
    .map(a => document.getElementById(a.dataset.h))
    .filter(Boolean);
  if (!heads.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(a => a.classList.toggle("active", a.dataset.h === en.target.id));
      }
    });
  }, { rootMargin: "-90px 0px -70% 0px", threshold: 0 });
  heads.forEach(h => io.observe(h));
}

/* ---------- 导航 ---------- */

function mountNav(active) {
  const nav = $("#nav-links");
  if (!nav) return;
  const items = [
    ["index.html", "首页"],
    ["works.html", "作品"],
    ["blog.html", "笔记"],
    ["device.html", "设备"],
    ["about.html", "关于"]
  ];
  nav.innerHTML = items
    .map(([href, label]) =>
      `<a href="${href}" class="${href === active ? "active" : ""}"${href === active ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

  // 移动端汉堡菜单
  const toggle = $("#nav-toggle");
  if (!toggle) return;
  const close = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", e => { if (e.target.tagName === "A") close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) close(); });
}

function mountBrand() {
  const b = $("#brand-name");
  if (b) b.textContent = SITE.name;
}

/* ---------- 全局初始化 ---------- */

document.addEventListener("DOMContentLoaded", () => {
  mountBrand();

  // 弹层：Esc 关闭、方向键切换、点遮罩关闭
  document.addEventListener("keydown", e => {
    const modal = $("#modal");
    if (!modal || !modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") stepModal(-1);
    if (e.key === "ArrowRight") stepModal(1);
  });

  const modal = $("#modal");
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal || e.target.classList.contains("modal-close")) closeModal();
    });
  }

  // 阅读进度 + 回到顶部
  const progress = $("#progress");
  const totop = $("#totop");
  if (progress || totop) {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      if (progress) {
        progress.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + "%";
      }
      if (totop) totop.classList.toggle("show", h.scrollTop > 600);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    if (totop) totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
});
