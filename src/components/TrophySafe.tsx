/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Character, UserProgress } from "../types";
import { STICKERS } from "../data/characters";
import WeChatExporter from "./WeChatExporter";
import { Trophy, Award, Gamepad2, Sparkles, BookOpen, Volume2, UploadCloud, CheckCircle, Plus, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrophySafeProps {
  userProgress: UserProgress;
  allCharacters: Character[];
  onCharacterSelect: (char: Character) => void;
  onNavigate: (view: "lobby" | "quiz" | "story_maker") => void;
  onUnlockCharacters: (charIds: string[], words: string[]) => void; // Parent upload handler callback
  onDeleteMasteredCharacter?: (charId: string, action: "unlearn" | "delete" | "choose") => void;
  onClearMasteredLibrary?: () => void;
}

export default function TrophySafe({
  userProgress,
  allCharacters,
  onCharacterSelect,
  onNavigate,
  onUnlockCharacters,
  onDeleteMasteredCharacter,
  onClearMasteredLibrary
}: TrophySafeProps) {
  const [showExporter, setShowExporter] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [inputTextWords, setInputTextWords] = useState("");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [uploadSuccessToast, setUploadSuccessToast] = useState("");

  // Filter mastered characters
  const masteredCharIds = userProgress.unlockedCharIds || [];
  const masteredDates = userProgress.unlockedDates || {};
  const masteredCharacters = allCharacters.filter((char) => masteredCharIds.includes(char.id));

  // Candidates for unlocking directly (remaining words)
  const candidateCharacters = allCharacters.filter((char) => !masteredCharIds.includes(char.id));

  const playVoice = (charWord: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(charWord);
      utterance.lang = "zh-CN";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle checklist candidate selection
  const handleToggleCandidate = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      setSelectedCandidateIds(selectedCandidateIds.filter(item => item !== id));
    } else {
      setSelectedCandidateIds([...selectedCandidateIds, id]);
    }
  };

  // Handle uploading action
  const handleUploadSubmit = () => {
    // 1. Process free-text words: extract all pure Chinese characters
    const textChars: string[] = [];
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    let match;
    while ((match = chineseRegex.exec(inputTextWords)) !== null) {
      if (!textChars.includes(match[0])) {
        textChars.push(match[0]);
      }
    }

    if (selectedCandidateIds.length === 0 && textChars.length === 0) {
      alert("请输入已学过了的汉字字符，或者在备选列表勾选想上传的字哦喵！");
      return;
    }

    // 2. Launch unlock action!
    onUnlockCharacters(selectedCandidateIds, textChars);

    // Setup speech greeting
    const totalCount = selectedCandidateIds.length + textChars.length;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(`上传成功！家长为宝宝导入了${totalCount}个已掌握熟字，奖励星星已发出！`);
      speech.lang = "zh-CN";
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    }

    // Reset fields and show success alert
    setUploadSuccessToast(`成功上传 ${totalCount} 个汉字至熟字宝箱！获得 +${totalCount * 10} ⭐`);
    setSelectedCandidateIds([]);
    setInputTextWords("");
    setTimeout(() => {
      setUploadSuccessToast("");
      setShowUploadPanel(false);
    }, 3000);
  };

  // Add all remaining candidates (Quick Mastery unlocker)
  const handleSelectAllCandidates = () => {
    const allIds = candidateCharacters.map(char => char.id);
    setSelectedCandidateIds(allIds);
  };

  return (
    <div className="bg-slate-50 min-h-full py-4 px-4 text-slate-800 flex flex-col gap-6" id="trophy-safe-screen">
      
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {uploadSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 inset-x-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-xl z-50 text-center font-black flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} className="text-yellow-300 animate-bounce" />
            <span>{uploadSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Header Box layout */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-[2rem] p-5 md:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-black flex items-center gap-1.5 uppercase tracking-wide">
              <Trophy className="text-yellow-300 animate-bounce" size={22} />
              我的智力识字保险库 (マスター字库)
            </h2>
          </div>
          <p className="text-xs text-purple-100/90 font-medium leading-relaxed mt-2.5">
            宝贝已经自主掌握并且记忆了下列所有珍贵的汉字：金玉其质，未来可期！
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2.5">
            {/* Click to upload learned words */}
            <button
              onClick={() => setShowUploadPanel(!showUploadPanel)}
              className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-purple-950 rounded-xl text-[11px] font-black tracking-wide flex items-center gap-1 cursor-pointer transition shadow-sm"
              id="btn-upload-learned-trigger"
            >
              <UploadCloud size={13} />
              家长：上传已经学会的字
            </button>

            {masteredCharacters.length > 0 && (
              <button
                onClick={() => {
                  onClearMasteredLibrary?.();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-black tracking-wide flex items-center gap-1 cursor-pointer transition shadow-sm border border-rose-500"
                id="btn-clear-mastered-library_cust"
              >
                <Trash2 size={13} />
                清空熟字库
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upload learned words panel (上传已经学过字的功能) */}
      <AnimatePresence>
        {showUploadPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-purple-50/70 border-2 border-purple-100 rounded-3xl p-5 shadow-inner overflow-hidden flex flex-col gap-4"
          >
            <div className="flex justify-between items-center border-b border-purple-100 pb-2">
              <h3 className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                <UploadCloud size={16} className="text-purple-600" />
                家长自主上传熟字登记室
              </h3>
              <button
                onClick={() => setShowUploadPanel(false)}
                className="text-xs font-bold text-purple-500 hover:text-purple-700 underline"
              >
                收起面板
              </button>
            </div>

            <p className="text-[10px] text-purple-900/85 font-semibold leading-normal">
              如果孩子之前已经跟家长在家学会了某些字，可以在这里批量导入他们，免去繁琐打卡！每个导入汉字将直接升入<b>“熟字宝箱”</b>并赠送宝宝<b>+10</b>颗星星奖励！🎉
            </p>

            {/* Input option 1: Text Area typing character block */}
            <div>
              <label className="text-[10px] font-black text-purple-900 block mb-1">
                ✍️ 方式一：直接输入以前学过的汉字 (系统会自动找出里面的中文字)
              </label>
              <textarea
                value={inputTextWords}
                onChange={(e) => setInputTextWords(e.target.value)}
                placeholder="例如输入：日水火人手 (任意拼写系统会自动匹配)"
                rows={2}
                className="w-full bg-white border border-purple-200 focus:border-purple-500 text-slate-800 text-xs font-bold p-2.5 rounded-xl transition"
              />
            </div>

            {/* Input option 2: Multiple Selection of unused candidate characters */}
            {candidateCharacters.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-black text-purple-900">
                    🔍 方式二：在剩余生字库勾选已掌握字符 ({selectedCandidateIds.length}已选)
                  </label>
                  <button
                    onClick={handleSelectAllCandidates}
                    className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded cursor-pointer transition hover:bg-purple-200"
                  >
                    全部选定
                  </button>
                </div>
                
                <div className="bg-white/80 border border-purple-100 rounded-2xl p-3 max-h-32 overflow-y-auto grid grid-cols-4 gap-1.5">
                  {candidateCharacters.map((char) => {
                    const isChecked = selectedCandidateIds.includes(char.id);
                    return (
                      <div
                        key={char.id}
                        onClick={() => handleToggleCandidate(char.id)}
                        className={`p-1.5 border rounded-lg text-center cursor-pointer transition-all ${
                          isChecked
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "bg-purple-50/30 border-purple-100 text-purple-950 hover:bg-purple-50"
                        }`}
                      >
                        <span className="text-[13px] font-black block" style={{ fontFamily: "KaiTi, Georgia" }}>
                          {char.word}
                        </span>
                        <span className="text-[7px] font-bold block opacity-60 font-mono -mt-0.5">
                          {char.pinyin}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer action */}
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={() => {
                  setSelectedCandidateIds([]);
                  setInputTextWords("");
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-250 text-slate-700 text-[10px] font-bold rounded-lg transition"
              >
                清空数据
              </button>
              <button
                onClick={handleUploadSubmit}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-[10px] font-black rounded-lg transition active:scale-[0.98] shadow flex items-center gap-1 cursor-pointer"
                id="btn-confirm-parent-upload"
              >
                ✨ 确认上传到熟字库！
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Sub-Launchers: Quiz and Bedtime Stories */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate("quiz")}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white hover:opacity-95 text-left shadow-md transform active:scale-95 transition cursor-pointer flex flex-col justify-between group h-28"
          id="btn-trophy-quiz"
        >
          <div className="flex justify-between items-start">
            <span className="p-1.5 bg-white/20 rounded-xl text-base">🏹</span>
            <span className="text-[9px] bg-white/25 px-2 py-0.5 rounded-full font-bold">小测试</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm flex items-center gap-0.5">
              识字大闯关 <Gamepad2 size={12} className="transition-transform group-hover:translate-x-1" />
            </h4>
            <p className="text-[9px] text-orange-50/80 leading-normal">测试拼音词组，收获满堂彩贴纸</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate("story_maker")}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white hover:opacity-95 text-left shadow-md transform active:scale-95 transition cursor-pointer flex flex-col justify-between group h-28"
          id="btn-trophy-story"
        >
          <div className="flex justify-between items-start">
            <span className="p-1.5 bg-white/20 rounded-xl text-base">🪄</span>
            <span className="text-[9px] bg-white/25 px-2 py-0.5 rounded-full font-bold">AI读物</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm flex items-center gap-0.5">
              AI绘本有声童话 <BookOpen size={12} className="transition-transform group-hover:translate-x-1" />
            </h4>
            <p className="text-[9px] text-purple-50/80 leading-normal">自主组字，生成儿童配画床头故事</p>
          </div>
        </button>
      </div>

      {/* Master character list grid - EXACT MATCH layout */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 shrink-0">
          <h3 className="text-sm font-black text-rose-950 flex items-center gap-1.5">
            🏆 熟字列表 ({masteredCharacters.length}个字)
          </h3>
          <span className="text-[10px] text-slate-400 font-extrabold">
            点击任意卡片观看复习
          </span>
        </div>

        {masteredCharacters.length > 0 ? (
          <div className="grid grid-cols-3 gap-3" id="master-characters-grid">
            {masteredCharacters.map((char) => {
              const learnedDate = masteredDates[char.id] || masteredDates[char.word] || "2026-06-04";
              return (
                <motion.div
                  key={char.id}
                  onClick={() => onCharacterSelect(char)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FFFDF4] border-2 border-[#F1E5C1]/40 rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm cursor-pointer relative overflow-hidden group"
                >
                  {/* Miniature Red-Gray Trash Can top/left for full management */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMasteredCharacter?.(char.id, "choose");
                    }}
                    className="absolute top-1 left-1.5 w-5.5 h-5.5 bg-slate-100 hover:bg-rose-500 text-slate-400 hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-xs z-20"
                    title="移出/彻底删除"
                  >
                    <Trash2 size={10} />
                  </button>

                  <span className="absolute top-1.5 right-1.5 text-[8px] bg-amber-100 text-amber-800 font-bold px-1 py-0.5 rounded-full scale-75 select-none font-mono">
                    已掌握
                  </span>

                  <div className="text-4xl filter drop-shadow-sm text-slate-800 font-extrabold font-serif py-4 select-none" style={{ fontFamily: "KaiTi, Georgia, serif" }}>
                    {char.word}
                  </div>

                  <div className="text-center w-full">
                    <span className="text-[10px] font-extrabold text-rose-500 font-mono block leading-none">
                      ({char.pinyin})
                    </span>
                    <span className="text-[8px] text-amber-900/60 font-semibold block mt-1.5 tracking-tight">
                      {learnedDate}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <span className="text-4xl block">🌾🚜🔒</span>
            <p className="text-xs font-black text-slate-400 mt-2">宝箱现在空荡荡的，还没学会汉字哦~</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
              快去“识字打卡”清单里选择今天的任务字，练习后勾选打卡，即可解锁丰收大作！
            </p>
          </div>
        )}
      </div>

      {/* Stickers and trophy badges container */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
            <Award size={16} className="text-rose-500" />
            收集成就贴纸馆
          </h3>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
            学字和过关得星星 ⭐ 解锁精美贴纸！当前：{userProgress.stars} ⭐
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-2.5">
          {STICKERS.map((sticker) => {
            // Star thresholds mapping for each sticker
            const starThresholds: Record<string, number> = {
              star_kitty: 10,
              cool_dog: 30,
              super_rabbit: 60,
              smart_owl: 100,
              rainbow_unicorn: 150,
              gold_medal: 200,
              king_lion: 300,
              magic_dolphin: 400
            };
            const reqStars = starThresholds[sticker.id] || 50;
            const isEarned = userProgress.collectedStickers.includes(sticker.id) || userProgress.stars >= reqStars;

            return (
              <div
                key={sticker.id}
                className={`rounded-xl border p-2 text-center flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden group ${
                  isEarned
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200 text-gray-800 shadow-xs scale-100 hover:scale-105 duration-200"
                    : "bg-slate-50/50 border-slate-100 text-slate-300 opacity-60"
                }`}
              >
                <span className="text-2xl transition duration-300 group-hover:rotate-6">{isEarned ? sticker.emoji : "🔒"}</span>
                <p className={`text-[9.5px] font-black leading-none mt-1 ${isEarned ? "text-amber-950" : "text-gray-400"}`}>
                  {sticker.name}
                </p>
                <span className="text-[8px] font-extrabold text-slate-400 font-mono tracking-tighter block scale-90 mt-0.5 whitespace-nowrap">
                  {isEarned ? "🎉 已点亮" : `${reqStars}⭐解锁`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* WeChat Mini Program Exporter expander toggler */}
      <div className="shrink-0">
        {!showExporter ? (
          <button
            onClick={() => setShowExporter(true)}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl text-xs font-extrabold shadow cursor-pointer transition flex items-center justify-center gap-2"
          >
            🔌 家长：生成并导出微信小程序项目代码
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <WeChatExporter />
            <button
              onClick={() => setShowExporter(false)}
              className="text-center text-[10px] text-slate-400 hover:text-slate-600 font-bold underline py-1"
            >
              收起小程序代码生成器
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
