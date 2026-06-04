import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. AI Features will use local fallbacks.");
}

// ----------------------------------------------------
// API 1: Character Origin Explanation from Teacher Kitty
// ----------------------------------------------------
app.post("/api/gemini/explain", async (req, res, next) => {
  const { word } = req.body;
  if (!word) {
    return res.status(400).json({ error: "Missing 'word' in request body." });
  }

  // Fallback in case Gemini Client is not available or fails
  const localFallbacks: Record<string, string> = {
    ri: "喵哈喽！我是小喵老师～☀️‘日’字就是天上的大太阳！古人画的太阳是一个圆圆的圈，中间点了一个小金豆。后来圆圈变成了方方的，金豆子变成了一横，就成了今天的‘日’！它是温暖的代名词，代表新的一天开始啦！喵唔～",
    yue: "喵呜～🌙弯弯的‘月’亮挂在树梢，像一只金黄的小香蕉！因为月亮经常是弯弯的多，圆圆的少，所以古人就把弯月画下来，里面的两小横就像是微弱而温柔的月光呢。小朋友，晚上睡觉前跟月亮说晚安吧！",
  };

  if (!ai) {
    return res.json({
      explanation: localFallbacks[word] || `喵哈喽！这个‘${word}’字很神奇哦！它像是一幅画，代表着大千世界里的美妙事物，等着聪明的小朋友和爸爸妈妈一起来揭晓它的秘密哦！喵～`,
      isFallback: true
    });
  }

  try {
    const prompt = `你是一个最温柔、最受小孩子欢迎的幼儿园猫咪老师，名字叫‘小喵老师’。
请用可爱、充满想象力、简单好懂的中文（适合3-6岁儿童，配少量可爱表情符号）向小朋友解释‘${word}’这个汉字的来源、为什么这么写（比如展示它是怎样由象形图画拼出来的），并给出一个非常简单、读起来朗朗上口的押韵顺口溜或儿歌（只要4句，每句5或7个字），让他牢牢记住！
总字数控制在150-180字之间，语气极其活泼，多一些喵老师的标志性叹词（例如“喵～”、“呀”、“哇！”）。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a warm, kind, and enthusiastic preschool teacher cat 'Teacher Kitty' (小喵老师) who uses children's language, exciting sound words, and playful emojis."
      }
    });

    res.json({
      explanation: response.text || "小喵老师刚刚打了个盹，没有想出答案喵～",
      isFallback: false
    });
  } catch (error: any) {
    console.error("Gemini Explain API Error:", error);
    res.json({
      explanation: `哎呀，小喵老师的信号有点不好喵～不过不要紧，大山顶上有棵大松树，树下有块小石头，这就是神奇的‘${word}’字呢！我们先看看看怎么临摹和学词组吧喵！`,
      isFallback: true
    });
  }
});

// ----------------------------------------------------
// API 2: Parent-Child Story Creator
// ----------------------------------------------------
app.post("/api/gemini/story", async (req, res, next) => {
  const { words } = req.body;
  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'words' array in request body." });
  }

  const wordString = words.join("、");

  // Local fallback storytelling
  const localFallbackStory = {
    title: "空中飞鱼的梦 🐟☁️",
    story: "在很久很久以前，一座神秘的大**山**顶上，住着一只想去天上看大**日**出的小**鱼**。它每天在小溪里跃水抬头，最后云彩妈妈送给它一对轻飘飘的白云翅膀！小**鱼**轻轻一扇，哇！真的**飞**了起来，和云海里的大红**日**抱在一起，大**笑**着亲亲！",
    theme: "勇于尝试，梦想就能插上翅膀翱翔天空！",
    goldenQuote: "心里有树、眼睛有光，连水里的小鱼也能飞上海拔最高的山顶呢！"
  };

  if (!ai) {
    return res.json({
      ...localFallbackStory,
      isFallback: true
    });
  }

  try {
    const prompt = `你是一个最温柔贴心的儿童绘本大作家‘小喵老师’。
请使用以下这几个汉字：${wordString}，创作一篇适合3-6岁宝宝听的床边晚安绘本微故事（150-240字之间）。
故事要温暖、奇幻、积极向上（例如大山在唱歌，小鱼飞到太阳上，或者花朵在说悄悄话等）。
【关键规则】：在故事正文（story字段）里，凡是出现了这几个汉字【${wordString}】，必须使用 Markdown 的粗体标注（即在汉字前后加上双星号，例如：**${words[0]}**），方便孩子跟读。
你必须返回 JSON 格式，不要返回任何 Markdown 语法包裹的 json（不要写 \`\`\`json ）。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A beautiful, child-friendly title for the fairytale." },
            story: { type: Type.STRING, description: "The fairy-tale narrative, 150-250 characters, with specified words bolded as **X**." },
            theme: { type: Type.STRING, description: "The moral or emotional theme of the story, in a single sentence." },
            goldenQuote: { type: Type.STRING, description: "A warm golden quote suitable for parents to tell kids." }
          },
          required: ["title", "story", "theme", "goldenQuote"]
        },
        systemInstruction: "You are 'Teacher Kitty' (小喵老师) compiling sweet fairytale books for little kids. Keep stories soothing and magically imaginative."
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({
      ...data,
      isFallback: false
    });
  } catch (error: any) {
    console.error("Gemini Story API Error:", error);
    res.json({
      ...localFallbackStory,
      isFallback: true
    });
  }
});

// Vite Middleware Configuration for Dev / Prod Serving
const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  // We dynamic import createServer to keep dev-deps separate if needed
  import("vite").then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
      
      // Serve index.html as a catch-all in development so client routing works
      app.get("*", (req, res, next) => {
        // Express v4/v5 routing safe catch-all
        res.sendFile(path.join(process.cwd(), "index.html"));
      });

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`[DEV] Live Sandbox running at http://0.0.0.0:${PORT}`);
      });
    });
  });
} else {
  // Serve static files in production
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PROD] Cloud Run Node Server online at port ${PORT}`);
  });
}
