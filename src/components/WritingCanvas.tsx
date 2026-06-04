/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Character } from "../types";
import { Trash2, Edit2, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, Play, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface WritingCanvasProps {
  character: Character;
  onSaveDrawing: (dataUrl: string) => void;
  onClose: () => void;
}

interface StrokePath {
  name: string; // Name of current stroke (e.g., 横, 竖, 撇, 捺)
  points: { x: number; y: number }[]; // Coordinates in percentage (0 - 100)
}

// Complete stroke guide databases covering 20 core kid characters
const STROKE_DATABASES: Record<string, StrokePath[]> = {
  "一": [
    { name: "横 (hèng)", points: [{ x: 20, y: 50 }, { x: 80, y: 50 }] }
  ],
  "二": [
    { name: "上短横 (héng)", points: [{ x: 30, y: 35 }, { x: 70, y: 35 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 65 }, { x: 80, y: 65 }] }
  ],
  "三": [
    { name: "上横 (héng)", points: [{ x: 30, y: 30 }, { x: 70, y: 30 }] },
    { name: "中短横 (héng)", points: [{ x: 35, y: 50 }, { x: 65, y: 50 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 70 }, { x: 80, y: 70 }] }
  ],
  "十": [
    { name: "先横 (héng)", points: [{ x: 20, y: 50 }, { x: 80, y: 50 }] },
    { name: "后竖 (shù)", points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] }
  ],
  "人": [
    { name: "先撇 (piě)", points: [{ x: 50, y: 20 }, { x: 40, y: 40 }, { x: 20, y: 80 }] },
    { name: "后捺 (nà)", points: [{ x: 46, y: 38 }, { x: 62, y: 58 }, { x: 80, y: 80 }] }
  ],
  "木": [
    { name: "横 (héng)", points: [{ x: 20, y: 42 }, { x: 80, y: 42 }] },
    { name: "竖 (shù)", points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
    { name: "撇 (piě)", points: [{ x: 50, y: 42 }, { x: 35, y: 62 }, { x: 20, y: 80 }] },
    { name: "捺 (nà)", points: [{ x: 50, y: 42 }, { x: 65, y: 62 }, { x: 80, y: 80 }] }
  ],
  "土": [
    { name: "上短横 (héng)", points: [{ x: 30, y: 35 }, { x: 70, y: 35 }] },
    { name: "中竖 (shù)", points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
    { name: "下长横 (héng)", points: [{ x: 15, y: 85 }, { x: 85, y: 85 }] }
  ],
  "山": [
    { name: "先中竖 (shù)", points: [{ x: 50, y: 20 }, { x: 50, y: 80 }] },
    { name: "再竖折 (shù zhé)", points: [{ x: 25, y: 45 }, { x: 25, y: 80 }, { x: 75, y: 80 }] },
    { name: "后右竖 (shù)", points: [{ x: 75, y: 45 }, { x: 75, y: 80 }] }
  ],
  "口": [
    { name: "先左竖 (shù)", points: [{ x: 28, y: 25 }, { x: 28, y: 75 }] },
    { name: "再横折 (héng zhé)", points: [{ x: 28, y: 25 }, { x: 72, y: 25 }, { x: 72, y: 75 }] },
    { name: "后封下横 (héng)", points: [{ x: 28, y: 75 }, { x: 72, y: 75 }] }
  ],
  "日": [
    { name: "先左竖 (shù)", points: [{ x: 28, y: 22 }, { x: 28, y: 78 }] },
    { name: "再横折 (héng zhé)", points: [{ x: 28, y: 22 }, { x: 72, y: 22 }, { x: 72, y: 78 }] },
    { name: "中横一 (héng)", points: [{ x: 28, y: 50 }, { x: 72, y: 50 }] },
    { name: "末尾封口横 (héng)", points: [{ x: 28, y: 78 }, { x: 72, y: 78 }] }
  ],
  "水": [
    { name: "中竖钩 (shù gōu)", points: [{ x: 50, y: 15 }, { x: 50, y: 75 }, { x: 44, y: 80 }] },
    { name: "左横撇 (héng piě)", points: [{ x: 22, y: 35 }, { x: 40, y: 35 }, { x: 25, y: 55 }] },
    { name: "右上撇 (piě)", points: [{ x: 76, y: 30 }, { x: 55, y: 50 }] },
    { name: "右下捺 (nà)", points: [{ x: 55, y: 50 }, { x: 78, y: 78 }] }
  ],
  "火": [
    { name: "左点 (diǎn)", points: [{ x: 26, y: 35 }, { x: 33, y: 45 }] },
    { name: "右短撇 (piě)", points: [{ x: 74, y: 35 }, { x: 67, y: 45 }] },
    { name: "中人撇 (piě)", points: [{ x: 50, y: 15 }, { x: 40, y: 50 }, { x: 20, y: 80 }] },
    { name: "末尾长捺 (nà)", points: [{ x: 46, y: 45 }, { x: 62, y: 65 }, { x: 80, y: 80 }] }
  ],
  "月": [
    { name: "先左撇 (piě)", points: [{ x: 30, y: 22 }, { x: 30, y: 78 }, { x: 23, y: 84 }] },
    { name: "再横折钩 (héng zhé gōu)", points: [{ x: 30, y: 22 }, { x: 70, y: 22 }, { x: 70, y: 78 }, { x: 63, y: 74 }] },
    { name: "中横一 (héng)", points: [{ x: 30, y: 40 }, { x: 70, y: 40 }] },
    { name: "中横二 (héng)", points: [{ x: 30, y: 58 }, { x: 70, y: 58 }] }
  ],
  "手": [
    { name: "首撇 (piě)", points: [{ x: 65, y: 20 }, { x: 35, y: 28 }] },
    { name: "中短横 (héng)", points: [{ x: 30, y: 42 }, { x: 70, y: 42 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 58 }, { x: 80, y: 58 }] },
    { name: "弯钩 (wān gōu)", points: [{ x: 50, y: 28 }, { x: 50, y: 80 }, { x: 40, y: 84 }] }
  ],
  "天": [
    { name: "上短横 (héng)", points: [{ x: 30, y: 28 }, { x: 70, y: 28 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 48 }, { x: 80, y: 48 }] },
    { name: "中人撇 (piě)", points: [{ x: 50, y: 25 }, { x: 38, y: 60 }, { x: 20, y: 85 }] },
    { name: "捺 (nà)", points: [{ x: 46, y: 48 }, { x: 62, y: 68 }, { x: 82, y: 85 }] }
  ],
  "门": [
    { name: "上点 (diǎn)", points: [{ x: 32, y: 22 }, { x: 36, y: 32 }] },
    { name: "左竖 (shù)", points: [{ x: 30, y: 45 }, { x: 30, y: 85 }] },
    { name: "横折钩 (héng zhé gōu)", points: [{ x: 30, y: 45 }, { x: 75, y: 45 }, { x: 75, y: 85 }, { x: 68, y: 80 }] }
  ],
  "开": [
    { name: "上横 (héng)", points: [{ x: 30, y: 30 }, { x: 70, y: 30 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 50 }, { x: 80, y: 50 }] },
    { name: "左撇 (piě)", points: [{ x: 42, y: 20 }, { x: 42, y: 50 }, { x: 35, y: 85 }] },
    { name: "右竖 (shù)", points: [{ x: 58, y: 20 }, { x: 58, y: 85 }] }
  ],
  "关": [
    { name: "左点 (diǎn)", points: [{ x: 35, y: 15 }, { x: 42, y: 25 }] },
    { name: "右短撇 (piě)", points: [{ x: 65, y: 15 }, { x: 58, y: 25 }] },
    { name: "中横一 (héng)", points: [{ x: 30, y: 38 }, { x: 70, y: 38 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 55 }, { x: 80, y: 55 }] },
    { name: "中撇 (piě)", points: [{ x: 50, y: 35 }, { x: 36, y: 65 }, { x: 18, y: 88 }] },
    { name: "捺 (nà)", points: [{ x: 45, y: 55 }, { x: 62, y: 72 }, { x: 82, y: 88 }] }
  ],
  "风": [
    { name: "① 左撇 (piě)", points: [{ x: 34, y: 24 }, { x: 32, y: 50 }, { x: 31, y: 82 }] },
    { name: "② 横斜钩 (héng xié gōu)", points: [{ x: 34, y: 24 }, { x: 66, y: 24 }, { x: 66, y: 48 }, { x: 75, y: 73 }, { x: 63, y: 67 }] },
    { name: "③ 内部撇 (piě)", points: [{ x: 58, y: 41 }, { x: 40, y: 63 }] },
    { name: "④ 内部点 (diǎn)", points: [{ x: 42, y: 41 }, { x: 58, y: 63 }] }
  ],
  "云": [
    { name: "上短横 (héng)", points: [{ x: 32, y: 28 }, { x: 68, y: 28 }] },
    { name: "下长横 (héng)", points: [{ x: 20, y: 46 }, { x: 80, y: 46 }] },
    { name: "撇折 (piě zhé)", points: [{ x: 50, y: 46 }, { x: 35, y: 65 }, { x: 68, y: 65 }] },
    { name: "点 (diǎn)", points: [{ x: 58, y: 58 }, { x: 66, y: 72 }] }
  ],
  "我": [
    { name: "① 撇 (piě)", points: [{ x: 42, y: 18 }, { x: 22, y: 32 }] },
    { name: "② 横 (héng)", points: [{ x: 20, y: 44 }, { x: 52, y: 38 }] },
    { name: "③ 竖钩 (shù gōu)", points: [{ x: 38, y: 38 }, { x: 38, y: 76 }, { x: 28, y: 68 }] },
    { name: "④ 提 (tí)", points: [{ x: 18, y: 72 }, { x: 44, y: 60 }] },
    { name: "⑤ 斜钩 (xié gōu)", points: [{ x: 48, y: 15 }, { x: 74, y: 84 }, { x: 84, y: 76 }] },
    { name: "⑥ 撇 (piě)", points: [{ x: 72, y: 42 }, { x: 56, y: 56 }] },
    { name: "⑦ 点 (diǎn)", points: [{ x: 70, y: 18 }, { x: 78, y: 26 }] }
  ],
  "石": [
    { name: "① 横 (héng)", points: [{ x: 25, y: 32 }, { x: 75, y: 32 }] },
    { name: "② 撇 (piě)", points: [{ x: 48, y: 32 }, { x: 38, y: 48 }, { x: 22, y: 72 }] },
    { name: "③ 竖 (shù)", points: [{ x: 36, y: 54 }, { x: 36, y: 82 }] },
    { name: "④ 横折 (héng zhé)", points: [{ x: 36, y: 54 }, { x: 70, y: 54 }, { x: 70, y: 82 }] },
    { name: "⑤ 下横 (héng)", points: [{ x: 36, y: 82 }, { x: 70, y: 82 }] }
  ],
  "雨": [
    { name: "① 上横 (héng)", points: [{ x: 26, y: 22 }, { x: 74, y: 22 }] },
    { name: "② 左竖 (shù)", points: [{ x: 34, y: 40 }, { x: 34, y: 78 }] },
    { name: "③ 横折钩 (héng zhé gōu)", points: [{ x: 34, y: 40 }, { x: 72, y: 40 }, { x: 72, y: 78 }, { x: 65, y: 73 }] },
    { name: "④ 中竖 (shù)", points: [{ x: 52, y: 22 }, { x: 52, y: 78 }] },
    { name: "⑤ 左上点 (diǎn)", points: [{ x: 42, y: 47 }, { x: 46, y: 52 }] },
    { name: "⑥ 左下点 (diǎn)", points: [{ x: 41, y: 63 }, { x: 45, y: 68 }] },
    { name: "⑦ 右上点 (diǎn)", points: [{ x: 60, y: 47 }, { x: 64, y: 52 }] },
    { name: "⑧ 右下点 (diǎn)", points: [{ x: 59, y: 63 }, { x: 63, y: 68 }] }
  ],
  "鱼": [
    { name: "① 鱼头撇 (piě)", points: [{ x: 50, y: 14 }, { x: 35, y: 26 }] },
    { name: "② 横折 (héng zhé)", points: [{ x: 50, y: 14 }, { x: 68, y: 26 }, { x: 52, y: 38 }] },
    { name: "③ 左竖 (shù)", points: [{ x: 32, y: 38 }, { x: 32, y: 68 }] },
    { name: "④ 横折 (héng zhé)", points: [{ x: 32, y: 38 }, { x: 70, y: 38 }, { x: 70, y: 68 }] },
    { name: "⑤ 中横 (héng)", points: [{ x: 32, y: 53 }, { x: 70, y: 53 }] },
    { name: "⑥ 中竖 (shù)", points: [{ x: 50, y: 38 }, { x: 50, y: 68 }] },
    { name: "⑦ 封口横 (héng)", points: [{ x: 32, y: 68 }, { x: 70, y: 68 }] },
    { name: "⑧ 长尾横 (héng)", points: [{ x: 20, y: 82 }, { x: 80, y: 82 }] }
  ],
  "鸟": [
    { name: "① 撇 (piě)", points: [{ x: 48, y: 18 }, { x: 36, y: 26 }] },
    { name: "② 横折钩 (héng zhé gōu)", points: [{ x: 36, y: 26 }, { x: 66, y: 26 }, { x: 66, y: 46 }, { x: 58, y: 42 }] },
    { name: "③ 睛点 (diǎn)", points: [{ x: 48, y: 34 }, { x: 52, y: 38 }] },
    { name: "④ 竖折折钩 (shù zhé折gōu)", points: [{ x: 36, y: 46 }, { x: 36, y: 74 }, { x: 76, y: 74 }, { x: 70, y: 66 }] },
    { name: "⑤ 底横 (héng)", points: [{ x: 22, y: 82 }, { x: 82, y: 82 }] }
  ],
  "马": [
    { name: "① 横折 (héng zhé)", points: [{ x: 32, y: 26 }, { x: 66, y: 26 }, { x: 64, y: 48 }] },
    { name: "② 竖折折钩 (shù zhé折gōu)", points: [{ x: 32, y: 48 }, { x: 32, y: 74 }, { x: 74, y: 74 }, { x: 66, y: 64 }] },
    { name: "③ 中横 (héng)", points: [{ x: 20, y: 50 }, { x: 80, y: 50 }] }
  ],
  "牛": [
    { name: "① 短撇 (piě)", points: [{ x: 48, y: 22 }, { x: 32, y: 30 }] },
    { name: "② 上短横 (héng)", points: [{ x: 28, y: 44 }, { x: 72, y: 44 }] },
    { name: "③ 下长横 (héng)", points: [{ x: 18, y: 64 }, { x: 82, y: 64 }] },
    { name: "④ 中竖 (shù)", points: [{ x: 50, y: 15 }, { x: 50, y: 88 }] }
  ],
  "羊": [
    { name: "① 左长点 (diǎn)", points: [{ x: 34, y: 15 }, { x: 41, y: 23 }] },
    { name: "② 右短撇 (piě)", points: [{ x: 64, y: 15 }, { x: 57, y: 23 }] },
    { name: "③ 上横 (héng)", points: [{ x: 28, y: 36 }, { x: 72, y: 36 }] },
    { name: "④ 中横 (héng)", points: [{ x: 35, y: 52 }, { x: 65, y: 52 }] },
    { name: "⑤ 下长横 (héng)", points: [{ x: 18, y: 68 }, { x: 82, y: 68 }] },
    { name: "⑥ 悬针竖 (shù)", points: [{ x: 50, y: 36 }, { x: 50, y: 88 }] }
  ],
  "兔": [
    { name: "① 撇 (piě)", points: [{ x: 46, y: 15 }, { x: 32, y: 25 }] },
    { name: "② 横折 (héng zhé)", points: [{ x: 32, y: 25 }, { x: 65, y: 25 }, { x: 63, y: 36 }] },
    { name: "③ 左竖 (shù)", points: [{ x: 33, y: 36 }, { x: 33, y: 50 }] },
    { name: "④ 横折 (héng zhé)", points: [{ x: 33, y: 36 }, { x: 65, y: 36 }, { x: 65, y: 50 }] },
    { name: "⑤ 封下横 (héng)", points: [{ x: 33, y: 50 }, { x: 65, y: 50 }] },
    { name: "⑥ 左大撇 (piě)", points: [{ x: 42, y: 50 }, { x: 20, y: 76 }] },
    { name: "⑦ 竖弯钩 (shù wān gōu)", points: [{ x: 56, y: 50 }, { x: 56, y: 76 }, { x: 78, y: 76 }, { x: 74, y: 68 }] },
    { name: "⑧ 右上点 (diǎn)", points: [{ x: 66, y: 56 }, { x: 74, y: 62 }] }
  ],
  "上": [
    { name: "① 中竖 (shù)", points: [{ x: 50, y: 15 }, { x: 50, y: 82 }] },
    { name: "② 中短横 (héng)", points: [{ x: 50, y: 48 }, { x: 74, y: 48 }] },
    { name: "③ 下长横 (héng)", points: [{ x: 20, y: 82 }, { x: 80, y: 82 }] }
  ],
  "下": [
    { name: "① 上长横 (héng)", points: [{ x: 18, y: 22 }, { x: 82, y: 22 }] },
    { name: "② 中竖 (shù)", points: [{ x: 50, y: 22 }, { x: 50, y: 82 }] },
    { name: "③ 右下点 (diǎn)", points: [{ x: 55, y: 45 }, { x: 72, y: 62 }] }
  ],
  "耳": [
    { name: "① 上横 (héng)", points: [{ x: 24, y: 22 }, { x: 76, y: 22 }] },
    { name: "② 左竖 (shù)", points: [{ x: 38, y: 22 }, { x: 38, y: 80 }] },
    { name: "③ 右竖 (shù)", points: [{ x: 62, y: 22 }, { x: 62, y: 92 }] },
    { name: "④ 中一横 (héng)", points: [{ x: 38, y: 44 }, { x: 62, y: 44 }] },
    { name: "⑤ 中二横 (héng)", points: [{ x: 38, y: 62 }, { x: 62, y: 62 }] },
    { name: "⑥ 下长横 (héng)", points: [{ x: 18, y: 80 }, { x: 82, y: 80 }] }
  ],
  "目": [
    { name: "① 左竖 (shù)", points: [{ x: 28, y: 16 }, { x: 28, y: 84 }] },
    { name: "② 横折 (héng zhé)", points: [{ x: 28, y: 16 }, { x: 72, y: 16 }, { x: 72, y: 84 }] },
    { name: "③ 中横一 (héng)", points: [{ x: 28, y: 39 }, { x: 72, y: 39 }] },
    { name: "④ 中横二 (héng)", points: [{ x: 28, y: 61 }, { x: 72, y: 61 }] },
    { name: "⑤ 封下横 (héng)", points: [{ x: 28, y: 84 }, { x: 72, y: 84 }] }
  ],
  "心": [
    { name: "① 左点 (diǎn)", points: [{ x: 25, y: 48 }, { x: 18, y: 58 }] },
    { name: "② 卧钩 (wò gōu)", points: [{ x: 28, y: 55 }, { x: 48, y: 84 }, { x: 70, y: 84 }, { x: 64, y: 66 }] },
    { name: "③ 中点 (diǎn)", points: [{ x: 44, y: 45 }, { x: 48, y: 36 }] },
    { name: "④ 右点 (diǎn)", points: [{ x: 74, y: 38 }, { x: 80, y: 46 }] }
  ],
  "大": [
    { name: "① 横 (héng)", points: [{ x: 20, y: 42 }, { x: 80, y: 42 }] },
    { name: "② 撇 (piě)", points: [{ x: 50, y: 15 }, { x: 38, y: 55 }, { x: 18, y: 84 }] },
    { name: "③ 捺 (nà)", points: [{ x: 45, y: 42 }, { x: 64, y: 65 }, { x: 82, y: 84 }] }
  ],
  "小": [
    { name: "① 竖钩 (shù gōu)", points: [{ x: 50, y: 12 }, { x: 50, y: 78 }, { x: 40, y: 82 }] },
    { name: "② 左点 (diǎn)", points: [{ x: 26, y: 45 }, { x: 18, y: 55 }] },
    { name: "③ 右点 (diǎn)", points: [{ x: 74, y: 45 }, { x: 82, y: 55 }] }
  ],
  "飞": [
    { name: "① 横斜钩 (héng xié gōu)", points: [{ x: 28, y: 26 }, { x: 66, y: 26 }, { x: 44, y: 82 }, { x: 54, y: 80 }] },
    { name: "② 左撇 (piě)", points: [{ x: 65, y: 42 }, { x: 48, y: 56 }] },
    { name: "③ 右点 (diǎn)", points: [{ x: 72, y: 52 }, { x: 80, y: 60 }] }
  ],
  "哭": [
    { name: "① 左眼-左竖 (shù)", points: [{ x: 24, y: 22 }, { x: 24, y: 38 }] },
    { name: "② 左眼-横折 (héng zhé)", points: [{ x: 24, y: 22 }, { x: 42, y: 22 }, { x: 42, y: 38 }] },
    { name: "③ 左眼-封口 (héng)", points: [{ x: 24, y: 38 }, { x: 42, y: 38 }] },
    { name: "④ 右眼-左竖 (shù)", points: [{ x: 58, y: 22 }, { x: 58, y: 38 }] },
    { name: "⑤ 右眼-横折 (héng zhé)", points: [{ x: 58, y: 22 }, { x: 76, y: 22 }, { x: 76, y: 38 }] },
    { name: "⑥ 右眼-封口 (héng)", points: [{ x: 58, y: 38 }, { x: 76, y: 38 }] },
    { name: "⑦ 中横 (héng)", points: [{ x: 20, y: 54 }, { x: 80, y: 54 }] },
    { name: "⑧ 撇 (piě)", points: [{ x: 50, y: 42 }, { x: 40, y: 64 }, { x: 22, y: 84 }] },
    { name: "⑨ 捺 (nà)", points: [{ x: 46, y: 54 }, { x: 62, y: 70 }, { x: 78, y: 84 }] },
    { name: "⑩ 右上点 (diǎn)", points: [{ x: 64, y: 44 }, { x: 70, y: 50 }] }
  ],
  "笑": [
    { name: "① 左竹-撇 (piě)", points: [{ x: 38, y: 16 }, { x: 26, y: 24 }] },
    { name: "② 左竹-横 (héng)", points: [{ x: 26, y: 24 }, { x: 44, y: 24 }] },
    { name: "③ 左竹-点 (diǎn)", points: [{ x: 33, y: 24 }, { x: 31, y: 32 }] },
    { name: "④ 右竹-撇 (piě)", points: [{ x: 64, y: 16 }, { x: 52, y: 24 }] },
    { name: "⑤ 右竹-横 (héng)", points: [{ x: 52, y: 24 }, { x: 72, y: 24 }] },
    { name: "⑥ 右竹-撇 (piě)", points: [{ x: 62, y: 24 }, { x: 56, y: 32 }] },
    { name: "⑦ 撇 (piě)", points: [{ x: 60, y: 38 }, { x: 40, y: 44 }] },
    { name: "⑧ 横 (héng)", points: [{ x: 25, y: 54 }, { x: 75, y: 54 }] },
    { name: "⑨ 撇 (piě)", points: [{ x: 50, y: 46 }, { x: 40, y: 66 }, { x: 22, y: 84 }] },
    { name: "⑩ 捺 (nà)", points: [{ x: 45, y: 54 }, { x: 62, y: 70 }, { x: 78, y: 84 }] }
  ],
  "你": [
    { name: "① 撇 (piě)", points: [{ x: 38, y: 18 }, { x: 22, y: 44 }] },
    { name: "② 竖 (shù)", points: [{ x: 30, y: 38 }, { x: 30, y: 85 }] },
    { name: "③ 撇 (piě)", points: [{ x: 62, y: 18 }, { x: 48, y: 32 }] },
    { name: "④ 横钩 (héng gōu)", points: [{ x: 48, y: 32 }, { x: 74, y: 32 }, { x: 68, y: 42 }] },
    { name: "⑤ 竖钩 (shù gōu)", points: [{ x: 56, y: 32 }, { x: 56, y: 78 }, { x: 48, y: 82 }] },
    { name: "⑥ 撇 (piě)", points: [{ x: 45, y: 50 }, { x: 33, y: 64 }] },
    { name: "⑦ 点 (diǎn)", points: [{ x: 67, y: 50 }, { x: 79, y: 64 }] }
  ]
};

// Real-time skeletal stroke path analyzer: vectorizes and segments stroke polylines for ANY custom or future added characters!
function generateStrokesForCharacter(char: string): StrokePath[] {
  if (STROKE_DATABASES[char]) {
    return STROKE_DATABASES[char];
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return [{ name: "① 整体一笔 (shū)", points: [{ x: 20, y: 50 }, { x: 80, y: 50 }] }];
    }

    // Set background & draw large text
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 68px 'PingFang SC', 'Microsoft YaHei', STKaiti, KaiTi, SimKai, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, 50, 50);

    const imgData = ctx.getImageData(0, 0, 100, 100);
    const data = imgData.data;

    // Build binary grid of character strokes (1 = ink, 0 = white paper)
    const grid: number[][] = Array.from({ length: 100 }, () => new Array(100).fill(0));
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 100; x++) {
        const idx = (y * 100 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        // High opacity & dark color = ink
        if (a > 60 && (r + g + b) / 3 < 180) {
          grid[y][x] = 1;
        }
      }
    }

    const visited = Array.from({ length: 100 }, () => new Array(100).fill(false));
    const strokes: StrokePath[] = [];

    // Helper to clear neighborhood of visited pixels so we don't trace duplicate lines
    const markVisitedArea = (cx: number, cy: number, radius: number) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx >= 0 && tx < 100 && ty >= 0 && ty < 100) {
            if (dx * dx + dy * dy <= radius * radius) {
              visited[ty][tx] = true;
            }
          }
        }
      }
    };

    // Names for dynamically extracted strokes
    const strokeNames = [
      "① 第一笔顺 (yī)",
      "② 第二笔顺 (èr)",
      "③ 第三笔顺 (sān)",
      "④ 第四笔顺 (sì)",
      "⑤ 第五笔顺 (wǔ)",
      "⑥ 第六笔顺 (liù)",
      "⑦ 第七笔顺 (qī)",
      "⑧ 第八笔顺 (bā)",
      "⑨ 第九笔顺 (jiǔ)",
      "⑩ 第十笔顺 (shí)"
    ];

    // Chinese stroke priority: Top-to-Bottom, Left-to-Right.
    // Scan to find stroke starts!
    for (let y = 10; y < 90; y++) {
      for (let x = 10; x < 90; x++) {
        if (grid[y][x] === 1 && !visited[y][x]) {
          // Found start of a new ink stroke!
          const points: { x: number; y: number }[] = [];
          let cx = x;
          let cy = y;
          points.push({ x: cx, y: cy });
          markVisitedArea(cx, cy, 3); // Mask has smaller radius to prevent blocking itself inside the tracing loop

          let active = true;
          let iterations = 0;

          // Trace this stroke
          while (active && iterations < 35) {
            iterations++;
            // Candidate search directions. Chinese strokes flow East, South, Southeast, Southwest:
            const dirs = [
              { dx: 2, dy: 1 },   // SE (撇/捺/下斜)
              { dx: 2, dy: 0 },   // E (横)
              { dx: 0, dy: 2 },   // S (竖)
              { dx: -2, dy: 1 },  // SW (撇/撇出)
              { dx: 2, dy: -1 },  // NE (提)
              { dx: 1, dy: 2 },   // SSE
              { dx: -1, dy: 2 },  // SSW
              { dx: -2, dy: -1 }  // NW (fallback)
            ];

            let foundNext = false;
            // Search at radial distance 2..6 to bypass local mask and continue tracing smoothly
            for (let dist = 2; dist <= 6 && !foundNext; dist++) {
              for (const dir of dirs) {
                const nx = cx + Math.round((dir.dx * dist) / 2);
                const ny = cy + Math.round((dir.dy * dist) / 2);
                if (nx >= 5 && nx < 95 && ny >= 5 && ny < 95) {
                  if (grid[ny][nx] === 1 && !visited[ny][nx]) {
                    cx = nx;
                    cy = ny;
                    points.push({ x: cx, y: cy });
                    markVisitedArea(cx, cy, 2); // incremental masking of the traced stroke path
                    foundNext = true;
                    break;
                  }
                }
              }
            }
            if (!foundNext) {
              active = false;
            }
          }

          // Save strokes which are long enough (filter transient noise)
          if (points.length >= 2) {
            // Simplify points
            const filteredPoints: { x: number; y: number }[] = [];
            filteredPoints.push(points[0]);
            
            // Add midpoints
            if (points.length > 3) {
              const mid = Math.floor(points.length / 2);
              filteredPoints.push(points[mid]);
            }
            filteredPoints.push(points[points.length - 1]);

            const sName = strokeNames[strokes.length] || `⑪ 续笔起落 (bǐ)`;
            strokes.push({
              name: sName,
              points: filteredPoints
            });
          }
        }
      }
    }

    if (strokes.length > 0) {
      return strokes;
    }
  } catch (e) {
    console.error("Dynamic strokes extraction error", e);
  }

  // Final static safety fallback if canvas fails or extraction returns empty
  return [
    { name: "① 起笔一横 (héng)", points: [{ x: 25, y: 35 }, { x: 75, y: 35 }] },
    { name: "② 悬斜一撇 (piě)", points: [{ x: 50, y: 35 }, { x: 30, y: 75 }] },
    { name: "③ 连横一折 (zhé)", points: [{ x: 30, y: 75 }, { x: 70, y: 75 }] }
  ];
}

