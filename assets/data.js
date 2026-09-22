const SITE = {
  name: "显存制造",
  handle: "VRAM Studio",
  tagline: "用 22GB 显存，把想法渲染成画面",
  intro:
    "一台改装过的 RTX 2080 Ti，一间堆满散热器的房间，和无数个等待出图的深夜。这里记录我用 ComfyUI 与 MiniMax H3 做出来的图与视频，以及一路踩过的坑。",
  links: [
    { label: "GitHub", url: "#" },
    { label: "Bilibili", url: "#" },
    { label: "邮箱", url: "mailto:hello@example.com" }
  ]
};

const WORKS = [
  {
    id: "w1",
    title: "雨夜霓虹街角",
    type: "image",
    date: "2026-09-18",
    model: "SDXL 写实混合",
    tags: ["赛博朋克", "夜景"],
    file: "assets/works/w1.jpg",
    prompt:
      "cyberpunk street corner at night, heavy rain, neon reflections on wet asphalt, lone figure with umbrella, volumetric fog, cinematic wide shot, 35mm film grain",
    params: { 采样器: "DPM++ 2M Karras", 步数: "32", CFG: "6.5", 分辨率: "1344×768" },
    note: "雨丝是用后期叠加的，模型直出的雨总是糊成一片。"
  },
  {
    id: "w2",
    title: "玻璃穹顶下的午后",
    type: "image",
    date: "2026-09-15",
    model: "SDXL 建筑向",
    tags: ["建筑", "自然光"],
    file: "assets/works/w2.jpg",
    prompt:
      "glass dome atrium filled with afternoon sunlight, slender steel columns, warm dust particles in the air, soft shadows on marble floor, architectural photography",
    params: { 采样器: "Euler a", 步数: "28", CFG: "5.5", 分辨率: "1024×1024" },
    note: "光线是整张图的命门，换过六次 seed 才选中这一张。"
  },
  {
    id: "w3",
    title: "深海观测站",
    type: "image",
    date: "2026-09-11",
    model: "SD1.5 概念稿",
    tags: ["科幻", "场景"],
    file: "assets/works/w3.jpg",
    prompt:
      "underwater research station at 300 meters depth, bioluminescent flora, murky blue-green light shafts, pressure hull windows glowing, concept art, matte painting",
    params: { 采样器: "DPM++ SDE Karras", 步数: "30", CFG: "7", 分辨率: "1152×768" },
    note: "生物发光部分用了区域提示词分区控制，否则整幅都会泛绿。"
  },
  {
    id: "w4",
    title: "旧书店的第七排",
    type: "image",
    date: "2026-09-06",
    model: "SDXL 写实混合",
    tags: ["室内", "人文"],
    file: "assets/works/w4.jpg",
    prompt:
      "cramped secondhand bookstore, tall wooden shelves, single hanging bulb, warm amber light, dust floating, nostalgic atmosphere, shallow depth of field",
    params: { 采样器: "DPM++ 2M Karras", 步数: "34", CFG: "6", 分辨率: "1216×832" },
    note: "暖色光源靠 LoRA 微调，原模型偏冷到像仓库。"
  },
  {
    id: "w5",
    title: "机械蜂鸟起飞瞬间",
    type: "video",
    date: "2026-09-02",
    model: "MiniMax H3 · I2VA",
    tags: ["视频", "仿生"],
    file: "assets/works/w5.jpg",
    prompt:
      "close up of a brass mechanical hummingbird, wings blur into motion, lifts off from a fingertip, shallow depth of field, slow motion, macro shot",
    params: { 时长: "6s", 分辨率: "1280×720", 帧率: "24fps", 引导强度: "中" },
    note: "H3 对翅膀高频运动容易抖，降一档运动强度才稳住。"
  },
  {
    id: "w6",
    title: "沙丘上的风",
    type: "video",
    date: "2026-08-28",
    model: "MiniMax H3 · T2VA",
    tags: ["视频", "风景"],
    file: "assets/works/w6.jpg",
    prompt:
      "endless desert dunes at golden hour, wind sweeping sand across the ridge, slow aerial tracking shot, warm gradient sky, cinematic",
    params: { 时长: "6s", 分辨率: "1280×720", 帧率: "24fps", 引导强度: "低" },
    note: "纯 T2V 出风景比图生视频更干净，沙粒细节反而更好。"
  }
];

