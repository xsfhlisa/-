/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Character } from "../types";
import { BookOpen, Wand2, Sparkles, Volume2, Moon, VolumeX, CheckCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StoryGeneratorProps {
  unlockedCharacters: Character[];
  allCharacters: Character[];
}

interface StoryResult {
  title: string;
  story: string;
  theme: string;
  goldenQuote: string;
  isFallback?: boolean;
}

const LOADING_STEPS = [
  "小喵老师正在使羽毛笔飞起来... 🪶",
  "正在把金黄的大太阳挂进童话山谷... ☀️",
  "让彩色的小游鱼在彩虹糖水里划个水... 🐟",
  "故事写好啦，正在给图画上色呢喵... 🎨"
];

export default function StoryGenerator({ unlockedCharacters, allCharacters }: StoryGeneratorProps) {
  // Use unlocked or fall back to high-profile characters if none unlocked yet
  const availableChars = unlockedCharacters.length >= 3 
    ? unlockedCharacters 
    : allCharacters.slice(0, 8);

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [story, setStory] = useState<StoryResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      if (selectedWords.length >= 4) {
        // Kids limit to max 4 words
        return;
      }
      setSelectedWords([...selectedWords, word]);
    }
  };

  const generateAIStory = async () => {
    if (selectedWords.length === 0) return;
    setLoading(true);
    setStory(null);
    setErrorMsg("");
    
    // Animate loader steps periodically
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingStep(step);
    }, 1500);

    try {
      const res = await fetch("/api/gemini/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: selectedWords }),
      });
      
      if (!res.ok) {
        throw new Error("故事书掉落在地上了，换个试一试吧喵～");
      }
      
      const data = await res.json();
      setStory(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "小喵老师写着写着，墨水瓶翻倒了。我们重新试试吧！");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Speaks aloud the story using standard SpeechSynthesis api
  const speakStory = () => {
    if (!story) return;
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      // Strip markdown bold asterisks
      const plainText = story.story.replace(/\*\*/g, "");
      const utterance = new SpeechSynthesisUtterance(thisTextFull(story.title, plainText));
      utterance.lang = "zh-CN";
      utterance.rate = 0.85; // Elegant slow reading speed for kids
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("哎呀，当前浏览器不支持小嘴巴讲故事功能。建议使用电脑或最新浏览器，并在新标签中打开哦！");
    }
  };

  const thisTextFull = (title: string, storyStr: string) => {
    return `小故事，${title}。 ${storyStr}`;
  };

  // Helper code to parsed bold **words** nicely inside children blocks
  const renderFormattedStory = (text: string) => {
    // Regex matching markdown format
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      const isWordMatch = selectedWords.includes(part);
      if (isWordMatch) {
        return (
          <motion.span
            key={index}
            animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4, delay: index * 0.2 }}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-amber-100 text-amber-800 border-b-2 border-amber-500 font-bold font-sans text-lg md:text-xl relative group"
          >
            {part}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-[10px] bg-amber-800 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
              宝宝认读词
            </span>
          </motion.span>
        );
      }
      return <span key={index} className="text-gray-700 leading-relaxed tracking-wide text-base md:text-lg">{part}</span>;
    });
  };

  const getCharEmoji = (charWord: string) => {
    const found = allCharacters.find(c => c.word === charWord);
    return found ? found.emoji : "✨";
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50/50 via-white to-purple-50/50 p-4 md:p-6 min-h-full" id="story-magic-panel">
      {/* Container header banner elements */}
      <div className="max-w-3xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-2">
          <Sparkles size={14} className="animate-spin" />
          AI 猫咪老师定制绘本
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 tracking-tight">
          AI 识字小魔法绘本 ✨
        </h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-md mx-auto leading-relaxed">
          选出你想在童话里出现的 1~4 个识字卡片。点击魔法魔杖，小喵老师将为你创作独一无二的温馨睡前配音故事！
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Word panel selection card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <BookOpen size={16} className="text-indigo-600" />
              我的识字竹筐（选择1-4个字）
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              已选: <strong className="text-indigo-600">{selectedWords.length}</strong> / 4 个字
            </span>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3" id="story-selection-words">
            {availableChars.map((char) => {
              const isSelected = selectedWords.includes(char.word);
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectWord(char.word)}
                  className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm font-semibold scale-105"
                      : "border-slate-100 bg-slate-50/50 text-gray-700 hover:bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <span className="text-lg">{char.emoji}</span>
                  <span className="font-sans text-base">{char.word}</span>
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white rounded-full p-0.5 text-[8px] animate-bounce">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedWords.length > 0 && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={generateAIStory}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-indigo-600/10 rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95 disabled:opacity-50 cursor-pointer transition-all duration-150"
                id="btn-wave-magic"
              >
                <Wand2 size={16} className="animate-pulse" />
                挥动识字小魔杖 ✨
              </button>
            </div>
          )}
        </div>

        {/* Loading screen overlay or animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/90 border border-indigo-100 rounded-2xl p-8 text-center shadow-lg flex flex-col items-center justify-center min-h-[250px]"
              id="magic-story-spinner"
            >
              <div className="relative mb-5">
                <span className="text-5xl animate-bounce block">🧙‍♀️</span>
                <span className="absolute bottom-0 right-0 text-3xl animate-spin block">🪄</span>
              </div>
              <p className="text-indigo-900 font-bold mb-2 text-base">
                {LOADING_STEPS[loadingStep]}
              </p>
              <p className="text-xs text-slate-400">小喵老师正在用一双巧手将你的字串联成故事海报...</p>
              <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                  animate={{ x: [-100, 200] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-center text-xs"
            >
              {errorMsg}
              <button
                onClick={generateAIStory}
                className="ml-2 underline font-bold hover:text-red-900 inline-flex items-center gap-0.5 cursor-pointer"
              >
                <RefreshCw size={12} />
                再试一下
              </button>
            </motion.div>
          )}

          {/* Finished generated children story book panel */}
          {story && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-b from-[#FAF7EE] to-[#FCF9F2] border-2 border-amber-900/10 rounded-2xl shadow-lg shadow-amber-900/5 overflow-hidden p-6 relative flex flex-col gap-6"
              id="story-sheet-container"
            >
              {/* Paper line decorations */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-red-100 border-l border-red-200"></div>

              <div className="pl-6 flex flex-col gap-5">
                {/* Book header details */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-amber-950 font-serif">
                      {story.title}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1 text-amber-900/60 font-medium text-xs">
                      <Moon size={13} className="text-indigo-400" />
                      小手选字：
                      {selectedWords.map((word) => (
                        <span key={word} className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-bold">
                          {getCharEmoji(word)} {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={speakStory}
                    className={`p-3 rounded-full shadow-sm cursor-pointer transition-all border shrink-0 ${
                      isPlaying
                        ? "bg-amber-150 border-amber-300 text-amber-700 animate-pulse"
                        : "bg-white border-amber-900/10 text-amber-800 hover:bg-amber-50"
                    }`}
                    title="聆听配音"
                    id="btn-trigger-speech"
                  >
                    {isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

                {/* Primary Story Narrative of fairytale */}
                <div className="py-2 inline-block">
                  <p className="whitespace-pre-line text-amber-950 font-medium">
                    {renderFormattedStory(story.story)}
                  </p>
                </div>

                {/* Footnotes like bedtime values & moral lessons */}
                <div className="border-t border-amber-900/10 pt-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-100/40 p-3.5 rounded-xl border border-amber-900/5">
                    <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1.5">
                      💡 启迪小道理 (Story Meanings)
                    </h4>
                    <p className="text-xs text-amber-900/80 leading-relaxed font-semibold">
                      {story.theme}
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-900/5">
                    <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1.5">
                      📜 温暖小金句 (Sweet Quote)
                    </h4>
                    <p className="text-xs text-emerald-900/80 italic font-medium leading-relaxed">
                      " {story.goldenQuote} "
                    </p>
                  </div>
                </div>

                {/* Sticker reward panel for kids reading */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-3.5 rounded-xl border border-amber-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl animate-bounce">👍</span>
                    <div>
                      <p className="text-xs font-bold text-amber-950">完成绘本伴学！</p>
                      <p className="text-[10px] text-amber-900/60">小孩子爱上阅读是世界上最美丽的事情喵～</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                    得 10 ⭐️ 星星奖励
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
