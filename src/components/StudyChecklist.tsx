/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Character, UserProgress } from "../types";
import { CheckCircle2, ChevronRight, HelpCircle, Star, Sparkles, BookOpen, Search, X, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudyChecklistProps {
  userProgress: UserProgress;
  allCharacters: Character[];
  onLearnCharacters: (charIds: string[]) => void;
  onUpdateToBeLearned: (charIds: string[]) => void;
  onSelectCharacterToWrite: (char: Character) => void;
  selectedCalendarDate: string;
  onDeleteCustomCharacter?: (charId: string) => void;
  onClearAllCustomCharacters?: () => void;
  onRestoreDeletedCharacters?: () => void;
}

export default function StudyChecklist({
  userProgress,
  allCharacters,
  onLearnCharacters,
  onUpdateToBeLearned,
  onSelectCharacterToWrite,
  selectedCalendarDate,
  onDeleteCustomCharacter,
  onClearAllCustomCharacters,
  onRestoreDeletedCharacters
}: StudyChecklistProps) {
  // Be-Learned state (retrieve IDs that are in the plan list)
  const toBeLearnedIds = userProgress.toBeLearnedCharIds || [];
  
  // Local checklists selected map
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [masteredWords, setMasteredWords] = useState<string[]>([]);

  // Self-selector picker dialog visibility state
  const [showSelector, setShowSelector] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filtering remaining available characters for picking (exclude mastered ones and predefined/preset library ones)
  const masteredCharIds = userProgress.unlockedCharIds || [];
  const candidateCharacters = allCharacters.filter(
    (char) => !masteredCharIds.includes(char.id) && char.id.startsWith("custom_")
  );

  // Filtered list based on search bar
  const filteredCandidates = candidateCharacters.filter((char) => {
    const isKeywordMatch =
      char.word.includes(searchQuery) ||
      char.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.meaning.includes(searchQuery);
    return isKeywordMatch;
  });

  // Reset checkboxes when toBeLearned items change
  useEffect(() => {
    const nextMap: Record<string, boolean> = {};
    toBeLearnedIds.forEach(id => {
      nextMap[id] = true; // Default ticked, matching the "Select all today" state
    });
    setCheckedMap(nextMap);
  }, [userProgress.toBeLearnedCharIds]);

  // Handle single checklist change
  const toggleChecked = (id: string) => {
    setCheckedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Select all inside current display check list
  const selectAll = () => {
    const allTicked = toBeLearnedIds.every(id => checkedMap[id]);
    const nextMap: Record<string, boolean> = {};
    toBeLearnedIds.forEach(id => {
      nextMap[id] = !allTicked;
    });
    setCheckedMap(nextMap);
  };

  // Submit learned items
  const handlePunchCardSubmit = () => {
    const selectedIds = toBeLearnedIds.filter(id => checkedMap[id]);
    if (selectedIds.length === 0) {
      alert("请至少勾选一个今天准备要学的汉字盒哦喵！");
      return;
    }

    const words = selectedIds.map(id => allCharacters.find(c => c.id === id || c.word === id)?.word || id);
    setMasteredWords(words);
    
    // Play synthesis approval
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(`真棒！宝贝今天学会了：${words.join("，")}`);
      speech.lang = "zh-CN";
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    }

    // Direct submit action
    onLearnCharacters(selectedIds);
    setSuccessAnimation(true);
    
    setTimeout(() => {
      setSuccessAnimation(false);
    }, 4000);
  };

  // Open multi-select overlay dialog
  const openSelfSelector = () => {
    // Sync current list to draft selected list
    setTempSelectedIds([...toBeLearnedIds]);
    setSearchQuery("");
    setShowSelector(true);
  };

  // Interactive toggle item inside choice grid
  const handleToggleSelectorItem = (id: string) => {
    if (tempSelectedIds.includes(id)) {
      setTempSelectedIds(tempSelectedIds.filter((item) => item !== id));
    } else {
      setTempSelectedIds([...tempSelectedIds, id]);
    }
  };

  // Smart Pre-select 5 characters
  const handleSelectDefaultFive = () => {
    // Pick first 5 simple candidates that are not master mastered
    const firstFiveIds = candidateCharacters.slice(0, 5).map((c) => c.id);
    setTempSelectedIds(firstFiveIds);
  };

  // If custom characters get cleared/restored external wise:
  useEffect(() => {
    if (!userProgress.customCharacters || userProgress.customCharacters.length === 0) {
      setTempSelectedIds((prev) => prev.filter((id) => !id.startsWith("custom_")));
    }
  }, [userProgress.customCharacters]);

  // Handle commit select updating parent
  const handleSaveSelectorDraft = () => {
    onUpdateToBeLearned(tempSelectedIds);
    setShowSelector(false);
  };

  return (
    <div className="bg-slate-50 min-h-full py-2 px-1 text-slate-800" id="study-checklist-screen">
      {/* Dynamic Splash Overlay success */}
      <AnimatePresence>
        {successAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rose-500/90 z-50 flex flex-col items-center justify-center p-6 text-center text-white"
          >
            <motion.div
              initial={{ scale: 0.3 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl mb-4"
            >
              🎉👑🥁
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">学仙归堂 结成硕果！</h2>
            <p className="text-sm font-semibold max-w-sm mb-6 leading-relaxed">
              恭喜聪明的小宝贝，在 【{selectedCalendarDate}】 这一天成功学会了：
              <span className="block text-2xl font-black text-yellow-300 mt-2 filter drop-shadow">
                {masteredWords.join("、")}
              </span>
            </p>
            <div className="bg-white/15 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center gap-3 w-full max-w-xs mb-8">
              <span className="text-3xl">⭐</span>
              <div className="text-left">
                <p className="text-xs font-black text-rose-100">奖励发放成功</p>
                <p className="text-xl font-extrabold text-yellow-300">星星奖励 +{masteredWords.length * 10}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessAnimation(false)}
              className="px-8 py-3 bg-white text-rose-600 rounded-full text-base font-extrabold tracking-wide shadow-lg active:scale-95 transition"
            >
              太棒了，继续探索！
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-select Picker Dialogue Overlay (点进去自己挑) */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg h-[85vh] shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-100"
            >
              {/* Selector Header Bar */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-black flex items-center gap-2">
                    <Sparkles className="animate-pulse text-yellow-300" size={18} />
                    汉字精灵挑词乐园
                  </h3>
                  <p className="text-[10px] text-orange-100 font-semibold mt-1">
                    点击卡片挑选想学的汉字加入今日准备学清单中吧！
                  </p>
                </div>
                <button
                  onClick={() => setShowSelector(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center cursor-pointer transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Selector Search Control and Shortcuts */}
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 flex flex-col gap-3 shrink-0">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入汉字、拼音或释义查找..."
                    className="w-full bg-white text-slate-800 border-2 border-slate-200 focus:border-orange-400 rounded-xl py-2 pl-9 pr-4 text-xs font-bold transition focus:outline-none placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Intelligent shortcut commands */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    快捷指令
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {userProgress.customCharacters && userProgress.customCharacters.length > 0 && (
                      <button
                        onClick={() => onClearAllCustomCharacters?.()}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-500 hover:text-white border border-rose-200 text-rose-800 text-[9px] font-black rounded-lg transition active:scale-95 cursor-pointer flex items-center gap-0.5"
                      >
                        🗑️ 清空候选字库
                      </button>
                    )}

                    <button
                      onClick={handleSelectDefaultFive}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-200 text-amber-800 text-[9px] font-black rounded-lg transition active:scale-95 cursor-pointer"
                    >
                      🎒 帮我挑最简单的5个
                    </button>
                    <button
                      onClick={() => setTempSelectedIds([])}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-700 text-[9px] font-black rounded-lg transition active:scale-95 cursor-pointer"
                    >
                      ❌ 清空所选
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable grid area for selection */}
              <div className="flex-1 overflow-y-auto p-5 bg-[#FBFBFA]">
                {filteredCandidates.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2.5">
                    {filteredCandidates.map((char) => {
                      const isChosen = tempSelectedIds.includes(char.id);
                      return (
                        <div
                          key={char.id}
                          onClick={() => handleToggleSelectorItem(char.id)}
                          className={`rounded-2xl border-2 p-3 text-center transition-all duration-150 cursor-pointer flex flex-col justify-between relative select-none ${
                            isChosen
                              ? "bg-rose-50 border-rose-400 text-rose-800 shadow-md shadow-rose-100"
                              : "bg-white border-slate-200/60 text-slate-700 hover:border-slate-300 hover:shadow-xs"
                          }`}
                        >
                          {isChosen && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold z-10">
                              ✓
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCustomCharacter?.(char.id);
                            }}
                            className="absolute top-1 left-1 w-5.5 h-5.5 bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-xs z-20"
                            title="彻底从应用中删除/隐藏"
                          >
                            <Trash2 size={10} />
                          </button>

                          <span className="text-base filter drop-shadow-xs pointer-events-none self-start leading-none opacity-80 mb-1">
                            {char.emoji}
                          </span>
                          <span
                            className="text-2xl font-black block py-1 pointer-events-none"
                            style={{ fontFamily: 'KaiTi, Georgia, serif' }}
                          >
                            {char.word}
                          </span>
                          <span className="text-[8px] font-bold font-mono opacity-60 pointer-events-none block leading-none">
                            {char.pinyin}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <span className="text-4xl block">🔍💤</span>
                    <p className="text-xs font-black text-slate-400 mt-2">没有发现符合要求的候选字精灵~</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                      试着输入其他偏旁或字符哦，或者所有的字都在你的熟字箱里啦喵！
                    </p>
                  </div>
                )}
              </div>

              {/* Selector bottom footer save bar */}
              <div className="bg-slate-50 border-t border-slate-150 p-4 shrink-0 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  已在生字备选库挑了 <strong className="text-orange-600 font-extrabold font-mono text-sm">{tempSelectedIds.length}</strong> 个汉字
                </span>
                <button
                  onClick={handleSaveSelectorDraft}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition active:scale-95"
                >
                  Confirm 挑好啦！
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto flex flex-col gap-5 pt-3">
        {/* Banner with instructions */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[2rem] p-5 text-white shadow-md relative overflow-hidden border border-amber-400">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="relative">
            <h2 className="text-lg font-black flex items-center gap-1.5">
              <BookOpen size={18} />
              想学的字清单：今日学习备课
            </h2>
            <p className="text-xs text-orange-50/90 font-medium leading-relaxed mt-2">
              在下方勾选宝宝今天准备攻克的字，带领宝宝跟读、手写后点下方一键打卡按钮，即可奖励星星并自动归档入熟字库内！
            </p>
          </div>
        </div>

        {/* Dynamic Select Checklist card */}
        <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-dashed border-slate-100 pb-3">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                🎯 准备要学的汉字盒 ({toBeLearnedIds.length}字备选项)
              </h3>
            </div>
            
            <div className="flex items-center gap-1.5">
              {/* Click inside and pick button */}
              <button
                onClick={openSelfSelector}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[10px] font-black cursor-pointer shadow-sm hover:opacity-95 active:scale-95 transition"
                id="btn-self-select-picker"
              >
                🔍 点进去自己挑
              </button>
              
              <button
                onClick={selectAll}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-full text-[10px] font-black tracking-wide"
              >
                {toBeLearnedIds.every(id => checkedMap[id]) ? "取消全选" : "全选"}
              </button>

              {toBeLearnedIds.length > 0 && (
                <div className="inline-flex items-center gap-1">
                  {!showClearConfirm ? (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-full text-[10px] font-black tracking-wide cursor-pointer transition active:scale-95"
                      id="btn-clear-today-plan"
                    >
                      🗑️ 清空
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 rounded-full py-0.5 px-2.5 text-[9px] animate-pulse">
                      <span className="text-rose-700 font-extrabold select-none">确定清空吗？</span>
                      <button
                        onClick={() => {
                          onUpdateToBeLearned([]);
                          setShowClearConfirm(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full px-1.5 py-0.5 font-black cursor-pointer transition"
                      >
                        确定
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full px-1.5 py-0.5 font-black cursor-pointer transition"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {toBeLearnedIds.length > 0 ? (
            <div className="flex flex-col gap-3">
              {toBeLearnedIds.map((id) => {
                const char = allCharacters.find(c => c.id === id || c.word === id);
                if (!char) return null;
                const isTicked = !!checkedMap[char.id];

                return (
                  <div
                    key={char.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isTicked
                        ? "bg-rose-50/40 border-rose-200 shadow-sm shadow-rose-100/50"
                        : "bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox trigger */}
                      <button
                        onClick={() => toggleChecked(char.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition ${
                          isTicked
                            ? "bg-rose-500 border-rose-500 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isTicked && <span className="text-xs font-black">✓</span>}
                      </button>

                      {/* Character outline */}
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span
                            onClick={() => onSelectCharacterToWrite(char)}
                            className="text-2xl font-black text-slate-800 cursor-pointer hover:text-rose-500 transition-colors"
                            style={{ fontFamily: 'KaiTi, Georgia, serif' }}
                          >
                            {char.word}
                          </span>
                          <span className="text-xs font-bold text-red-500 font-mono">({char.pinyin})</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{char.meaning}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl filter drop-shadow-sm">{char.emoji}</span>
                      
                      {/* Tracing link trigger */}
                      <button
                        onClick={() => onSelectCharacterToWrite(char)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-[9px] font-extrabold text-amber-800 transition active:scale-95 cursor-pointer"
                        id={`btn-write-${char.id}`}
                      >
                        👉 去写字
                      </button>

                      {/* Delete individual character from waitlist (Miniature Red-Gray Trash Can) */}
                      <button
                        onClick={() => {
                          const updatedIds = toBeLearnedIds.filter((item) => item !== char.id);
                          onUpdateToBeLearned(updatedIds);
                        }}
                        className="w-7 h-7 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-sm active:scale-90"
                        id={`btn-delete-item-${char.id}`}
                        title="移出名单"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="text-4xl block">✨📦🎒</span>
              <p className="text-xs font-black text-slate-400 mt-2">耶！今天的准备学清单已经全部学完了喵！</p>
              <div className="flex flex-col gap-2 mt-4 max-w-xs mx-auto">
                <button
                  onClick={openSelfSelector}
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer hover:scale-102 transition"
                >
                  🚀 选一批新的字来学 (点进去自己自由选)
                </button>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">
                  您也可以在第一页顶部的输入框中手打想要学的新生字，系统会自动识别加入今天卡片哦！
                </p>
              </div>
            </div>
          )}

          {toBeLearnedIds.length > 0 && (
            <div className="mt-5 pt-4 border-t border-dashed border-slate-100">
              <button
                onClick={handlePunchCardSubmit}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] cursor-pointer transition-all flex items-center justify-center gap-1.5"
                id="btn-punch-all-cards"
              >
                <CheckCircle2 size={16} />
                确认今天已经学会，立即提交打卡!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
