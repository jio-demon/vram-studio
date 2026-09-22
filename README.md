# 显存制造 · 站点维护说明

纯静态站点，无需构建，改完文件直接生效（浏览器强刷 Ctrl+F5）。

## 目录结构

```
index.html      首页
works.html      作品画廊（可按图像/视频筛选，点开看提示词与参数）
blog.html       文章列表
post.html       文章详情，通过 ?id=p1 指定文章
about.html      关于页
assets/data.js  所有内容都在这里：SITE / WORKS / POSTS
assets/app.js   渲染逻辑
assets/style.css
assets/works/   作品图片
```

## 换掉示例作品图

把你的图按文件名覆盖即可，无需改代码：

```
assets/works/w1.jpg  ~  w6.jpg
```

建议：宽度不超过 1100px，JPEG 质量 82 左右，单张控制在 200KB 以内。服务器带宽只有 4Mbps、月流量 300GB，图太大会拖慢加载。

## 加一件新作品

在 `assets/data.js` 的 `WORKS` 数组里追加一项：

```js
{
  id: "w7",
  title: "作品名",
  type: "image",            // image 或 video
  date: "2026-09-25",
  model: "使用的模型",
  tags: ["标签"],
  file: "assets/works/w7.jpg",
  prompt: "完整提示词",
  params: { 采样器: "DPM++ 2M Karras", 步数: "32", CFG: "6.5", 分辨率: "1344x768" },
  note: "一句话手记"
}
```

`params` 的键可以任意增减，页面会自动渲染。

## 写一篇新文章

在 `POSTS` 数组里追加，`body` 是段落数组：

- 普通字符串 → 段落
- 以 `## ` 开头 → 小标题
- 含换行 + `- ` → 段落 + 无序列表
- 以 `1. ` 开头 → 有序列表

## 更新到服务器

站点文件在服务器的 `/usr/share/caddy`，Caddy 直接托管，改完文件即刻生效。

从 GitHub 同步（本仓库是源文件）：

```bash
cd /usr/share/caddy && git pull
```

也可以用 SFTP 直接传文件到 `/usr/share/caddy`。

## 两个在线地址

| 地址 | 用途 | 特点 |
|---|---|---|
| http://134.175.39.69/ | **主站**（腾讯云 Lighthouse · 广州） | 国内快；备案后绑 makermake.top |
| https://jio-demon.github.io/vram-studio/ | **预览站**（GitHub Pages） | 免费、自动 HTTPS、push 即上线；国内访问不稳定 |

### 关于 GitHub Pages

`master` 分支根目录已配置为 Pages 源，推送后约 1 分钟自动发布。

```bash
# 查看发布状态（building → built）
gh api repos/jio-demon/vram-studio/pages --jq '.status'

# 手动触发重新发布
gh api -X POST repos/jio-demon/vram-studio/pages/builds
```

注意事项：

- `.nojekyll` 必须保留 —— 它让 Pages 跳过 Jekyll 处理，直接原样发布静态文件
- 站内资源全部使用**相对路径**，所以部署在子目录 `/vram-studio/` 下也不会断
- **不要把 Pages 当主站**：其 CDN 在境外，国内访客经常慢或打不开

## 已知限制

- 服务器在广州，绑定自定义域名需要 ICP 备案，未备案前只能走 IP 访问
- 没有 HTTPS，需要域名 + 备案后才能申请证书
- 默认备份目录：`/usr/share/caddy-bak`（原 Caddy 默认页）
- 页面 `<link rel="canonical">` 目前指向 `https://makermake.top/`，
  域名解析 + 备案完成前该地址不可访问，属预期
