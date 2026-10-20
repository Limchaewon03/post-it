'use client';

import { useState, useEffect } from 'react';
import { Settings, X, ExternalLink, Check, Copy, Sheet } from 'lucide-react';
import { DEFAULT_GAS_URL, DEFAULT_SHEET_URL } from '@/lib/googleSheet';

interface SettingsModalProps {
  authorName: string;
  onUpdateAuthor: (name: string) => void;
  onSettingsSaved: () => void;
}

export default function SettingsModal({
  authorName,
  onUpdateAuthor,
  onSettingsSaved,
}: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [gasUrl, setGasUrl] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [name, setName] = useState(authorName);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGas = localStorage.getItem('postit_gas_url') || '';
      const savedSheet = localStorage.getItem('postit_sheet_url') || DEFAULT_SHEET_URL;
      setGasUrl(savedGas);
      setSheetUrl(savedSheet);
      setName(authorName);
    }
  }, [authorName, isOpen]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      if (gasUrl.trim()) {
        localStorage.setItem('postit_gas_url', gasUrl.trim());
      } else {
        localStorage.removeItem('postit_gas_url');
      }
      localStorage.setItem('postit_sheet_url', sheetUrl.trim() || DEFAULT_SHEET_URL);
      localStorage.setItem('postit_author_name', name.trim() || 'chaewon lim');
      onUpdateAuthor(name.trim() || 'chaewon lim');
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setIsOpen(false);
        onSettingsSaved();
      }, 600);
    }
  };

  const gasTemplateCode = `// Google Apps Script (Code.gs)
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const headers = data[0];
  const rows = data.slice(1);
  const result = rows.map(r => ({
    timestamp: String(r[0] || ""),
    datetime: String(r[1] || ""),
    category: String(r[2] || ""),
    content: String(r[3] || ""),
    color: String(r[4] || "1"),
    state: String(r[5] || "미완료"),
    order: Number(r[6] || 1)
  })).sort((a, b) => a.order - b.order);

  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const item = payload.data;

    if (action === "SYNC_ALL" && Array.isArray(item)) {
      sheet.clearContents();
      sheet.appendRow(["timestamp", "datetime", "category", "content", "color", "state", "order"]);
      item.forEach(n => {
        sheet.appendRow([n.timestamp, n.datetime, n.category, n.content, n.color, n.state, n.order]);
      });
    } else if (action === "CREATE") {
      sheet.appendRow([item.timestamp, item.datetime, item.category, item.content, item.color, item.state, item.order]);
    } else if (action === "DELETE") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(item.timestamp)) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
    } else if (action === "UPDATE") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(item.timestamp)) {
          sheet.getRange(i + 1, 1, 1, 7).setValues([[
            item.timestamp, item.datetime, item.category, item.content, item.color, item.state, item.order
          ]]);
          break;
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(gasTemplateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="설정"
        title="구글 시트 연동 및 사용자 설정"
        className="p-2.5 rounded-2xl border border-stone-200/80 dark:border-[#6272a4]/80 bg-white/80 dark:bg-[#282a36]/80 text-stone-700 dark:text-[#f8f8f2] hover:bg-stone-100 dark:hover:bg-[#44475a] shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
      >
        <Settings className="w-5 h-5 opacity-80" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#282a36] text-stone-900 dark:text-[#f8f8f2] w-full max-w-xl rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-[#6272a4] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-[#6272a4]/50 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-amber-950">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">프로젝트 및 구글 시트 연동 설정</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-[#44475a] text-stone-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5 text-sm">
              {/* Author name for footer */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  작성자 이름 (Footer: Copyright INU Post-it Todo List by OOO)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 20260001 홍길동"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#6272a4] bg-stone-50 dark:bg-[#1e1e2e] outline-none focus:ring-2 focus:ring-amber-400 font-semibold"
                />
              </div>

              {/* Google Apps Script URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    구글 웹 앱 배포 URL (Google Apps Script Web App URL)
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400">
                    비워둘 시 기본 제공 시트 연동
                  </span>
                </div>
                <input
                  type="text"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  placeholder={DEFAULT_GAS_URL}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#6272a4] bg-stone-50 dark:bg-[#1e1e2e] outline-none focus:ring-2 focus:ring-amber-400 font-mono text-xs"
                />
              </div>

              {/* Google Sheet URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    구글 시트 바로가기 링크 (Google Spreadsheet URL)
                  </label>
                  <a
                    href={sheetUrl || DEFAULT_SHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    시트 열기 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder={DEFAULT_SHEET_URL}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#6272a4] bg-stone-50 dark:bg-[#1e1e2e] outline-none focus:ring-2 focus:ring-amber-400 font-mono text-xs"
                />
              </div>

              {/* Google Apps Script Code Accordion */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-[#44475a]/50 border border-amber-200/70 dark:border-[#6272a4]/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                    <Sheet className="w-3.5 h-3.5" />
                    내 개인 구글 시트 연동 코드 (Apps Script)
                  </span>
                  <button
                    onClick={copyCode}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-white dark:bg-[#282a36] border border-amber-300 dark:border-[#6272a4] hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> 코드 복사
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  구글 스프레드시트 메뉴의 [확장 프로그램] → [Apps Script]에 위 코드를 붙여넣고 [배포] → [새 배포] (웹 앱, 액세스 권한: 모든 사용자)로 배포하면 자신만의 구글 시트와 연동할 수 있습니다.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-[#6272a4]/50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 dark:text-stone-300 font-bold hover:bg-stone-100 dark:hover:bg-[#44475a] transition-colors"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold shadow-md transition-all active:scale-95"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" /> 저장 완료!
                    </>
                  ) : (
                    '설정 저장'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
