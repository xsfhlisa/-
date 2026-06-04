import { Character, Category } from "../types";

export const CATEGORIES: Category[] = [
  {
    id: "nature",
    name: "奇妙自然",
    color: "from-sky-400 to-blue-500",
    icon: "Sun",
    description: "大自然里的山川草木、风雨雷电"
  },
  {
    id: "animals",
    name: "可爱动物",
    color: "from-amber-400 to-orange-500",
    icon: "Bird",
    description: "和小小森林里的动物做朋友"
  },
  {
    id: "numbers",
    name: "数字方位",
    color: "from-emerald-400 to-teal-500",
    icon: "Hash",
    description: "数一数，量一量，分清上下左右"
  },
  {
    id: "body",
    name: "我的身体",
    color: "from-pink-400 to-rose-500",
    icon: "Hand",
    description: "认识我们神奇的五官和身体部位"
  },
  {
    id: "actions",
    name: "快乐动作",
    color: "from-purple-400 to-indigo-500",
    icon: "Activity",
    description: "跑跑跳跳，飞飞笑笑，真好玩"
  }
];

export const STICKERS = [
  { id: "star_kitty", emoji: "🐱⭐", name: "闪耀喵喵" },
  { id: "cool_dog", emoji: "🐶🕶️", name: "帅气酷狗" },
  { id: "super_rabbit", emoji: "🐰🚀", name: "太空飞兔" },
  { id: "smart_owl", emoji: "🦉🎓", name: "博士猫头鹰" },
  { id: "rainbow_unicorn", emoji: "🦄🌈", name: "彩虹独角兽" },
  { id: "gold_medal", emoji: "🏅🏆", name: "识字小达人" },
  { id: "king_lion", emoji: "🦁👑", name: "森林狮王" },
  { id: "magic_dolphin", emoji: "🐬🪄", name: "魔法海豚" }
];

