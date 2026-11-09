import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { chatApi } from "../services/mockApi";
import { conversationTime, formatDate, formatTime } from "../utils/helpers";
import { Avatar, Empty, Loader, Modal } from "./UI";

// [함수/컴포넌트 출처]
// useState/useEffect/useRef는 React, NavLink는 react-router-dom이 제공한다.
// Avatar/Empty/Loader/Modal은 같은 폴더의 UI.jsx, 날짜 함수는 utils/helpers.js에서 만들었다.
// [백엔드 연결 현황]
// 세 컴포넌트 모두 services/mockApi.js의 chatApi를 사용하므로 대화/메시지는 현재 mockData + localStorage 기반이다.

export function ConversationList({
  user,
  users,
  result,
  loading,
  error,
  search,
  filter,
  onSearch,
  onFilter,
  onPage,
  onNew,
  onRetry,
}) {
  // 이 매개변수들은 pages/DashboardPage.jsx가 props로 내려 준다.
  // 특히 onSearch/onFilter/onPage/onNew/onRetry는 부모 컴포넌트에서 정의된 함수다.
  // 사원은 대화 종류를, 고객은 대화 진행 상태를 기준으로 목록을 거른다.
  const filters =
    user.role !== "customer"
      ? [
          ["all", "전체"],
          ["internal", "사내"],
          ["customer", "고객"],
        ]
      : [
          ["all", "전체"],
          ["open", "진행 중"],
          ["closed", "종료"],
        ];
  return (
    <section className="conversations">
      <header>
        <div>
          <small>YOUR CONVERSATIONS</small>
          <h2>
            모든 대화 <em>{result?.total ?? "–"}</em>
          </h2>
        </div>
        <button type="button" onClick={onNew} aria-label="새 대화">
          ＋
        </button>
      </header>
      <div className="list-controls">
        <label className="search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="대화 검색하기"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </label>
        <div className="filters">
          {filters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "active" : ""}
              onClick={() => onFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="conversation-items">
        {loading ? (
          <div className="skeletons">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <i />
                <span>
                  <b />
                  <b />
                </span>
              </div>
            ))}
          </div>
        ) : error ? (
          <Empty
            error
            title="대화를 불러오지 못했어요"
            text={error}
            action="다시 시도"
            onAction={onRetry}
          />
        ) : result?.items.length ? (
          result.items.map((room) => {
            // find/map은 JavaScript 배열에 이미 정해진 함수다. find는 조건에 맞는 첫 항목 하나를 찾는다.
            const other = users.find(
              (item) =>
                item.id === room.participants.find((id) => id !== user.id),
            );
            return (
              <NavLink
                to={`/dashboard/chats/${room.id}`}
                className={({ isActive }) =>
                  `conversation ${isActive ? "active" : ""}`
                }
                key={room.id}
              >
                <Avatar user={other || { name: room.title }} />
                <div>
                  <span>
                    <strong>{room.title}</strong>
                    <time>{conversationTime(room.updatedAt)}</time>
                  </span>
                  <small>
                    {room.type === "internal" ? "사내 대화" : "고객 대화"}
                    {room.status === "closed" ? " · 종료" : ""}
                  </small>
                  <span>
                    <p>{room.lastMessage}</p>
                    {room.unread > 0 && <b>{room.unread}</b>}
                  </span>
                </div>
              </NavLink>
            );
          })
        ) : (
          <Empty
            title={search ? "검색 결과가 없어요" : "아직 대화가 없어요"}
            text={
              search
                ? "다른 검색어를 입력해 보세요."
                : "새 대화를 시작해 보세요."
            }
            action={!search ? "새 대화 시작" : null}
            onAction={onNew}
          />
        )}
      </div>
      {result?.pages > 1 && (
        <footer>
          <span>{result.total}개의 대화</span>
          <div>
            <button
              disabled={result.page === 1}
              onClick={() => onPage(result.page - 1)}
            >
              ‹
            </button>
            <b>
              {result.page} / {result.pages}
            </b>
            <button
              disabled={result.page === result.pages}
              onClick={() => onPage(result.page + 1)}
            >
              ›
            </button>
          </div>
        </footer>
      )}
    </section>
  );
}

