/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Character, UserProgress } from "./types";
import { CHARACTERS } from "./data/characters";
import Dashboard from "./components/Dashboard";
import QuizGame from "./components/QuizGame";
import StoryGenerator from "./components/StoryGenerator";
import WritingCanvas from "./components/WritingCanvas";
import StudyChecklist from "./components/StudyChecklist";
import TrophySafe from "./components/TrophySafe";
import { Compass, PenTool, CheckCircle2, Trophy, HelpCircle, ArrowLeft, Trash2, Milestone, Star, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const PROGRESS_STORAGE_KEY = "child_literacy_paradise_progress_v4";

// Exact Default Values to match user screenshots perfectly on first launch
const INITIAL_DEMO_PROGRESS: UserProgress = {
  stars: 45,
  streak: 3,
  lastActiveDate: "2026-06-04",
  unlockedCharIds: ["yi", "er", "shi_num", "ren", "mu", "tu_soil", "shan", "san", "kou"], 
  unlockedDates: {
    "yi": "2026-06-01",
    "er": "2026-06-01",
    "shi_num": "2026-06-01",
    "ren": "2026-06-02",
    "mu": "2026-06-02",
    "tu_soil": "2026-06-02",
    "shan": "2026-06-03",
    "san": "2026-06-03",
    "kou": "2026-06-04"
  },
  toBeLearnedCharIds: ["ri", "shui", "huo", "yue", "shou"],
  collectedStickers: ["star_kitty"],
  savedDrawings: []
};

// Common child vocabulary words table to resolve lookups dynamically
const CUSTOM_DICT: Record<string, Partial<Character>> = {
  "天": {
    id: "tian_sky",
    word: "天",
    pinyin: "tiān",
    meaning: "天空 / 白天",
    category: "nature",
    pictograph: "像一个高高站立的巨人张开双脚，头顶上方的无穷虚空就是无穷无尽的‘天’。",
    emoji: "☁️",
    phrases: [
      { word: "天空", pinyin: "tiān kōng", meaning: "鸟儿展翅飞上白云间的深蓝色大舞台" },
      { word: "天天", pinyin: "tiān tiān", meaning: "意为每一天，如天天识字，天天长高高喵！" }
    ]
  },
  "门": {
    id: "men_gate",
    word: "门",
    pinyin: "mén",
    meaning: "大门 / 门框",
    category: "nature",
    pictograph: "线条勾画出了古代木板大门口的框架：开大门迎白云，闭大门躲北风。",
    emoji: "🚪",
    phrases: [
      { word: "开门", pinyin: "kāi mén", meaning: "用手轻轻一拉，让大门外明媚的阳光照进来" },
      { word: "门口", pinyin: "mén kǒu", meaning: "小猫小狗经常守候并等爸爸下班回来的温暖过道" }
    ]
  },
  "开": {
    id: "kai_open",
    word: "开",
    pinyin: "kāi",
    meaning: "打开 / 开合",
    category: "actions",
    pictograph: "画出双手用力将厚重的木大门门栓向两侧拉开、迎入春风的姿态。",
    emoji: "🔓",
    phrases: [
      { word: "开心", pinyin: "kāi xīn", meaning: "心里开出乐呵呵的鲜红花骨朵，把不高兴全部吹飞" },
      { word: "开花", pinyin: "kāi huā", meaning: "绿草里的小花骨朵暖暖融化，展露出五彩的衣衫" }
    ]
  },
  "关": {
    id: "guan_close",
    word: "关",
    pinyin: "guān",
    meaning: "关闭 / 关爱",
    category: "actions",
    pictograph: "在两扇大门之间加上重重铁栓交叉，表示保护、闭合。也是对宝宝的呵护关怀哦。",
    emoji: "🔒",
    phrases: [
      { word: "关门", pinyin: "guān mén", meaning: "小熊宝宝要把木制大门关紧，风呼呼就吹不进来啦" },
      { word: "关心", pinyin: "guān xīn", meaning: "妈妈搂抱着你，亲吻你红彤彤脸颊的最贴心举动" }
    ]
  },
  "风": {
    id: "feng_wind",
    word: "风",
    pinyin: "fēng",
    meaning: "流动的空气",
    category: "nature",
    pictograph: "看不见却能让满山桃花飞舞、漫天风筝高飞的空气流动大魔法！",
    emoji: "💨",
    phrases: [
      { word: "大风", pinyin: "dà fēng", meaning: "呼呼刮过来时，像金色扫帚一样把红叶全扫起来了" },
      { word: "风车", pinyin: "fēng chē", meaning: "小手举着红粉小叶轮，风一吹就咯咯高兴转不停" }
    ]
  },
  "云": {
    id: "yun_cloud",
    word: "云",
    pinyin: "yún",
    meaning: "白云 / 云海",
    category: "nature",
    pictograph: "空中一团团升腾的水蒸汽，在蔚蓝色大背景上像一只软乎乎的白兔。",
    emoji: "☁️",
    phrases: [
      { word: "白云", pinyin: "bái yún", meaning: "像大棉花糖一样在头顶飘来荡去的小云朵" },
      { word: "云彩", pinyin: "yún cai", meaning: "晚霞把白云烤成了粉色、紫色的漂亮衣饰" }
    ]
  },
  "一": {
    id: "yi",
    word: "一",
    pinyin: "yī",
    meaning: "数字一",
    category: "numbers",
    pictograph: "一字简单，像一根横放的小树枝。",
    emoji: "1️⃣",
    phrases: [
      { word: "一个", pinyin: "yī gè", meaning: "比如一个小苹果，一只小花猫" }
    ]
  },
  "二": {
    id: "er",
    word: "二",
    pinyin: "èr",
    meaning: "数字二",
    category: "numbers",
    pictograph: "两根小树枝横放，成了可爱的数字二。",
    emoji: "2️⃣",
    phrases: [
      { word: "二个", pinyin: "èr gè", meaning: "两两成对的意思哦" }
    ]
  }
};

// Generate highly custom child descriptor cards for any unseen words
const generateCustomCharacterObj = (word: string): Character => {
  const uniqueSuffix = Math.random().toString(36).substring(2, 9);
  return {
    id: `custom_${Date.now()}_${uniqueSuffix}`,
    word: word,
    pinyin: "shén", // Speech synthesis will natively pronounces word, default visual tone
    meaning: "我们新认识的生字精灵",
    category: "nature",
    pictograph: `大自然和古画中的神奇小汉字。让我们一笔一画地写在红田字格贴纸中，把它收入宝宝的识字宝箱吧！`,
    level: 1,
    emoji: "✨",
    phrases: [
      { word: `${word}儿`, pinyin: "", meaning: `一个带有『${word}』字的可爱小词组` },
      { word: `学习${word}`, pinyin: "", meaning: `温故知新，和爸爸妈妈一起描红『${word}』字画喵！` }
    ]
  };
};

export default function App() {
  const [currentView, setCurrentView] = useState<"lobby" | "quiz" | "story_maker">("lobby");
  const [currentTab, setCurrentTab] = useState<"lobby" | "writing" | "checklist" | "trophy">("lobby");

  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [activeSubView, setActiveSubView] = useState<"detail" | "canvas">("detail");
  const [progress, setProgress] = useState<UserProgress>(INITIAL_DEMO_PROGRESS);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("2026-06-04");
  const [alertMessage, setAlertMessage] = useState<{ text: string; date?: string; word?: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [writingInput, setWritingInput] = useState("");
  const [unrecognizedWord, setUnrecognizedWord] = useState<string | null>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    title: string;
    message: string;
    options: { label: string; action: () => void; variant: "rose" | "teal" | "slate" }[];
  } | null>(null);

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (saved) {
      try {
        const loaded: UserProgress = JSON.parse(saved);
        
        // Handle defaults inside loaded progress safely
        setProgress({
          ...INITIAL_DEMO_PROGRESS,
          ...loaded,
          unlockedDates: {
            ...INITIAL_DEMO_PROGRESS.unlockedDates,
            ...(loaded.unlockedDates || {})
          },
          customCharacters: loaded.customCharacters || [],
          deletedCharIds: loaded.deletedCharIds || []
        });
      } catch (e) {
        console.error("Error loading child progress", e);
        setProgress(INITIAL_DEMO_PROGRESS);
      }
    } else {
      // First launch
      setProgress(INITIAL_DEMO_PROGRESS);
    }
  }, []);

  // Save progress changes helper
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
  };

  const playPronunciation = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "zh-CN";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add character to waitlist or redirect to writing canvas instantly
  const handleAddAndLearnWord = (word: string) => {
    const masteredList = progress.unlockedCharIds || [];

    // Check if matching in preloaded list or custom characters
    const foundPreloaded = CHARACTERS.find((c) => c.word === word) || 
                          Object.values(CUSTOM_DICT).find((c) => c.word === word) ||
                          (progress.customCharacters || []).find((c) => c.word === word);
    
    const matchedId = foundPreloaded ? foundPreloaded.id : null;

    // Check if already learned
    const isLearned = masteredList.some((id) => {
      if (id === matchedId) return true;
      const charObj = CHARACTERS.find((c) => c.id === id) || 
                      Object.values(CUSTOM_DICT).find((c) => c.id === id) ||
                      (progress.customCharacters || []).find((c) => c.id === id);
      return charObj?.word === word || id === word;
    });

    if (isLearned) {
      // Find exact learned date
      const unlockedDates = progress.unlockedDates || {};
      let learnedDate = "2026-06-04"; // default mock
      
      if (matchedId && unlockedDates[matchedId]) {
        learnedDate = unlockedDates[matchedId];
      } else {
        for (let key in unlockedDates) {
          if (key === word || key === matchedId) {
            learnedDate = unlockedDates[key];
            break;
          }
        }
      }

      setAlertMessage({
        text: `已经学过啦！`,
        date: learnedDate,
        word: word
      });

      playPronunciation(word);
      return;
    }

    // New item - Join and Learn!
    let charToTrace: Character;
    let nextCustomChars = [...(progress.customCharacters || [])];

    if (foundPreloaded) {
      charToTrace = { ...foundPreloaded } as Character;
    } else {
      charToTrace = generateCustomCharacterObj(word);
      if (!nextCustomChars.some((c) => c.word === word)) {
        nextCustomChars.push(charToTrace);
      }
    }

    // Add to lists of toBeLearned
    const waitList = progress.toBeLearnedCharIds || [];
    let nextWaitList = [...waitList];
    if (!waitList.includes(charToTrace.id)) {
      nextWaitList = [...waitList, charToTrace.id];
    }

    // Recover if was in deletedCharIds
    const deletedList = progress.deletedCharIds || [];
    const nextDeleted = deletedList.filter((id) => id !== charToTrace.id && id !== charToTrace.word);

    const updated = {
      ...progress,
      toBeLearnedCharIds: nextWaitList,
      customCharacters: nextCustomChars,
      deletedCharIds: nextDeleted
    };

    saveProgress(updated);

    // Auto navigate to writing board tab with this target
    setSelectedChar(charToTrace);
    setActiveSubView("canvas");
    setCurrentTab("writing");

    // Approve Voice
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(`已加入清单！快带小宝贝来写写『${word}』字吧喵！`);
      speech.lang = "zh-CN";
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    }
  };

  // Bulk mark chosen waitlist IDs as learned
  const handleLearnCharactersBulk = (unlockedIds: string[]) => {
    const today = selectedCalendarDate || new Date().toISOString().split("T")[0];
    
    const existingUnlocked = progress.unlockedCharIds || [];
    const updatedUnlocked = [...existingUnlocked];
    const updatedDates = { ...(progress.unlockedDates || {}) };

    unlockedIds.forEach((id) => {
      if (!updatedUnlocked.includes(id)) {
        updatedUnlocked.push(id);
      }
      updatedDates[id] = today; // Register perfectly on chosen selected date
    });

    const waitList = progress.toBeLearnedCharIds || [];
    const updatedWait = waitList.filter((id) => !unlockedIds.includes(id));

    const extraStars = unlockedIds.length * 10;
    const updatedStars = progress.stars + extraStars;

    const updated = {
      ...progress,
      unlockedCharIds: updatedUnlocked,
      unlockedDates: updatedDates,
      toBeLearnedCharIds: updatedWait,
      stars: updatedStars
    };

    saveProgress(updated);
  };

  // Permanently delete a character from anywhere in the app (by ID or word)
  const handleDeleteCustomCharacter = (charIdOrWord: string) => {
    // Determine the exact ID and word for this character
    const matched = allCharactersList.find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    CHARACTERS.find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    Object.values(CUSTOM_DICT).find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    (progress.customCharacters || []).find(c => c.id === charIdOrWord || c.word === charIdOrWord);

    const idToDelete = matched ? matched.id : charIdOrWord;
    const wordToDelete = matched ? matched.word : charIdOrWord;

    const custom = progress.customCharacters || [];
    const nextCustom = custom.filter((c) => c.id !== idToDelete && c.word !== wordToDelete);

    const waitList = progress.toBeLearnedCharIds || [];
    const nextWait = waitList.filter((id) => id !== idToDelete && id !== wordToDelete);

    const unlockedList = progress.unlockedCharIds || [];
    const nextUnlocked = unlockedList.filter((id) => id !== idToDelete && id !== wordToDelete);

    // Completely remove from runtime CUSTOM_DICT cache
    if (CUSTOM_DICT[idToDelete]) {
      delete CUSTOM_DICT[idToDelete];
    }
    if (CUSTOM_DICT[wordToDelete]) {
      delete CUSTOM_DICT[wordToDelete];
    }
    // Also clear from dictionary by any potential field keys
    Object.keys(CUSTOM_DICT).forEach((key) => {
      if (CUSTOM_DICT[key] && (CUSTOM_DICT[key].id === idToDelete || CUSTOM_DICT[key].word === wordToDelete)) {
        delete CUSTOM_DICT[key];
      }
    });

    // Save in deleted pool so we can consistently filter it out of calculations
    const deletedList = progress.deletedCharIds || [];
    const nextDeleted = [...deletedList];
    if (idToDelete && !nextDeleted.includes(idToDelete)) {
      nextDeleted.push(idToDelete);
    }

    const updated = {
      ...progress,
      customCharacters: nextCustom,
      toBeLearnedCharIds: nextWait,
      unlockedCharIds: nextUnlocked,
      deletedCharIds: nextDeleted
    };
    saveProgress(updated);

    if (selectedChar && (selectedChar.id === idToDelete || selectedChar.word === wordToDelete)) {
      setSelectedChar(null);
    }
  };

  // Permanently clear ALL custom characters from the entire app
  const handleClearAllCustomCharacters = () => {
    const waitList = progress.toBeLearnedCharIds || [];
    const nextWait = waitList.filter((id) => !id.startsWith("custom_"));

    const unlockedList = progress.unlockedCharIds || [];
    const nextUnlocked = unlockedList.filter((id) => !id.startsWith("custom_"));

    // Remove custom keys from CUSTOM_DICT
    Object.keys(CUSTOM_DICT).forEach((key) => {
      if (key.startsWith("custom_") || (CUSTOM_DICT[key] && CUSTOM_DICT[key].id?.startsWith("custom_"))) {
        delete CUSTOM_DICT[key];
      }
    });

    const updated = {
      ...progress,
      customCharacters: [],
      toBeLearnedCharIds: nextWait,
      unlockedCharIds: nextUnlocked
    };
    saveProgress(updated);

    // If currently selected character was a custom one or unrecognized, reset selectedChar
    if (selectedChar && (selectedChar.id.startsWith("custom_") || !CHARACTERS.some(c => c.word === selectedChar.word))) {
      setSelectedChar(null);
    }
  };

  // Unlearn a mastered/learned character
  const handleUnlearnMasteredCharacter = (charIdOrWord: string) => {
    const matched = allCharactersList.find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    CHARACTERS.find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    Object.values(CUSTOM_DICT).find(c => c.id === charIdOrWord || c.word === charIdOrWord) ||
                    (progress.customCharacters || []).find(c => c.id === charIdOrWord || c.word === charIdOrWord);

    const idToDelete = matched ? matched.id : charIdOrWord;
    const wordToDelete = matched ? matched.word : charIdOrWord;

    const unlockedList = progress.unlockedCharIds || [];
    const nextUnlocked = unlockedList.filter((id) => id !== idToDelete && id !== wordToDelete);

    // Add back to toBeLearned list so it increases the preparation count and is available to choose again
    const waitList = progress.toBeLearnedCharIds || [];
    const nextWaitList = [...waitList];
    if (idToDelete && !nextWaitList.includes(idToDelete)) {
      nextWaitList.push(idToDelete);
    }

    // Clean up unlocked date mapping
    const nextDates = { ...progress.unlockedDates };
    if (idToDelete) delete nextDates[idToDelete];
    if (wordToDelete) delete nextDates[wordToDelete];

    const updated = {
      ...progress,
      unlockedCharIds: nextUnlocked,
      toBeLearnedCharIds: nextWaitList,
      unlockedDates: nextDates
    };
    saveProgress(updated);
  };

  // Clear ALL mastered characters
  const handleClearMasteredLibrary = () => {
    const updated = {
      ...progress,
      unlockedCharIds: [],
      unlockedDates: {}
    };
    saveProgress(updated);
  };

  // Restore all deleted predefined/custom characters that were hidden
  const handleRestoreDeletedCharacters = () => {
    const updated = {
      ...progress,
      deletedCharIds: []
    };
    saveProgress(updated);
  };

  // Mark drawing master calligraphy saved
  const handleSaveDrawing = (dataUrl: string) => {
    if (!selectedChar) return;
    
    // Earn 5 stars
    const today = selectedCalendarDate || "2026-06-04";
    const newDrawing = {
      id: `draw-${Date.now()}`,
      charId: selectedChar.id,
      dataUrl,
      date: today
    };

    const updatedDrawings = [newDrawing, ...progress.savedDrawings];
    const updatedStars = progress.stars + 5;

    const updated = {
      ...progress,
      savedDrawings: updatedDrawings,
      stars: updatedStars
    };

    saveProgress(updated);
  };

  // Quiz completed trigger
  const handleQuizComplete = (starsEarned: number, stickerId?: string) => {
    const stickers = [...progress.collectedStickers];
    if (stickerId && !stickers.includes(stickerId)) {
      stickers.push(stickerId);
    }

    const updated = {
      ...progress,
      stars: progress.stars + starsEarned,
      collectedStickers: stickers
    };

    saveProgress(updated);
  };

  // Compile a comprehensive list of all accessible characters (precompiled + custom dict characters)
  const getAllAccessibleCharacters = (): Character[] => {
    const master = [...CHARACTERS];
    Object.values(CUSTOM_DICT).forEach((char) => {
      if (!master.some((m) => m.id === char.id)) {
        master.push(char as Character);
      }
    });
    // Add custom ones from progress
    if (progress.customCharacters) {
      progress.customCharacters.forEach((char) => {
        if (!master.some((m) => m.id === char.id || m.word === char.word)) {
          master.push(char);
        }
      });
    }
    const deletedIds = progress.deletedCharIds || [];
    return master.filter((c) => !deletedIds.includes(c.id));
  };

  const allCharactersList = getAllAccessibleCharacters();

  // Find fallback character for Writing Tracing tab
  const getTracerTarget = (): Character => {
    if (selectedChar) return selectedChar;
    
    // Fallback 1: Take first item in study checklist
    const waitList = progress.toBeLearnedCharIds || [];
    if (waitList.length > 0) {
      const match = allCharactersList.find((c) => c.id === waitList[0] || c.word === waitList[0]);
      if (match) return match;
    }

    // Fallback 2: First predefined character
    return CHARACTERS[0];
  };

  const currentWritingCharacter = getTracerTarget();

  useEffect(() => {
    if (currentWritingCharacter) {
      setWritingInput(currentWritingCharacter.word);
    }
  }, [selectedChar, progress.toBeLearnedCharIds]);

  const handleParentReset = () => {
    saveProgress(INITIAL_DEMO_PROGRESS);
    setSelectedCalendarDate("2026-06-04");
    setSelectedChar(null);
    setCurrentTab("lobby");
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-100 select-none" id="applet-viewport">
      
      {/* View Router */}
      <div className="flex-1">
        {currentView === "lobby" && (
          <div className="max-w-md mx-auto w-full bg-white min-h-screen shadow-xl flex flex-col justify-between border-x border-slate-100 relative">
            
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Header metrics bar row */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 pb-4 flex items-center justify-between shadow-sm rounded-b-[2rem]">
                <div className="flex items-center gap-1">
                  <Flame size={15} className="text-yellow-300 animate-pulse" />
                  <span className="text-xs font-black">第 <strong className="text-yellow-300 text-sm select-all">{progress.streak}</strong> 天打卡</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner text-yellow-300 font-extrabold text-xs">
                  <span>⭐</span>
                  <span className="text-white select-all font-mono">{progress.stars} Stars</span>
                </div>
              </div>

              {/* Tab Router Switcher content */}
              {currentTab === "lobby" && (
                <Dashboard
                  userProgress={progress}
                  allCharacters={allCharactersList}
                  onAddAndLearnWord={handleAddAndLearnWord}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  selectedCalendarDate={selectedCalendarDate}
                  onSelectCalendarDate={(date) => setSelectedCalendarDate(date)}
                  alertMessage={alertMessage}
                  onCloseAlert={() => setAlertMessage(null)}
                />
              )}

              {currentTab === "writing" && (
                <div className="p-4" id="writing-tab-enclosure">
                  <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-rose-950 flex items-center gap-1">
                      <PenTool size={16} className="text-red-500 animate-pulse" />
                      妙笔生花 (描红写字盒)
                    </h3>
                    
                    {/* Direct text input instead of select dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold">输字:</span>
                      <input
                        type="text"
                        value={writingInput}
                        maxLength={1}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setWritingInput(val);
                          if (!val) {
                            setUnrecognizedWord(null);
                            return;
                          }
                          const match = allCharactersList.find((c) => c.word === val);
                          if (match) {
                            setSelectedChar(match);
                            setUnrecognizedWord(null);
                          } else {
                            setUnrecognizedWord(val);
                          }
                        }}
                        placeholder="打字..."
                        className="bg-white border-2 border-slate-200 focus:border-red-500 rounded-lg px-2 py-0.5 text-xs font-black text-slate-800 w-12 text-center focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {unrecognizedWord && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-200 rounded-3xl p-4 mb-4 text-center animate-fade-in shadow-sm relative">
                      <button
                        onClick={() => {
                          setUnrecognizedWord(null);
                          if (currentWritingCharacter) {
                            setWritingInput(currentWritingCharacter.word);
                          }
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 font-black text-xs cursor-pointer p-1"
                      >
                        ✕
                      </button>
                      <h4 className="text-xs font-black text-orange-950 flex items-center justify-center gap-1.5 mb-1">
                        ✨ 发现新奇生字精灵！
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        汉字宝盒里还没有收录『<strong className="text-orange-600 font-black text-sm">{unrecognizedWord}</strong>』字哦！
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        宝贝现在可以将它收录为：
                      </p>
                      <div className="flex gap-2.5 mt-3 justify-center">
                        <button
                          onClick={() => {
                            const customObj = generateCustomCharacterObj(unrecognizedWord);
                            const updatedUnlocked = [...progress.unlockedCharIds, customObj.id];
                            const today = selectedCalendarDate || new Date().toISOString().split("T")[0];
                            const updatedDates = { ...progress.unlockedDates, [customObj.id]: today };
                            const updatedCustom = [...(progress.customCharacters || []), customObj];
                            
                            // Clear matching from deleted lists
                            const nextDeleted = (progress.deletedCharIds || []).filter(id => id !== customObj.id && id !== unrecognizedWord);

                            const updated = {
                              ...progress,
                              unlockedCharIds: updatedUnlocked,
                              unlockedDates: updatedDates,
                              customCharacters: updatedCustom,
                              deletedCharIds: nextDeleted,
                              stars: progress.stars + 10
                            };
                            saveProgress(updated);
                            setSelectedChar(customObj);
                            setUnrecognizedWord(null);
                            
                            // Speak confirmation
                            if ("speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              const speech = new SpeechSynthesisUtterance(`真棒！已录入熟字库，我们可以开始快乐描红啦！`);
                              speech.lang = "zh-CN";
                              window.speechSynthesis.speak(speech);
                            }
                          }}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          🎓 直接存入熟字库
                        </button>
                        <button
                          onClick={() => {
                            const customObj = generateCustomCharacterObj(unrecognizedWord);
                            const updatedWait = [...(progress.toBeLearnedCharIds || [])];
                            if (!updatedWait.includes(customObj.id)) {
                              updatedWait.push(customObj.id);
                            }
                            const updatedCustom = [...(progress.customCharacters || []), customObj];
                            
                            // Clear matching from deleted lists
                            const nextDeleted = (progress.deletedCharIds || []).filter(id => id !== customObj.id && id !== unrecognizedWord);

                            const updated = {
                              ...progress,
                              toBeLearnedCharIds: updatedWait,
                              customCharacters: updatedCustom,
                              deletedCharIds: nextDeleted
                            };
                            saveProgress(updated);
                            setSelectedChar(customObj);
                            setUnrecognizedWord(null);

                            // Speak confirmation
                            if ("speechSynthesis" in window) {
                              window.speechSynthesis.cancel();
                              const speech = new SpeechSynthesisUtterance(`已加入准备学的今天清单！`);
                              speech.lang = "zh-CN";
                              window.speechSynthesis.speak(speech);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-sm active:scale-95 transition-all"
                        >
                          🎒 加入准备学字盒
                        </button>
                      </div>
                    </div>
                  )}

                  <WritingCanvas
                    character={currentWritingCharacter}
                    onSaveDrawing={handleSaveDrawing}
                    onClose={() => setCurrentTab("lobby")}
                  />
                </div>
              )}

               {currentTab === "checklist" && (
                <div className="p-4">
                  <StudyChecklist
                    userProgress={progress}
                    allCharacters={allCharactersList}
                    onLearnCharacters={handleLearnCharactersBulk}
                    onUpdateToBeLearned={(newIds) => {
                      const updated = {
                        ...progress,
                        toBeLearnedCharIds: newIds
                      };
                      saveProgress(updated);
                    }}
                    onSelectCharacterToWrite={(char) => {
                      setSelectedChar(char);
                      setActiveSubView("canvas");
                      setCurrentTab("writing");
                    }}
                    selectedCalendarDate={selectedCalendarDate}
                    onDeleteCustomCharacter={(charId) => {
                      const charObj = allCharactersList.find(c => c.id === charId || c.word === charId) || 
                                      CHARACTERS.find(c => c.id === charId || c.word === charId);
                      const label = charObj ? `『${charObj.word}』` : "那个";
                      
                      setCustomConfirm({
                        title: "彻底删除字精灵吗？",
                        message: `⚠️ 确定要彻底从全应用中删除且隐藏这个可爱生动的 ${label} 字精灵吗？\n删除后它将不会在挑词乐园、复习库、写字盒中显示了哦。此操作无法撤销。`,
                        options: [
                          {
                            label: "🔥 彻底隐藏删除",
                            variant: "rose",
                            action: () => handleDeleteCustomCharacter(charId)
                          },
                          {
                            label: "❌ 取消",
                            variant: "slate",
                            action: () => {}
                          }
                        ]
                      });
                    }}
                    onClearAllCustomCharacters={() => {
                      setCustomConfirm({
                        title: "一键清空候选字库吗？",
                        message: "⚠️ 注意：这会彻底一键清空挑词乐园候选字库哦喵！确定要一键全部清空吗？",
                        options: [
                          {
                            label: "🗑️ 确定，全部清空！",
                            variant: "rose",
                            action: () => handleClearAllCustomCharacters()
                          },
                          {
                            label: "❌ 取消",
                            variant: "slate",
                            action: () => {}
                          }
                        ]
                      });
                    }}
                    onRestoreDeletedCharacters={() => {
                      setCustomConfirm({
                        title: "恢复所有已删除字吗？",
                        message: "🐾 发现您以前曾隐藏/彻底删除过一些可爱的精灵汉字。\n\n需要一次性把它们全部找回、重新放回复习或者是待学挑词乐园候选库中吗喵？",
                        options: [
                          {
                            label: "🔄 确定，全部全部恢复！",
                            variant: "teal",
                            action: () => handleRestoreDeletedCharacters()
                          },
                          {
                            label: "❌ 取消",
                            variant: "slate",
                            action: () => {}
                          }
                        ]
                      });
                    }}
                  />
                </div>
              )}

              {currentTab === "trophy" && (
                <TrophySafe
                  userProgress={progress}
                  allCharacters={allCharactersList}
                  onCharacterSelect={(char) => {
                    setSelectedChar(char);
                    setActiveSubView("detail");
                  }}
                  onNavigate={(view) => setCurrentView(view)}
                  onUnlockCharacters={(unlockedIds, words) => {
                    const today = selectedCalendarDate || new Date().toISOString().split("T")[0];
                    const existingUnlocked = [...(progress.unlockedCharIds || [])];
                    const updatedDates = { ...(progress.unlockedDates || {}) };
                    const nextCustomChars = [...(progress.customCharacters || [])];
                    
                    unlockedIds.forEach((id) => {
                      if (!existingUnlocked.includes(id)) {
                        existingUnlocked.push(id);
                      }
                      updatedDates[id] = today;
                    });

                    let newlyUnlockedCount = 0;
                    words.forEach((word) => {
                      const cleanedWord = word.trim();
                      if (!cleanedWord) return;
                      const found = allCharactersList.find(c => c.word === cleanedWord);
                      if (!found) {
                        const customObj = generateCustomCharacterObj(cleanedWord);
                        CUSTOM_DICT[customObj.id] = customObj;
                        if (!nextCustomChars.some(c => c.word === cleanedWord)) {
                          nextCustomChars.push(customObj);
                        }
                        if (!existingUnlocked.includes(customObj.id)) {
                          existingUnlocked.push(customObj.id);
                          newlyUnlockedCount++;
                        }
                        updatedDates[customObj.id] = today;
                      } else {
                        if (!existingUnlocked.includes(found.id)) {
                          existingUnlocked.push(found.id);
                          newlyUnlockedCount++;
                        }
                        updatedDates[found.id] = today;
                      }
                    });

                    // Count from list ids too
                    unlockedIds.forEach(id => {
                      if (!(progress.unlockedCharIds || []).includes(id)) {
                        newlyUnlockedCount++;
                      }
                    });

                    const waitList = progress.toBeLearnedCharIds || [];
                    const updatedWait = waitList.filter((id) => {
                      const char = allCharactersList.find(c => c.id === id);
                      const isUnlockedWord = char ? words.includes(char.word) : false;
                      return !unlockedIds.includes(id) && !isUnlockedWord;
                    });

                    const extraStars = newlyUnlockedCount * 10;
                    const updated = {
                      ...progress,
                      unlockedCharIds: existingUnlocked,
                      unlockedDates: updatedDates,
                      toBeLearnedCharIds: updatedWait,
                      stars: progress.stars + extraStars,
                      customCharacters: nextCustomChars
                    };
                    saveProgress(updated);
                  }}
                  onDeleteMasteredCharacter={(charId) => {
                    const charObj = allCharactersList.find(c => c.id === charId || c.word === charId) || 
                                    CHARACTERS.find(c => c.id === charId || c.word === charId);
                    const label = charObj ? `『${charObj.word}』` : "这个";
                    
                    setCustomConfirm({
                      title: "本字整理室",
                      message: `🎈 请问要如何整理或删除 ${label} 字精灵呢？\n\n【移回生字库】将从熟字库移出，使其重新变回未学状态，可以挑选重学。\n【彻底从应用隐藏】将从整个识字宝盒中彻底隐藏它，不再在任何卡片或字库中显示。`,
                      options: [
                        {
                          label: "🎓 移回生字库（变回未学状态）",
                          variant: "teal",
                          action: () => handleUnlearnMasteredCharacter(charId)
                        },
                        {
                          label: "🔥 彻底从应用中隐藏抹去",
                          variant: "rose",
                          action: () => handleDeleteCustomCharacter(charId)
                        },
                        {
                          label: "❌ 先不变动",
                          variant: "slate",
                          action: () => {}
                        }
                      ]
                    });
                  }}
                  onClearMasteredLibrary={() => {
                    setCustomConfirm({
                      title: "清空全部熟字保险库吗？",
                      message: "⚠️ 注意：所有学过的、录入的熟字将全部重新变回未学的普通生字，重新退回挑词名单，宝贝的总体识字打卡进度也会归零哦。确定要全部清空吗？",
                      options: [
                        {
                          label: "💥 确定，全部清空！",
                          variant: "rose",
                          action: () => handleClearMasteredLibrary()
                        },
                        {
                          label: "✨ 还是留着吧",
                          variant: "slate",
                          action: () => {}
                        }
                      ]
                    });
                  }}
                />
              )}
            </div>

            {/* Bottom sticky navigation menu - EXACT MATCH screenshot */}
            <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100/80 px-4 py-2.5 flex justify-between items-center z-40 shadow-xl rounded-t-3xl shrink-0">
              
              <button
                onClick={() => {
                  setCurrentTab("lobby");
                  setSelectedChar(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1 transition ${
                  currentTab === "lobby" ? "text-pink-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-bold"
                }`}
              >
                <Compass size={18} className={currentTab === "lobby" ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                <span className="text-[10px]">快乐识字</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("writing");
                }}
                className={`flex-1 flex flex-col items-center gap-1 transition ${
                  currentTab === "writing" ? "text-red-500 font-extrabold" : "text-slate-400 hover:text-slate-600 font-bold"
                }`}
              >
                <PenTool size={18} className={currentTab === "writing" ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                <span className="text-[10px]">妙笔生花</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("checklist");
                  setSelectedChar(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1 transition ${
                  currentTab === "checklist" ? "text-amber-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-bold"
                }`}
              >
                <CheckCircle2 size={18} className={currentTab === "checklist" ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                <span className="text-[10px]">识字打卡</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab("trophy");
                  setSelectedChar(null);
                }}
                className={`flex-1 flex flex-col items-center gap-1 transition ${
                  currentTab === "trophy" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-bold"
                }`}
              >
                <Trophy size={18} className={currentTab === "trophy" ? "stroke-[2.5px]" : "stroke-[1.8px]"} />
                <span className="text-[10px]">丰收宝箱</span>
              </button>

            </div>
          </div>
        )}

        {/* Full-view overlay router */}
        {currentView === "quiz" && (
          <QuizGame
            characters={allCharactersList}
            userProgress={progress}
            onQuizComplete={handleQuizComplete}
            onClose={() => setCurrentView("lobby")}
          />
        )}

        {currentView === "story_maker" && (
          <div className="h-full bg-slate-50 min-h-screen">
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200/50 shadow-sm">
              <button
                onClick={() => setCurrentView("lobby")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-50 text-xs font-black text-slate-500 cursor-pointer border border-slate-100 transition"
              >
                <ArrowLeft size={14} />
                回到识字园喵
              </button>
              <div className="text-center font-bold text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full shadow-inner select-all">
                已累积会读的字数： <strong className="text-indigo-900">{progress.unlockedCharIds.length}</strong>
              </div>
            </div>
            
            <StoryGenerator
              unlockedCharacters={allCharactersList.filter((c) => progress.unlockedCharIds.includes(c.id))}
              allCharacters={allCharactersList}
            />
          </div>
        )}
      </div>

      {/* Parental recovery footer controller */}
      {currentView === "lobby" && (
        <footer className="max-w-md mx-auto w-full px-4 py-5 pb-10 border-t border-slate-200/40 text-center flex items-center justify-between gap-4 mt-6 bg-white/70 backdrop-blur-sm shrink-0">
          <p className="text-[9px] text-slate-400 font-semibold select-none leading-relaxed">
            适合 3 至 7 岁儿童 · 微信小程序一键直出版 🎒
          </p>
          
          <div className="relative">
            {showResetConfirm ? (
              <div className="absolute right-0 bottom-8 bg-white border border-rose-100 shadow-xl p-3 rounded-2xl w-44 text-left flex flex-col gap-2 z-50">
                <p className="text-[9px] font-bold text-rose-600 leading-normal">
                  您确定要抹除记录，恢复到和小程序图片一模一样的初始9字演示状态吗？
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleParentReset}
                    className="flex-1 py-1.5 bg-rose-500 text-white rounded-lg text-[9px] font-extrabold hover:bg-rose-600 cursor-pointer"
                  >
                    确定
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 bg-slate-100 text-gray-500 rounded-lg text-[9px] font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    不
                  </button>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 py-1 px-2 border border-dashed border-slate-200 rounded-full text-[8px] font-bold text-slate-400 hover:text-rose-500 hover:border-rose-200 transition cursor-pointer"
              id="btn-parent-reset-launcher"
            >
              <Trash2 size={9} />
              进度重置(家长)
            </button>
          </div>
        </footer>
      )}

      {/* Overlay modal detail board */}
      <AnimatePresence>
        {selectedChar && activeSubView === "detail" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto"
            id="character-details-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#FCF9F2] w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-amber-900/5 flex flex-col"
            >
              {/* Overlay header */}
              <div className="px-5 py-3.5 flex items-center justify-between border-b border-amber-900/5 bg-[#FCF9F2] shrink-0">
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  汉字智趣画室
                </span>
                <button
                  onClick={() => setSelectedChar(null)}
                  className="p-1 text-slate-500 hover:text-slate-800 transition cursor-pointer text-sm font-black"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 items-center">
                  <div className="bg-white border-2 border-dashed border-rose-500/10 p-5 rounded-3xl relative flex flex-col items-center justify-center shadow-inner aspect-square">
                    {/* Red Calligraphy grid guideline layout */}
                    <div className="absolute inset-2 border border-rose-100/50 pointer-events-none"></div>
                    <div className="absolute left-1/2 top-2 bottom-2 border-l border-dashed border-red-500/10 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-2 right-2 border-t border-dashed border-red-500/10 pointer-events-none"></div>

                    <div
                      className="text-slate-800 font-extrabold"
                      style={{ fontSize: "5rem", fontFamily: "KaiTi, Georgia, serif" }}
                    >
                      {selectedChar.word}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-red-600 bg-red-50 px-3 py-0.5 rounded-xl border border-red-100/60 shadow-sm">
                        {selectedChar.pinyin}
                      </span>
                      <button
                        onClick={() => playPronunciation(selectedChar.word)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full cursor-pointer shadow active:scale-95 transition"
                        title="朗读发音"
                      >
                        🔊
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">词句大意</h4>
                      <p className="text-xs font-black text-amber-950 mt-0.5 leading-normal">{selectedChar.meaning}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">看字画组词</h4>
                      <div className="flex flex-col gap-1.5">
                        {(selectedChar.phrases || []).map((ph, index) => (
                          <div key={index} className="bg-white/60 p-2 border border-slate-100 rounded-xl">
                            <p className="font-extrabold text-xs text-slate-800">
                              {ph.word} <span className="font-mono text-[9px] text-red-500">({ph.pinyin})</span>
                            </p>
                            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed mt-0.5">{ph.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro origin story teller component */}
                <div className="bg-amber-50/50 rounded-2xl p-3.5 border border-dashed border-amber-200">
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    🐱 喵老师字源象形画解：
                  </span>
                  <p className="text-[10px] text-amber-900 font-semibold leading-relaxed mt-2">
                    {selectedChar.pictograph}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-2">
                  <button
                    onClick={() => {
                      setActiveSubView("canvas");
                      setCurrentTab("writing");
                      // Modal is closed when switching to trace
                      setSelectedChar(selectedChar);
                    }}
                    className="py-2.5 bg-white hover:bg-slate-50 font-black text-xs text-amber-800 border border-amber-200 rounded-xl cursor-pointer"
                  >
                    ✏️ 去写本字
                  </button>
                  <button
                    onClick={() => {
                      // Mark as learned bulk
                      handleLearnCharactersBulk([selectedChar.id]);
                      setSelectedChar(null);
                    }}
                    className="py-2.5 bg-slate-800 hover:bg-slate-900 font-black text-xs text-white rounded-xl shadow cursor-pointer text-center"
                  >
                    ✓ 我学会了
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gorgeous Custom Confirmation Overlay (No iframe blocks, matches look, support multi-choices) */}
      <AnimatePresence>
        {customConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full border border-pink-100 shadow-2xl flex flex-col gap-4 relative animate-fade-in"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-black text-rose-950 flex items-center gap-1.5 leading-snug">
                  🌸 {customConfirm.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                {customConfirm.message}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                {customConfirm.options.map((option, idx) => {
                  const isRose = option.variant === "rose";
                  const isTeal = option.variant === "teal";
                  
                  let btnStyle = "w-full py-2.5 rounded-xl font-bold text-xs transition duration-150 text-center cursor-pointer active:scale-[0.98] ";
                  if (isRose) {
                    btnStyle += "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md border border-rose-400/20";
                  } else if (isTeal) {
                    btnStyle += "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm";
                  } else {
                    btnStyle += "bg-slate-100 hover:bg-slate-200 text-slate-700";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomConfirm(null);
                        option.action();
                      }}
                      className={btnStyle}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