const COLORS = [
  { name: "朱砂红", value: "#DC2626" }, // Red
  { name: "水墨黑", value: "#1F2937" }, // Slate
  { name: "竹叶绿", value: "#16A34A" }, // Green
  { name: "海天蓝", value: "#2563EB" }, // Blue
  { name: "暖阳金", value: "#D97706" }  // Gold
];

export default function WritingCanvas({ character, onSaveDrawing, onClose }: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#DC2626"); // Default standard red ink
  const [brushWidth, setBrushWidth] = useState(12);
  const [showGuide, setShowGuide] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Stroke order play states (笔顺动画状态)
  const [isPlayingStroke, setIsPlayingStroke] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(-1);
  const animationRef = useRef<number | null>(null);

  // Retrieve stroke instructions if mapped in database or generate dynamically so that absolutely any future character has rich stroke tracking
  const [targetStrokes, setTargetStrokes] = useState<StrokePath[]>([]);

  useEffect(() => {
    if (STROKE_DATABASES[character.word]) {
      setTargetStrokes(STROKE_DATABASES[character.word]);
    } else {
      setTargetStrokes(generateStrokesForCharacter(character.word));
    }
  }, [character.word]);

  const drawGrid = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.strokeStyle = "rgba(220, 38, 38, 0.25)"; // Soft red dashed grid lines
    ctx.lineWidth = 1.5;
    
    // Outer border
    ctx.strokeRect(4, 4, size - 8, size - 8);

    // Set dashed lines
    ctx.setLineDash([5, 5]);

    // Horizontal middle
    ctx.beginPath();
    ctx.moveTo(4, size / 2);
    ctx.lineTo(size - 4, size / 2);
    ctx.stroke();

    // Vertical middle
    ctx.beginPath();
    ctx.moveTo(size / 2, 4);
    ctx.lineTo(size / 2, size - 4);
    ctx.stroke();

    // Diagonals
    ctx.strokeStyle = "rgba(220, 38, 38, 0.1)";
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(size - 4, size - 4);
    ctx.moveTo(size - 4, 4);
    ctx.lineTo(4, size - 4);
    ctx.stroke();

    // Reset line dash
    ctx.setLineDash([]);
  };

  const drawBackgroundAndText = (ctx: CanvasRenderingContext2D, size: number) => {
    // 1. Clear with warm off-white background
    ctx.fillStyle = "#FCFAF2";
    ctx.fillRect(0, 0, size, size);

    // 2. Draw soft red Kaiti "描红" guidance text in background
    if (showGuide) {
      ctx.save();
      ctx.fillStyle = "rgba(220, 38, 38, 0.13)"; // Soft tracing red ink
      ctx.font = `bold ${size * 0.72}px STKaiti, KaiTi, SimKai, serif, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(character.word, size / 2, size / 2);
      ctx.restore();
    }

    // 3. Draw red/dashed grid lines
    drawGrid(ctx, size);
  };

  // Initialize and handle resize of canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const size = Math.min(320, window.innerWidth - 64);
      canvas.width = size;
      canvas.height = size;
      
      drawBackgroundAndText(ctx, size);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [character, showGuide]);

  // Canvas drawing event listeners
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isPlayingStroke) return; // Prevent writing when playing stroke demo
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineWidth = brushWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = brushColor;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isPlayingStroke) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    drawBackgroundAndText(ctx, size);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    if (isPlayingStroke) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save master tracing image in original formats
    const dataUrl = canvas.toDataURL("image/png");
    onSaveDrawing(dataUrl);
    setSavedSuccess(true);
    
    // Visual timeout feedback for happy user interactions
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  // Launch smart play stroke sequence animation (笔顺动画算法)
  const playStrokeAnimation = () => {
    if (isPlayingStroke) return;

    if (!targetStrokes) {
      // Fallback animations for custom characters
      playGenericFallbackAnimation();
      return;
    }

    setIsPlayingStroke(true);
    setCurrentStrokeIndex(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;

    // Create offscreen canvas for perfect calligraphic masking
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    const octx = offscreenCanvas.getContext("2d");
    if (!octx) return;

    let strokeIdx = 0;
    let progress = 0; // Cumulative progress 0.0 to 1.0 of drawing current stroke index

    const drawFrame = () => {
      if (strokeIdx >= targetStrokes.length) {
        // Animation finished
        setIsPlayingStroke(false);
        setCurrentStrokeIndex(-1);
        setShowGuide(true);
        
        // Voice report feedback
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const speech = new SpeechSynthesisUtterance("演示完毕！宝贝，下面跟着半透明的虚影，换你来写写看吧！");
          speech.lang = "zh-CN";
          window.speechSynthesis.speak(speech);
        }
        return;
      }

      setCurrentStrokeIndex(strokeIdx);
      const currentStroke = targetStrokes[strokeIdx];
      const pts = currentStroke.points;

      // Clear layout and redraw background, grid & light 描红 text under the stroke
      drawBackgroundAndText(ctx, size);

      // --- OFFSCREEN SEAMLESS GLYPH CONSTRAINTS ---
      // 1. Clear offscreen
      octx.clearRect(0, 0, size, size);

      // 2. Draw full Kaiti character as the solid silhouette destination mask
      octx.save();
      octx.fillStyle = "#1F2937"; // base ink silhouette
      octx.font = `bold ${size * 0.72}px STKaiti, KaiTi, SimKai, serif, sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(character.word, size / 2, size / 2);
      octx.restore();

      // 3. Switch to "source-in" so subsequent drawings only keep the silhouette intersection area
      octx.globalCompositeOperation = "source-in";

      // 4. Fill completed strokes area in beautiful deep violet
      for (let s = 0; s < strokeIdx; s++) {
        const prevStroke = targetStrokes[s];
        octx.beginPath();
        prevStroke.points.forEach((p, idx) => {
          const x = (p.x / 100) * size;
          const y = (p.y / 100) * size;
          if (idx === 0) octx.moveTo(x, y);
          else octx.lineTo(x, y);
        });
        octx.lineWidth = brushWidth + 36; // Thick enough to fully cover Kaiti strokes
        octx.lineCap = "round";
        octx.lineJoin = "round";
        octx.strokeStyle = "rgba(124, 58, 237, 0.9)"; // Beautiful completed stroke purple theme
        octx.stroke();
      }

      // 5. Fill growing active stroke area in bright orange
      let targetX = size / 2;
      let targetY = size / 2;
      if (pts.length > 1) {
        octx.beginPath();
        const startX = (pts[0].x / 100) * size;
        const startY = (pts[0].y / 100) * size;
        octx.moveTo(startX, startY);

        const totalSegments = pts.length - 1;
        const progressPerSeg = 1 / totalSegments;

        const currentSeg = Math.min(Math.floor(progress / progressPerSeg), totalSegments - 1);
        const segProgress = (progress - currentSeg * progressPerSeg) / progressPerSeg;

        // Draw fully completed segments within this stroke
        for (let i = 0; i <= currentSeg; i++) {
          const p = pts[i];
          const x = (p.x / 100) * size;
          const y = (p.y / 100) * size;
          if (i === 0) octx.moveTo(x, y);
          else octx.lineTo(x, y);
        }

        // Draw last growing interpolated line segment
        const p1 = pts[currentSeg];
        const p2 = pts[currentSeg + 1];
        targetX = ((p1.x + (p2.x - p1.x) * segProgress) / 100) * size;
        targetY = ((p1.y + (p2.y - p1.y) * segProgress) / 100) * size;
        octx.lineTo(targetX, targetY);

        octx.lineWidth = brushWidth + 40; // Very thick to fully paint the active Kaiti stroke
        octx.lineCap = "round";
        octx.lineJoin = "round";
        octx.strokeStyle = "#EA580C"; // Sizzling orange active stroke ink
        octx.stroke();
      }

      // 6. Reset offscreen composite operation to default
      octx.globalCompositeOperation = "source-over";

      // 7. Draw the beautifully masked offscreen result onto our active canvas screen
      ctx.drawImage(offscreenCanvas, 0, 0);

      // 8. Render the interactive glowing pointer tip directly on the main canvas (outside clipping box)
      if (pts.length > 1) {
        ctx.beginPath();
        ctx.arc(targetX, targetY, (brushWidth / 2) + 9, 0, Math.PI * 2);
        ctx.fillStyle = "#F59E0B";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(targetX, targetY, (brushWidth / 2) + 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      // Progress increment
      progress += 0.035; // speed rate

      if (progress >= 1) {
        // Move to next stroke sequence
        strokeIdx++;
        progress = 0;
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    // Voice announcement for child
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(`开始播放，${character.word}！跟小精灵来认清笔顺路线吧！`);
      speech.lang = "zh-CN";
      window.speechSynthesis.speak(speech);
    }

    animationRef.current = requestAnimationFrame(drawFrame);
  };

  // Safe fallback if target strokes points are unknown
  const playGenericFallbackAnimation = () => {
    setIsPlayingStroke(true);
    setCurrentStrokeIndex(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;

    let progress = 0;

    const drawFrame = () => {
      if (progress >= 1) {
        setIsPlayingStroke(false);
        setCurrentStrokeIndex(-1);
        setShowGuide(true);
        return;
      }

      // Draw shining overlay breathing light representing calligraphy flow
      ctx.fillStyle = "#FCFAF2";
      ctx.fillRect(0, 0, size, size);
      drawGrid(ctx, size);

      // Render breathing faded target text
      ctx.save();
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + Math.sin(progress * Math.PI) * 0.4})`;
      ctx.font = `${size * 0.65}px KaiTi, Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(character.word, size / 2, size / 2);
      ctx.restore();

      progress += 0.015;
      animationRef.current = requestAnimationFrame(drawFrame);
    };

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(`这字共有好多笔画，跟着半透明红色笔迹，自由书写一幅大作吧！`);
      speech.lang = "zh-CN";
      window.speechSynthesis.speak(speech);
    }

    animationRef.current = requestAnimationFrame(drawFrame);
  };

  return (
    <div className="flex flex-col h-full bg-amber-50/40 p-4 md:p-6" id="stroke-writing-panel">
      {/* Top Header navbar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700 hover:bg-gray-50 font-medium cursor-pointer transition-all duration-200"
          id="btn-back-to-card"
        >
          <ArrowLeft size={16} className="text-gray-500" />
          返回卡片
        </button>
        <div className="text-center">
          <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold tracking-wide">
            书法小秀场
          </span>
        </div>
        <div className="flex gap-2">
          {/* Main Play Stroke Animation button */}
          <button
            onClick={playStrokeAnimation}
            disabled={isPlayingStroke}
            className={`flex items-center gap-1 px-3 py-2 rounded-full shadow-sm text-sm font-black transition-all cursor-pointer ${
              isPlayingStroke
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
            id="btn-play-stroke-animation"
          >
            <Play size={14} className={isPlayingStroke ? "" : "animate-pulse"} />
            播放笔顺动画
          </button>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full shadow-sm text-sm font-medium transition-all cursor-pointer ${
              showGuide ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            id="btn-toggle-guide"
          >
            <HelpCircle size={15} />
            {showGuide ? "隐藏描红" : "显示描红"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center flex-1 max-w-4xl mx-auto w-full">
        {/* Canvas & guidelines layout */}
        <div className="relative" ref={containerRef}>
          {/* Active play stroke caption board */}
          {isPlayingStroke && (
            <div className="absolute inset-x-0 top-3 px-4 py-2 z-10 mx-auto text-center pointer-events-none">
              <span className="bg-orange-600/90 text-white text-xs px-3.5 py-1.5 rounded-full font-black shadow-md inline-flex items-center gap-1.5 backdrop-blur-sm animate-bounce">
                <Sparkles size={12} className="text-yellow-200 animate-spin" />
                正在播放正统笔画第 {currentStrokeIndex + 1} 步：
                {targetStrokes ? targetStrokes[currentStrokeIndex]?.name : "墨香生长中..."}
              </span>
            </div>
          )}

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl border-4 border-amber-800/10 shadow-xl overflow-hidden bg-[#FCFAF2] cursor-crosshair touch-none ${
              isPlayingStroke ? "pointer-events-none opacity-90" : ""
            }`}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="block"
              id="writing-canvas-board"
            />
          </motion.div>

          <p className="text-center text-xs text-amber-900/60 mt-2 font-medium">
            {isPlayingStroke
              ? "🪄 奇妙水彩笔正自动画出正确笔顺，请仔细看路线哦！"
              : `用你的手指或鼠标，一笔一画练习写“${character.word}”字`}
          </p>
        </div>

        {/* Brush Controls & Ink Well / Step Description card */}
        <div className="w-full max-w-xs flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-md border border-amber-900/5">
          {/* Advanced Stroke steps sequence checklist for Baby & Parents */}
          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3">
            <h4 className="text-xs font-black text-orange-950 flex items-center gap-1 mb-1.5">
              <Sparkles size={11} className="text-orange-500" />
              汉字笔顺释义卡
            </h4>
            {targetStrokes ? (
              <div className="flex flex-col gap-1">
                {targetStrokes.map((stroke, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 text-[9px] font-black flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-800">{stroke.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[9px] text-slate-400 font-medium italic">
                这是新添生字精灵，总笔画非常神奇，跟着灰色虚线从上往下书写即可~
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              国风彩色神笔
            </h3>
            <div className="grid grid-cols-5 gap-2" id="ink-selection-grid">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBrushColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                    brushColor === color.value ? "border-amber-900 scale-105 shadow-inner" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {brushColor === color.value && (
                    <span className="w-2 h-2 rounded-full bg-white shadow"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Edit2 size={14} className="text-amber-700" />
                毛笔头粗细
              </h3>
              <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
                {brushWidth}px
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={brushWidth}
              onChange={(e) => setBrushWidth(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
              id="slider-brush-width"
            />
          </div>

          {/* Canvas action functions */}
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={clearCanvas}
              disabled={isPlayingStroke}
              className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all duration-150 ${
                isPlayingStroke ? "opacity-50 cursor-not-allowed" : ""
              }`}
              id="btn-clear-canvas"
            >
              <Trash2 size={15} />
              重写 / 擦干净
            </button>
            
            <button
              onClick={handleSave}
              disabled={isPlayingStroke}
              className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold shadow-sm transition-all duration-300 cursor-pointer ${
                isPlayingStroke
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : savedSuccess
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-800 text-white hover:bg-amber-900 shadow-md active:scale-[0.98]"
              }`}
              id="btn-save-masterpiece"
            >
              <CheckCircle2 size={18} />
              {savedSuccess ? "已存入小画框！" : "保存这幅大作 (+5 ⭐️)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