export const CHARACTERS: Character[] = [
  // NATURE (自然类)
  {
    id: "ri",
    word: "日",
    pinyin: "rì",
    meaning: "太阳",
    category: "nature",
    pictograph: "古人画出的太阳是一个圆圆的圈，中间点了一个点。慢慢演变成了今天的‘日’字，代表温暖的太阳和一天天的时间哦！",
    level: 1,
    emoji: "☀️",
    phrases: [
      { word: "生日", pinyin: "shēng rì", meaning: "每年度过生命诞生的快乐日子" },
      { word: "落日", pinyin: "luò rì", meaning: "傍晚太阳红彤彤落山时的景象" },
      { word: "日子", pinyin: "rì zi", meaning: "一天一天的美妙时光" }
    ]
  },
  {
    id: "yue",
    word: "月",
    pinyin: "yuè",
    meaning: "月亮",
    category: "nature",
    pictograph: "月儿圆了又弯，弯了又圆。古人把经常看见的弯弯月牙儿画了下来，中间两横代表月光，就变成了可爱的‘月’字！",
    level: 1,
    emoji: "🌙",
    phrases: [
      { word: "月亮", pinyin: "yuè liang", meaning: "晚上在天空中发光的小伙伴" },
      { word: "月饼", pinyin: "yuè bǐng", meaning: "中秋节和爸爸妈妈一起吃的圆圆甜点" },
      { word: "月牙", pinyin: "yuè yá", meaning: "像弯曲小香蕉一样的可爱月亮" }
    ]
  },
  {
    id: "shui",
    word: "水",
    pinyin: "shuǐ",
    meaning: "水",
    category: "nature",
    pictograph: "中间一条弯弯的是流淌的溪流，旁边折叠的波纹是水流泛起的花纹，这就是滋养万物的‘水’字呀！",
    level: 1,
    emoji: "💧",
    phrases: [
      { word: "果汁", pinyin: "guǒ zhī", meaning: "甜美的水果水" },
      { word: "雨水", pinyin: "yǔ shuǐ", meaning: "从天空云朵里落下来的小水滴" },
      { word: "河水", pinyin: "hé shuǐ", meaning: "大河里奔流不停的水" }
    ]
  },
  {
    id: "huo",
    word: "火",
    pinyin: "huǒ",
    meaning: "火焰",
    category: "nature",
    pictograph: "两边蹦起的小火星，中间是熊熊燃烧的大木柴，火焰旺盛地往上升，组成了一个温热跳动的‘火’字。",
    level: 1,
    emoji: "🔥",
    phrases: [
      { word: "火车", pinyin: "huǒ chē", meaning: "呜呜叫、吐着黑烟的钢铁巨龙轨道车" },
      { word: "火山", pinyin: "huǒ shān", meaning: "会喷出红红熔岩和石头的大山" },
      { word: "火花", pinyin: "huǒ huā", meaning: "木柴燃烧时飞出来的小亮星" }
    ]
  },
  {
    id: "shan",
    word: "山",
    pinyin: "shān",
    meaning: "大山",
    category: "nature",
    pictograph: "就像三座并排、连绵起伏的大山峰！中间那座山峰最高，两边的小山峰保护着它，真是雄伟的‘山’字！",
    level: 1,
    emoji: "⛰️",
    phrases: [
      { word: "大山", pinyin: "dà shān", meaning: "高高大大的绿色石头巨人" },
      { word: "上山", pinyin: "shàng shān", meaning: "排排坐或者手拉手往高高的山顶爬去" },
      { word: "山羊", pinyin: "shān yáng", meaning: "长着胡须在峭壁上快乐蹦跳的羊咩咩" }
    ]
  },
  {
    id: "mu",
    word: "木",
    pinyin: "mù",
    meaning: "树木 / 木头",
    category: "nature",
    pictograph: "一棵大树立中间，一横代表向两边长出的树枝，一瞥一捺是伸入地下吸水的强壮根基哦！这就是‘木’字。",
    level: 1,
    emoji: "🪵",
    phrases: [
      { word: "木头", pinyin: "mù tou", meaning: "树木砍下来后结实的手工材料" },
      { word: "积木", pinyin: "jī mù", meaning: "能够拼成城堡和飞船的彩色木块" },
      { word: "树木", pinyin: "shù mù", meaning: "森林里撑着绿伞、高过楼房的大树" }
    ]
  },
  {
    id: "shi",
    word: "石",
    pinyin: "shí",
    meaning: "石头",
    category: "nature",
    pictograph: "左上面的撇代表悬崖，下面的‘口’字代表从悬崖或大山上掉落下来的方形小石块。好硬的‘石’子！",
    level: 2,
    emoji: "🪨",
    phrases: [
      { word: "石头", pinyin: "shí tou", meaning: "路边灰灰的、硬邦邦的小石头" },
      { word: "石板", pinyin: "shí bǎn", meaning: "用来铺平小路的平坦大石片" },
      { word: "宝石", pinyin: "bǎo shí", meaning: "地底下亮亮闪闪、五彩缤纷的奇迹之石" }
    ]
  },
  {
    id: "yu",
    word: "雨",
    pinyin: "yǔ",
    meaning: "雨滴",
    category: "nature",
    pictograph: "最上面一横代表厚厚的云空，下面像一扇窗，里面有点点滴滴，正是从云团里掉落到地面的可爱雨滴呢！",
    level: 2,
    emoji: "🌧️",
    phrases: [
      { word: "下雨", pinyin: "xià yǔ", meaning: "天空中聚集了好多云彩姐姐开始流眼泪" },
      { word: "雨伞", pinyin: "yǔ sǎn", meaning: "在雨天绽放的一朵朵移动彩色蘑菇，帮我们挡雨" },
      { word: "彩虹", pinyin: "cǎi hóng", meaning: "雨停了以后，太阳公公送给天空的七彩发夹" }
    ]
  },

  // ANIMALS (动物类)
  {
    id: "yu_ani",
    word: "鱼",
    pinyin: "yú",
    meaning: "小鱼",
    category: "animals",
    pictograph: "就像一条活蹦乱跳的小鱼！上面像三角形的鱼头，中间田字格是美丽的鱼鳞，底下像鱼尾巴，是不是很像它在游泳？",
    level: 1,
    emoji: "🐟",
    phrases: [
      { word: "小鱼", pinyin: "xiǎo yú", meaning: "在水里吐泡泡、游来游去的小精灵" },
      { word: "金鱼", pinyin: "jīn yú", meaning: "长着大蒲扇尾巴、红彤彤在鱼缸游的小鱼" },
      { word: "摸鱼", pinyin: "mō yú", meaning: "在清澈见底的小溪里抓逗游动的小鱼" }
    ]
  },
  {
    id: "niao",
    word: "鸟",
    pinyin: "niǎo",
    meaning: "小鸟",
    category: "animals",
    pictograph: "画了一只站立在树梢的飞鸟。上面的小爪角，中间圆圆的点是鸟儿明亮的眼睛，大弯勾是它圆鼓鼓的肚子和翘起的羽翼！",
    level: 1,
    emoji: "🐦",
    phrases: [
      { word: "小鸟", pinyin: "xiǎo niǎo", meaning: "清晨在窗外叽叽喳喳唱歌的小可爱" },
      { word: "飞鸟", pinyin: "fēi niǎo", meaning: "展翅飞上更高更高蓝天的小天使" },
      { word: "小鸟依人", pinyin: "xiǎo niǎo yī rén", meaning: "形容宝宝温柔可爱、依偎在妈妈怀抱的样子" }
    ]
  },
  {
    id: "ma",
    word: "马",
    pinyin: "mǎ",
    meaning: "奔跑的马儿",
    category: "animals",
    pictograph: "最顶上是马儿神气的鬃毛，大大的折勾代表马儿健壮的身躯，底部四点（旧写）或者长线条代表马儿在飞速奔跑的四条腿和飞扬的尾巴！",
    level: 2,
    emoji: "🐎",
    phrases: [
      { word: "小马", pinyin: "xiǎo mǎ", meaning: "在草原上踢哒踢哒奔跑的小马驹" },
      { word: "马路", pinyin: "mǎ lù", meaning: "宽宽的，以前跑马、现在开汽车的街道" },
      { word: "木马", pinyin: "mù mǎ", meaning: "游乐园里上下摇晃、载着我们欢笑的木头小玩具" }
    ]
  },
  {
    id: "niu",
    word: "牛",
    pinyin: "niú",
    meaning: "强壮的牛",
    category: "animals",
    pictograph: "最顶上一撇一横代表牛儿弯弯的、向天歌的小牛角，中间一根直竖代表牛儿的长脊背，真是勤劳能干的‘牛’！",
    level: 1,
    emoji: "🐂",
    phrases: [
      { word: "牛奶", pinyin: "niú nǎi", meaning: "白花花、香喷喷，喝了能让我们长高高的甜美乳汁" },
      { word: "小黄牛", pinyin: "xiǎo huáng niú", meaning: "在草地上吃青草、发出哞哞叫的壮壮牛" },
      { word: "牛气", pinyin: "niú qì", meaning: "夸赞小朋友很勇敢、表现超级棒！" }
    ]
  },
  {
    id: "yang",
    word: "羊",
    pinyin: "yáng",
    meaning: "可爱的绵羊",
    category: "animals",
    pictograph: "最上方的一撇一捺是小山羊头上螺旋状的大犄角！底下的三横是羊儿软软的毛，一横是可爱的脸庞，竖直是温驯羊儿的吻部。",
    level: 1,
    emoji: "🐑",
    phrases: [
      { word: "山羊", pinyin: "shān yáng", meaning: "长着酷酷小胡须、在山崖跳高的小山羊" },
      { word: "喜洋洋", pinyin: "xǐ yáng yáng", meaning: "形容非常开心，就像小羊咩咩一蹦三尺高一样" },
      { word: "羊毛衫", pinyin: "yáng máo shān", meaning: "冬天里，羊妈妈借给我们的超暖和毛衣" }
    ]
  },
  {
    id: "tu",
    word: "兔",
    pinyin: "tù",
    meaning: "蹦跳小兔",
    category: "animals",
    pictograph: "最像趴跪着的小白兔！上面的短斜是兔子长长的、白白嫩嫩的招风耳，中间是圆肚子和短蹄，右下角那一点是它毛茸茸像小棉球的短尾巴！",
    level: 2,
    emoji: "🐇",
    phrases: [
      { word: "兔子", pinyin: "tù zi", meaning: "红红眼、长耳朵、爱吃大胡萝卜的小家伙" },
      { word: "白兔", pinyin: "bái tù", meaning: "像一个大雪球一样、蹦跳很快的小白" },
      { word: "兔年", pinyin: "tù nián", meaning: "充满活力与快乐、蹦蹦跳跳的年份" }
    ]
  },

  // NUMBERS & DIRECTIONS (数字与方位)
  {
    id: "yi",
    word: "一",
    pinyin: "yī",
    meaning: "数字一",
    category: "numbers",
    pictograph: "就像我们伸出一根食指，或者在沙滩上轻轻画下的一条代表横杠。这是数字的神秘开端哦！",
    level: 1,
    emoji: "1️⃣",
    phrases: [
      { word: "一二三", pinyin: "yī èr sān", meaning: "小不点数数的基本功" },
      { word: "一只", pinyin: "yī zhī", meaning: "孤零零、但也自由快乐的一只小松鼠" },
      { word: "一齐", pinyin: "yī qí", meaning: "大家手拉手，起声高呼：出发啦！" }
    ]
  },
  {
    id: "er",
    word: "二",
    pinyin: "èr",
    meaning: "数字二",
    category: "numbers",
    pictograph: "两条并排画下的横杠，上面短代表天，上面长代表地，也是表示数量两个的意思，简简单单！",
    level: 1,
    emoji: "2️⃣",
    phrases: [
      { word: "两个", pinyin: "liǎng gè", meaning: "成双成对的两只小鞋子" },
      { word: "二氧化碳", pinyin: "èr yǎng huà tàn", meaning: "呼吸时吐出的、植物很喜欢的悄悄气" },
      { word: "老二", pinyin: "lǎo èr", meaning: "排行在第二位的小弟弟或小妹妹" }
    ]
  },
  {
    id: "san",
    word: "三",
    pinyin: "sān",
    meaning: "数字三",
    category: "numbers",
    pictograph: "三条平行的杠，古人觉得‘三’是个奇妙的数字，一二三数下来，天地人三才都在这个漂亮的‘三’字里面啦！",
    level: 1,
    emoji: "3️⃣",
    phrases: [
      { word: "三轮车", pinyin: "sān lún chē", meaning: "长着三只大轮子、用力蹬不会倒的小车车" },
      { word: "三明治", pinyin: "sān míng zhì", meaning: "两片面包中间夹火腿鸡蛋和蔬菜的美味三角包" },
      { word: "三好学生", pinyin: "sān hǎo xué shēng", meaning: "身体棒、学习棒、品德好、人人夸的优秀宝贝" }
    ]
  },
  {
    id: "shang",
    word: "上",
    pinyin: "shàng",
    meaning: "向上 / 上面",
    category: "numbers",
    pictograph: "一根长长的横梁代表地面，直脊指向天，代表往高处、指向上面。‘上’就是高高的云端方向！",
    level: 1,
    emoji: "⬆️",
    phrases: [
      { word: "上午", pinyin: "shàng wǔ", meaning: "太阳公公红着脸冉冉升起、精神百倍的工作时间" },
      { word: "树上", pinyin: "shù shàng", meaning: "小鸟筑巢、苹果红红挂在最高干枝的地方" },
      { word: "楼上", pinyin: "lóu shàng", meaning: "住在我们头顶上、能听见快乐琴声的人家" }
    ]
  },
  {
    id: "xia",
    word: "下",
    pinyin: "xià",
    meaning: "向下 / 下面",
    category: "numbers",
    pictograph: "一横梁代表地面，垂直的枝角指着泥土和下方，代表往深处、往下边探险去！",
    level: 1,
    emoji: "⬇️",
    phrases: [
      { word: "下雨", pinyin: "xià yǔ", meaning: "乌云姐姐把雨水哗啦啦撒落到大地上" },
      { word: "楼下", pinyin: "lóu xià", meaning: "一出门就能看见草地和小花狗的地方" },
      { word: "下午", pinyin: "xià wǔ", meaning: "太阳公公犯困、在落山前的滑梯时光" }
    ]
  },

  // BODY (身体部位)
  {
    id: "kou",
    word: "口",
    pinyin: "kǒu",
    meaning: "嘴巴",
    category: "body",
    pictograph: "就像一张开得大大的、四四方方的嘴巴！用来享受香甜的水果、喝水、唱歌和亲亲妈妈哟！",
    level: 1,
    emoji: "👄",
    phrases: [
      { word: "吃口", pinyin: "chī kǒu", meaning: "吃下一块香喷喷苹果，咬下一大口" },
      { word: "借口", pinyin: "jiè kǒu", meaning: "嘴巴编的一点点温柔淘气理由" },
      { word: "入口", pinyin: "rù kǒu", meaning: "通往新奇好玩游乐场的神秘大铁门" }
    ]
  },
  {
    id: "shou",
    word: "手",
    pinyin: "shǒu",
    meaning: "小手",
    category: "body",
    pictograph: "就像伸出五根手指头的手掌，中间是一段长长的直指。这是一双洗得白白、很讲卫生、能搭积木的‘手’哦！",
    level: 1,
    emoji: "✋",
    phrases: [
      { word: "小手", pinyin: "xiǎo shǒu", meaning: "软捏着像五个胖棉签、可以画画的可爱手掌" },
      { word: "手帕", pinyin: "shǒu pà", meaning: "藏在口袋里的彩色魔法小纸巾，帮我们擦掉鼻涕" },
      { word: "看手相", pinyin: "kàn shǒu xiàng", meaning: "展开手，看看手掌上有多少条奇妙迷宫生命线" }
    ]
  },
  {
    id: "er_body",
    word: "耳",
    pinyin: "ěr",
    meaning: "耳朵",
    category: "body",
    pictograph: "就像人的耳朵的轮廓！外面的框框是我们的薄耳郭，里面的两条短横是里面的听小骨，帮我们听见小猫咪的喵喵声！",
    level: 2,
    emoji: "👂",
    phrases: [
      { word: "耳朵", pinyin: "ěr duo", meaning: "长在小脑袋两旁，一左一右，爱听睡前故事的小喇叭" },
      { word: "耳机", pinyin: "ěr jī", meaning: "送出亮丽乐曲声的‘音乐防蚊罩’" },
      { word: "耳聪目明", pinyin: "ěr cōng mù míng", meaning: "形容宝宝特别聪明，声音听得清，花草看得明" }
    ]
  },
  {
    id: "mu_body",
    word: "目",
    pinyin: "mu",
    meaning: "眼睛",
    category: "body",
    pictograph: "古人的‘目’是横过来画的一个漂亮眼球轮廓，中间代表眼珠子。后来慢慢竖了起来，就成了表示眼睛的‘目’字。",
    level: 1,
    emoji: "👁️",
    phrases: [
      { word: "目光", pinyin: "mù guāng", meaning: "眼睛里流出的温柔彩色视线" },
      { word: "目的", pinyin: "mù dì", meaning: "我们决定奔跑扑打过去的靶心终点" },
      { word: "醒目", pinyin: "xǐng mù", meaning: "特别大、特别新奇、一眼就能吸引视线的大宝贝" }
    ]
  },
  {
    id: "xin",
    word: "心",
    pinyin: "xīn",
    meaning: "心脏 / 爱心",
    category: "body",
    pictograph: "画出了跳动的心脏外形：底端是饱满的心室兜，中间的几点是连接的血管和跳出动力的小红心，暖洋洋的！",
    level: 2,
    emoji: "❤️",
    phrases: [
      { word: "爱心", pinyin: "ài xīn", meaning: "给受伤的小斑鸠包裹伤口时的超级温暖力量" },
      { word: "心爱", pinyin: "xīn ài", meaning: "睡觉时必须抱着、脏了也最喜欢的小熊玩具" },
      { word: "开心", pinyin: "kāi xīn", meaning: "心里开出了一大朵快乐的大黄太阳花" }
    ]
  },

  // ACTIONS (动作类)
  {
    id: "da",
    word: "大",
    pinyin: "dà",
    meaning: "大",
    category: "actions",
    pictograph: "像一个张开双臂、双腿迈开、神气得不得了的小人。张得开开的，这就是巨大的‘大’！",
    level: 1,
    emoji: "🤸",
    phrases: [
      { word: "大人", pinyin: "dà rén", meaning: "身体高高、能抱起我们、去超市帮我们拿饼干的爸爸妈妈" },
      { word: "大西瓜", pinyin: "dà xī guā", meaning: "夏天绿油油的皮，一刀切开红彤彤、好大好甜的瓜" },
      { word: "大风", pinyin: "dà fēng", meaning: "把落叶吹得在空中跳芭蕾圆舞曲的大风哥哥" }
    ]
  },
  {
    id: "xiao",
    word: "小",
    pinyin: "xiǎo",
    meaning: "小",
    category: "actions",
    pictograph: "中间一条短短的直线，两边各切成一个小点，就像一粒小沙子被切得碎碎的，代表非常迷你可爱的‘小’哟！",
    level: 1,
    emoji: "🤏",
    phrases: [
      { word: "小白兔", pinyin: "xiǎo bái tù", meaning: "耳朵长长、尾巴短短的蹦床好手" },
      { word: "小心", pinyin: "xiǎo xīn", meaning: "过马路或倒温水时，像猫咪一样轻轻放慢速度" },
      { word: "小鸟", pinyin: "xiǎo niǎo", meaning: "毛茸茸只有小拳头那么大、会唱歌的小天使" }
    ]
  },
  {
    id: "fei",
    word: "飞",
    pinyin: "fēi",
    meaning: "飞翔",
    category: "actions",
    pictograph: "就像一只振翅高飞的小鸟！长长的羽翼张开，带着身体一飞冲天，飞到了厚厚的白云上面了呢！",
    level: 2,
    emoji: "🦅",
    phrases: [
      { word: "飞机", pinyin: "fēi jī", meaning: "长着大翅膀、在天空发出隆隆声的钢铁大客车" },
      { word: "起飞", pinyin: "qǐ fēi", meaning: "展开手臂，向春天的桃花地里迎风高飞" },
      { word: "飞虫", pinyin: "fēi chóng", meaning: "在花丛中嗡嗡扇着亮翅、辛勤传粉的红蜻蜓" }
    ]
  },
  {
    id: "ku",
    word: "哭",
    pinyin: "kū",
    meaning: "哭泣",
    category: "actions",
    pictograph: "上面的两个‘口’好像两颗圆滚滚的流泪红眼睛，下面的‘犬’字（旧是人被狗咬等）像一个小人张着大嘴在委屈大哭，啪嗒嗒掉下了伤心的眼泪。",
    level: 2,
    emoji: "😢",
    phrases: [
      { word: "哭脸", pinyin: "kū liǎn", meaning: "眼睛红红、嘴角像小拱桥一样弯弯、挂满小盐珠的难过表情" },
      { word: "大哭", pinyin: "dà kū", meaning: "呜哇呜哇地哭得惊天动地，宣泄掉不快乐的红毒素" },
      { word: "爱哭鬼", pinyin: "ài kū guǐ", meaning: "一碰就掉眼泪的小淘气，但一抱抱又立刻变大晴天" }
    ]
  },
  {
    id: "xiao_act",
    word: "笑",
    pinyin: "xiào",
    meaning: "大笑 / 微笑",
    category: "actions",
    pictograph: "最顶上是翠绿修长的‘竹’字头，风一吹竹子就像弯弯眼眉一样轻轻摇晃，多开心呀！底下是一个手舞足蹈、高兴得笑弯了腰的人。",
    level: 1,
    emoji: "😊",
    phrases: [
      { word: "哈哈大笑", pinyin: "hā hā dà xiào", meaning: "开心极了，嘴巴张得老大，肚子一鼓一鼓，发出哈哈的声音" },
      { word: "微笑", pinyin: "wēi xiào", meaning: "嘴唇轻轻抿成一弯彩虹，眼睛亮亮，最温柔的贴心神态" },
      { word: "逗笑", pinyin: "dòu xiào", meaning: "爸爸刮一刮小鼻子，把我们弄得咯咯直颤的发笑游戏" }
    ]
  },
  {
    id: "ren",
    word: "人",
    pinyin: "rén",
    meaning: "人类 / 人氏",
    category: "body",
    pictograph: "人：人类，两撇顶天立地，像人的双腿，也是支撑天地的人形。",
    level: 1,
    emoji: "🧑",
    phrases: [
      { word: "大人", pinyin: "dà rén", meaning: "身体高大、能照顾我们的人" },
      { word: "好人", pinyin: "hǎo rén", meaning: "热心帮助别人、善良的好朋友" },
      { word: "人家", pinyin: "rén jia", meaning: "指代其他人，或者宝宝向妈妈温柔亲近的表达" }
    ]
  },
  {
    id: "tu_soil",
    word: "土",
    pinyin: "tǔ",
    meaning: "泥土 / 土地",
    category: "nature",
    pictograph: "上面的一小横和一竖，代表着刚从泥土里探出小脑袋的小发芽；底下长长的横，表示承载万物的大地。土就是宝贝生长的泥土呀！",
    level: 1,
    emoji: "🌱",
    phrases: [
      { word: "土地", pinyin: "tǔ dì", meaning: "长出大红苹果和金黄麦子的大地" },
      { word: "泥土", pinyin: "ní tǔ", meaning: "下雨天散发青草香气、黏乎乎的软泥巴" },
      { word: "土星", pinyin: "tǔ xīng", meaning: "太空里戴着一个美丽发光斑斓游泳圈的土黄色大球" }
    ]
  },
  {
    id: "shi_num",
    word: "十",
    pinyin: "shí",
    meaning: "数字十",
    category: "numbers",
    pictograph: "一小横代表东西平衡，一长脊直通南北，交叉在中心说明四面八方全都汇合好了！在数数城堡中十代表十全十美的意思哦！",
    level: 1,
    emoji: "🔟",
    phrases: [
      { word: "十个", pinyin: "shí gè", meaning: "双手十根胖嘟嘟小手指全部伸过来的分量" },
      { word: "十分", pinyin: "shí fēn", meaning: "表达超级好，比如十分神气、十分幸福！" },
      { word: "十全十美", pinyin: "shí quán shí měi", meaning: "形容一件事情做得挑不出一点儿不好，棒极了！" }
    ]
  }
];
