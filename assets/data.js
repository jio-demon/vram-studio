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