export function ChatRoom({ id, user, users, onUpdate }) {
  // id/user/users/onUpdate는 pages/DashboardPage.jsx가 전달한다.
  // onUpdate의 실제 함수 이름은 DashboardPage의 reload이며, 전송 후 왼쪽 목록을 다시 읽게 한다.
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scroll = useRef(null);
  // 대화방 정보와 메시지는 서로 독립된 데이터이므로 동시에 요청해 기다리는 시간을 줄인다.
  // alive는 다른 방으로 빠르게 이동했을 때 늦게 도착한 이전 응답이 화면을 덮지 못하게 막는다.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([chatApi.room(id, user.id), chatApi.messages(id)])
      .then(([next, items]) => {
        if (alive) {
          setRoom(next);
          setMessages(items);
          setError("");
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id, user.id]);
  // 새 메시지가 붙으면 긴 두루마리를 맨 아래로 내리듯 최신 메시지로 이동한다.
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages]);
  // 공백 메시지와 전송 버튼 연타를 막은 뒤 성공한 메시지만 화면에 추가한다.
  const send = async (e) => {
    e?.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      // send는 mockApi.js의 함수다. 실제 네트워크 요청이 아니라 localStorage에 메시지를 추가한다.
      const message = await chatApi.send({
        conversationId: id,
        senderId: user.id,
        text: draft,
      });
      setMessages([...messages, message]);
      setDraft("");
      onUpdate();
    } finally {
      setSending(false);
    }
  };
  if (loading)
    return (
      <section className="chat state-wrap">
        <Loader label="대화를 불러오는 중이에요" />
      </section>
    );
  if (error)
    return (
      <section className="chat state-wrap">
        <Empty error title="대화를 열 수 없어요" text={error} />
      </section>
    );
  const other = users.find(
    (item) => item.id === room.participants.find((value) => value !== user.id),
  );
  // 바로 앞 메시지와 날짜가 달라질 때만 날짜 구분선을 그린다.
  let lastDate = "";
  return (
    <section className="chat">
      <header>
        <div>
          <NavLink to="/dashboard" className="back">
            ←
          </NavLink>
          <Avatar user={other || { name: room.title }} />
          <span>
            <h2>{room.title}</h2>
            <small>
              ● {room.type === "internal" ? "사내 대화" : "고객 대화"} · 멤버{" "}
              {room.participants.length}명
            </small>
          </span>
        </div>
        <b>{room.status === "closed" ? "종료" : "진행 중"}</b>
      </header>
      <div className="messages" ref={scroll}>
        {messages.length ? (
          messages.map((message) => {
            const own = message.senderId === user.id;
            const sender =
              users.find((item) => item.id === message.senderId) || user;
            const date = new Date(message.createdAt).toDateString();
            const show = date !== lastDate;
            lastDate = date;
            return (
              <div key={message.id}>
                {show && (
                  <div className="date">
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                )}
                <article className={own ? "mine" : ""}>
                  {!own && <Avatar user={sender} size="xs" />}
                  <div>
                    {!own && <strong>{sender.name}</strong>}
                    <section>
                      <p>{message.text}</p>
                      <time>{formatTime(message.createdAt)}</time>
                    </section>
                  </div>
                </article>
              </div>
            );
          })
        ) : (
          <Empty
            title="첫 메시지를 보내보세요"
            text="좋은 대화가 여기서 시작됩니다."
          />
        )}
      </div>
      {room.status === "closed" ? (
        <div className="closed">종료된 대화입니다.</div>
      ) : (
        <form className="composer" onSubmit={send}>
          <label className="sr-only" htmlFor="message">
            메시지
          </label>
          <textarea
            id="message"
            placeholder="메시지를 입력하세요..."
            value={draft}
            maxLength={1000}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                send();
              }
            }}
          />
          <div>
            <small>Enter로 전송 · Shift + Enter로 줄바꿈</small>
            <span>{draft.length}/1000</span>
            <button disabled={!draft.trim() || sending}>➤</button>
          </div>
        </form>
      )}
    </section>
  );
}

export function NewChatModal({ user, users, onClose, onCreated }) {
  // 이 props들은 pages/DashboardPage.jsx가 전달한다.
  // onClose는 모달 상태를 false로, onCreated는 부모의 created(room)를 실행한다.
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // 본인은 제외하고, 고객끼리는 서로 대화를 만들 수 없도록 후보를 제한한다.
  const people = users
    .filter(
      (item) =>
        item.id !== user.id &&
        (user.role !== "customer" || item.role !== "customer"),
    )
    .filter((item) =>
      `${item.name} ${item.company} ${item.department}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const select = (person) => {
    // select는 이 컴포넌트에서 직접 만든 함수이며, 아래 사람 버튼의 onClick이 호출한다.
    setSelected(person);
    setTitle(`${person.name}님과의 대화`);
    setError("");
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return setError("대화 상대를 선택해 주세요.");
    if (!title.trim()) return setError("대화 제목을 입력해 주세요.");
    setBusy(true);
    try {
      // chatApi.create는 mockApi.js의 더미 함수다. 성공 결과를 부모가 준 onCreated로 전달한다.
      onCreated(
        await chatApi.create({ creator: user, participant: selected, title }),
      );
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };
  return (
    <Modal
      title="새 대화 시작"
      subtitle="이야기를 나눌 상대를 선택해 주세요."
      onClose={onClose}
    >
      <form className="new-chat" onSubmit={submit}>
        <label className="search">
          <span>⌕</span>
          <input
            autoFocus
            type="search"
            placeholder="이름, 회사 또는 부서 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <small className="person-label">
          대화 상대 <b>{people.length}</b>
        </small>
        <div className="people">
          {people.map((person) => (
            <button
              type="button"
              className={selected?.id === person.id ? "active" : ""}
              key={person.id}
              onClick={() => select(person)}
            >
              <Avatar user={person} size="sm" />
              <span>
                <strong>{person.name}</strong>
                <small>
                  {person.role === "employee"
                    ? `${person.department} · ${person.company}`
                    : person.company}
                </small>
              </span>
              {selected?.id === person.id && <b>✓</b>}
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="chat-title">대화 제목</label>
          <input
            id="chat-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="대화 제목을 입력하세요"
          />
        </div>
        {error && <div className="form-error">! {error}</div>}
        <footer>
          <button type="button" className="btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn pink" disabled={busy}>
            {busy ? "시작하는 중..." : "대화 시작 →"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
