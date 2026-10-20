export function formatDateTime(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day} (${dayName}) ${hours}:${minutes}`;
}

export function generateTimestamp(): string {
  const now = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${now}-${randomStr}`;
}
