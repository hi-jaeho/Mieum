export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// [브라우저가 정해 둔 함수]
// Intl.DateTimeFormat은 날짜를 언어와 지역에 맞게 꾸며 주는 표준 기능이다.
// formatTime/formatDate/conversationTime은 이 프로젝트에서 만든 함수이며 components/ChatComponents.jsx가 사용한다.
// 날짜 표시 규칙을 한곳에 모아 모든 화면이 같은 모양으로 시간을 보여 준다.
export const formatTime = (value) => new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
export const formatDate = (value) => new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(value));

export function conversationTime(value) {
  const date = new Date(value);
  const now = new Date();

  // 오늘 대화는 시각만, 지난 대화는 날짜만 보여 목록을 짧고 쉽게 읽게 한다.
  if (date.toDateString() === now.toDateString()) return formatTime(value);
  return new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric' }).format(date);
}