const POSTS = [
  {
    id: "p5",
    title: "一句话让智能体操控本地 ComfyUI：我把 H3 出片做成了对话",
    date: "2026-09-22",
    category: "智能体",
    excerpt:
      "不用打开节点图，不用手动选参考图。我说一句话，智能体自己写提示词、调参数、跑 ComfyUI、把成片收进资产库。这篇记录这套链路怎么搭，以及 22GB 显存在哪一步差点崩掉。",
    body: [
      "我一直觉得本地出片最大的门槛不是模型，是操作。ComfyUI 的节点图一旦复杂起来，每次出片都要重复十几步：传参考图、改提示词、调秒数、等跑完、再去 output 目录翻文件。做一次还行，做到第十次就想砸键盘。",
      "所以这次的目标很直接：让智能体把这些鼠标操作全接过去，我只负责说一句话。",
      "## 链路是怎么连起来的",
      "```\n我（一句话）\n  → 智能体：读技能、写 H3 提示词\n  → MCP：ComfyTV 端点 http://127.0.0.1:8188/comfytv/mcp\n  → ComfyTV 画布：stage 编排 / 资产库\n  → ComfyUI：H3 turbo8 工作流\n  → output 目录：成片回收入库\n```",
      "关键的一层是 MCP。ComfyTV 插件在 ComfyUI 的本地端口上直接开了 MCP 端点，智能体通过它就能读写画布、跑 stage、探测视频元数据、直接看胶片预览图。不用自己写一层中间服务，插件把接口准备好了。",
      "## 第一步：先确认模型走的是 turbo8",
      "内置那个 Local MiniMax H3 R2V 工作流我跑过一次，25 步配非 turbo 权重，十分钟还没出片，直接叫停。换成自己改的 turbo8 模板之后，4 步采样，一个 5 秒片段三到四分钟出来。差距不是一点半点。",
      "核心配置（这几项别动）\n- UNET：minimax_h3_fused_refdelta_r1024_turbo8_mystic07_int8_convrot\n- CLIP：qwen3vl_32b_heretic_minimax_h3_nvfp4，type 设为 minimax\n- VAE：视频 VAE int8\n- 采样：res_multistep + simple，4 步，BasicGuider\n- 分辨率：ResolutionSelector 16:9 0.4MP\n- 注意力：H3SLAAttention 0.9 / 64",
      "有个坑要单独说：R2V 的 turbo8 权重已经融合了加速，不要再叠加加速 LoRA。那些 LoRA 是给 fl2va_pruned 基础模型做首尾帧玩法用的，叠在 turbo8 上只会互相干扰。",
      "## 第二步：让智能体自己写提示词",
      "这一块反而是最省心的。H3 的提示词有明确的六段式结构（主体定义 / 摘要 / 保留度分析 / 逐秒描述 / 整体音效 / 非剧情音乐），把规则写成技能让智能体读，它就能把一句大白话改写成合格的提示词。",
      "中文场景下我验证过好用的写法是这四条\n1. 开头声明：ref_image_0 为<角色>主体参考，写清发型、瞳色、服饰、标志性道具，并强调人物特征保持不变\n2. 按秒分镜：0—2 秒做什么，2—3.5 秒做什么，每一段都要带动作和镜头运动\n3. 收尾固定两段：视觉风格 + 声音设计\n4. 风格词写具体：真人实拍电影质感、35mm 胶片颗粒、真实皮肤纹理，并明确补一句绝非二次元或插画风格",
      "第 4 条看起来多余，实际上很关键。抽象风格词只会被模型理解成加饱和度，具体的材质描述才会真正落到像素上。",
      "## 22GB 显存这堵墙",
      "我的 2080 Ti 是改装过的 22GB，本来以为够用了，结果在提高分辨率这一步翻了车。提高分辨率的方案不是后处理超分，而是 SelfLift：前几步低分辨率去噪，潜空间放大，剩余步高分辨率收尾，总步数不变。",
      "实测下来的红线是\n- 0.5 档（约 1080×608）：安全，日常用这一档\n- 0.6 档（1296×736）：高分辨率阶段直接 CUDA OOM，整个 ComfyUI 进程崩掉\n- 0.8 档（1728×960）：短边超出 H3 训练分布的 768，质量有风险",
      "还有个花了不少时间的教训：SageAttention 在这张卡上完全没用。Turing 是 sm_75，加载不了需要 sm80+ 的 CUDA 内核；Triton 路径又因为默认共享内存需求 67584 字节超过 Turing 的 65536 上限而静默回退到普通注意力。装了等于没装，注意力加速只能靠 H3 自带的稀疏注意力补丁。",
      "顺带说一句：改显存能解决容量问题，解决不了架构问题。2080 Ti 没有 FP8 硬件加速，也不支持 FlashAttention-3，很多新模型只能走 FP16 或量化版。",
      "## 真正跑起来是什么体验",
      "现在的出片流程是这样的：我把角色海报丢给智能体，说一句「做一段他在雨巷里回头看镜头的五秒镜头」。接下来它自己完成——按六段式写好提示词、把参考图传到 input、设好秒数（5 秒对应 124 帧，公式会自动对齐 17 的倍数）、提交工作流、轮询到完成、最后把成片按「成品视频」分类收进资产库。",
      "我要做的只是等三四分钟，然后看成片。不满意就说一句改哪里，它去改提示词重跑。整个过程里我一次都没打开过节点图。",
      "## 踩过的坑，按难受程度排序",
      "1. 新传到 input 的文件，ComfyUI 页面要按 F5 刷新，否则 widget 校验死活过不去\n2. /prompt 返回 node_errors 别硬猜，按错误提示改输入名或节点类型，自动增长的输入名按 UI 里的原名传就行\n3. 生成慢先怀疑权重：确认是 turbo8 + 4 步，而不是 ref2va_pruned + 25 步\n4. 素材和成品一定要入库（人物素材 / 场景素材 / 成品视频），不然下一次想复用根本找不着",
      "## 下一步",
      "现在还只是单镜头。接下来想让智能体自己处理多镜头拼接，以及做镜头之间的一致性检查——目前两段视频拼接时人物的服装细节偶尔会漂。等这套跑顺了，出片就真的只剩下一句话的事了。"
    ]
  },
  {
    id: "p1",
    title: "把 2080 Ti 改成 22GB 显存：一次不太理智的硬件手术",
    date: "2026-09-20",
    category: "硬件",
    excerpt:
      "11GB 跑 H3 长镜头总是爆显存，于是我动了改显存的念头。这篇记录全过程、花了多少钱，以及哪些坑千万别踩。",
    body: [
      "起因很简单：MiniMax H3 跑一段 6 秒的 720p，峰值显存经常顶到 13GB 上下，11GB 的卡只能把分辨率砍到 512 再放大，画面糊得没法看。",
      "改装本身不神秘，本质是换更大容量的显存颗粒并重写 VBIOS 的显存映射。难点在两处：颗粒来源和焊接良率。",
      "## 成本清单",
      "- 显存颗粒：整机的最大头，占七成预算\n- 焊接加工：找有 BGA 返修台的师傅，别图便宜\n- 散热改造：22GB 颗粒发热上去了，原装硅脂压不住\n- 时间成本：来回折腾了三周",
      "## 值不值得",
      "如果你的目标是本地跑中大型视频模型，答案是值得。但要先确认一件事：2080 Ti 是 Turing 架构，没有 FP8 硬件加速，也不支持 FlashAttention-3，很多新模型得走 FP16 或量化版本。改完显存不等于什么都能跑。",
      "## 三个提醒",
      "1. 改完第一时间跑一小时的显存压力测试，别急着装回机箱\n2. BIOS 一定要先备份，砖了还能救回来\n3. 保修肯定是没了，心理预期先摆正"
    ]
  },
  {
    id: "p2",
    title: "H3 提示词怎么写才不像 AI 味",
    date: "2026-09-12",
    category: "提示词",
    excerpt:
      "同样是写一句话，出来的画面天差地别。我总结了四条在 H3 上反复验证有效的写法。",
    body: [
      "大多数人写提示词的习惯是堆形容词：beautiful, stunning, masterpiece, 8k。在 H3 上这套基本无效，甚至会互相打架。",
      "## 第一条：先写镜头，再写内容",
      "把「谁在拍、怎么拍」放在最前面。close up / wide shot / tracking shot 这类词决定了画面的取景逻辑，模型会据此组织构图。先写内容再补镜头，出来的构图往往是散的。",
      "## 第二条：一个画面只留一个动作",
      "H3 对多动作的时序理解有限。写「他站起来又坐下」，大概率得到一段鬼畜。想表达复杂动作，就拆成两段生成再剪。",
      "## 第三条：材质比风格更管用",
      "与其写 cyberpunk style，不如写 wet asphalt reflecting neon、rusted metal with peeling paint。具体的材质描述会直接落到像素上，抽象风格词只会拉高整体饱和度。",
      "## 第四条：负面提示词别贪多",
      "塞满二十个负面词，模型会顾此失彼，常见结果是画面发灰。留三到五个真正要避免的项就够了。"
    ]
  },
  {
    id: "p3",
    title: "ComfyUI 工作流里那些没人告诉你的显存陷阱",
    date: "2026-09-04",
    category: "工作流",
    excerpt:
      "为什么明明显存够，还是爆了？多半不是模型的问题，是工作流里藏着几个吃显存的节点。",
    body: [
      "爆显存时第一反应通常是降分辨率，但真正的元凶往往在别处。",
      "## 陷阱一：VAE 解码在 CPU 和 GPU 之间反复横跳",
      "默认设置下 VAE 解码会占用一大块显存。分辨率一高，这一块就是最容易炸的地方。把 tiled VAE decode 加上，显存占用能砍掉一半以上，代价只是多几秒。",
      "## 陷阱二：预览节点没关",
      "每接一个 PreviewImage，中间结果就多留一份在显存里。调试时方便，正式跑之前记得断开。",
      "## 陷阱三：模型反复加载",
      "循环里每次重新加载 checkpoint，显存碎片会越积越多。用一次加载 + 多次采样的方式，或者干脆在循环外把模型缓存起来。",
      "## 陷阱四：放大节点顺序错了",
      "先放大再修细节，显存吃的是放大后的尺寸；先修细节再放大，省一半。顺序调换一下，同样的卡能多跑两级放大。"
    ]
  },
  {
    id: "p4",
    title: "为什么我把博客搬到了一台 2 核 2G 的小服务器上",
    date: "2026-08-30",
    category: "部署",
    excerpt:
      "静态站根本不需要大机器。4Mbps 带宽 + 300GB 月流量，够用，但也有几条硬约束。",
    body: [
      "一开始我也想上 4 核 8G，后来算了一笔账：一个纯静态的作品集，页面首屏不到 300KB，2 核 2G 的服务端连百分之一的算力都用不到。",
      "## 真正卡人的是带宽不是 CPU",
      "4Mbps 的峰值带宽，理论上跑满一个月大约是 1.2TB，但套餐只给 300GB 流量包。换算下来，长期平均带宽只能用不到 1Mbps。所以：",
      "- 图片一律转 WebP，单张控制在 150KB 以内\n- 视频别放源文件，要么外链，要么只放几秒的预览片段\n- 大图走懒加载，别让首屏一次性拉完",
      "## 为什么选静态而不是 WordPress",
      "WordPress 在 2G 内存上要跑 PHP + MySQL，内存常年吃紧，还得操心安全更新。静态站直接交给 Caddy 发文件，内存占用可以忽略，也没有被打穿的风险。更新内容就是传几个文件，心智负担小得多。",
      "## 唯一麻烦的是备案",
      "国内地域的服务器绑定域名需要 ICP 备案，周期在一到三周。没备案之前，先用 IP 访问把站搭起来，域名后面再补，不影响开发。"
    ]
  }
];
