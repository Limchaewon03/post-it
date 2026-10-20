import { PostIt } from '@/types/postit';

// 사용자가 제공한 구글 시트 URL
export const USER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/19QMuJa7RXSba3Ye4kSBHg9ATTpvAyo4yB_AHTZu2CLs/edit?usp=sharing';
export const DEFAULT_SHEET_URL = USER_SHEET_URL;

// 사용자가 배포한 Google Apps Script Web App 엔드포인트
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwAIEsrlfYbWyl0d4_Xcl0YvST9Gz3jW2Oa7XN9soFwnzPD_bGn4W6l40vXfun5vs_1FQ/exec';

export function getGasUrl(): string {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('postit_gas_url');
    if (customUrl && customUrl.trim().startsWith('http')) {
      return customUrl.trim();
    }
  }
  return process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || DEFAULT_GAS_URL;
}

export async function fetchPostItsFromSheet(): Promise<PostIt[]> {
  const url = getGasUrl();
  if (!url) return [];

  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      // 1. timestamp 및 내용 기준 중복 제거 (Deduplication)
      const seen = new Set<string>();
      const uniqueItems: PostIt[] = [];

      for (let idx = 0; idx < json.data.length; idx++) {
        const item = json.data[idx];
        const rawTimestamp = String(item.timestamp || '').trim();
        const content = String(item.content || '').trim();

        // 빈 내용 제외 (헤더만 있거나 잘못 저장된 빈 행)
        if (!content && !rawTimestamp) continue;

        // 고유 키: timestamp가 유효하면 timestamp, 없으면 idx
        const uniqueKey = rawTimestamp || `${content}_${idx}`;

        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          uniqueItems.push({
            timestamp: rawTimestamp || `${Date.now()}-${idx}`,
            datetime: String(item.datetime || ''),
            category: (item.category === '할 일' || item.category === '아이디어' || item.category === '기타' ? item.category : '기타') as any,
            content,
            color: String(item.color || '1'),
            state: (item.state === '완료' || item.state === '체크' ? '완료' : '미완료') as any,
            order: Number(item.order) || uniqueItems.length + 1,
          });
        }
      }

      return uniqueItems;
    }
  } catch (err) {
    console.warn('Google Sheets API load error:', err);
  }

  return [];
}

export async function sendSheetAction(action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC_ALL', data: any): Promise<boolean> {
  const url = getGasUrl();
  if (!url) return false;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, data }),
    });
    return true;
  } catch (err) {
    console.error(`Google Sheets ${action} error:`, err);
    return false;
  }
}
