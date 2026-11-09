import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ConversationList,
  ChatRoom,
  NewChatModal,
} from "../components/ChatComponents";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { chatApi } from "../services/mockApi";

// [함수/컴포넌트 출처]
// useState/useEffect/useCallback은 React, useParams/useNavigate는 react-router-dom이 제공한다.
// ConversationList/ChatRoom/NewChatModal은 components/ChatComponents.jsx에서 정의했다.
// useAuth와 useToast는 각각 context 폴더에서 만든 프로젝트 훅이다.
// [백엔드 연결 현황]
// 이 화면의 chatApi는 services/mockApi.js에 있으며 mockData + localStorage로 동작한다.
// 백엔드 채팅 API가 생기면 chatApi.list/users/room/messages/send/create를 실제 요청으로 바꿔야 한다.

export default function DashboardPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [modal, setModal] = useState(false);

  // refresh 숫자를 올리면 아래 useEffect가 다시 실행되어 최신 목록을 가져온다.
  // useCallback은 React가 함수를 기억하게 하는 훅이고, reload 자체는 DashboardPage에서 만든 함수다.
  const reload = useCallback(() => setRefresh((v) => v + 1), []);
  // 목록과 사용자 정보를 함께 가져오며, 화면을 떠난 뒤 도착한 응답은 무시한다.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      chatApi.list({ userId: user.id, role: user.role, search, filter, page }),
      chatApi.users(),
    ])
      .then(([list, people]) => {
        if (alive) {
          setResult(list);
          setUsers(people);
          setError("");
        }
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user.id, user.role, search, filter, page, refresh]);
  // 대화를 만든 뒤 필터를 초기화해야 새 대화가 목록에서 숨지 않는다.
  const created = (room) => {
    setModal(false);
    setSearch("");
    setFilter("all");
    setPage(1);
    reload();
    showToast("새 대화를 시작했어요.");
    navigate(`/dashboard/chats/${room.id}`);
  };
  return (
    <div className={`dashboard ${id ? "room-open" : ""}`}>
      <div className="dashboard-title">
        <div>
          <small>GOOD TO SEE YOU, {user.name}</small>
          <h2>
            대화를 시작해 볼까요<span>.</span>
          </h2>
          <p>
            {user.role !== "customer"
              ? "미음 동료와 고객의 모든 이야기를 한곳에서 확인하세요."
              : "미음 담당자와의 소중한 대화를 이곳에서 이어가세요."}
          </p>
        </div>
        <button className="btn pink" onClick={() => setModal(true)}>
          ＋ 새 대화
        </button>
      </div>
      <div className="chat-grid">
        {/* 아래 onSearch/onFilter/onPage/onNew/onRetry는 이 부모가 만든 함수를 자식에게 props로 전달한다. */}
        <ConversationList
          user={user}
          users={users}
          result={result}
          loading={loading}
          error={error}
          search={search}
          filter={filter}
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          onFilter={(v) => {
            setFilter(v);
            setPage(1);
          }}
          onPage={setPage}
          onNew={() => setModal(true)}
          onRetry={reload}
        />
        {/* id는 URL의 :id 자리에서 useParams()로 읽은 대화방 번호다. */}
        {id ? (
          <ChatRoom id={id} user={user} users={users} onUpdate={reload} />
        ) : (
          <div className="chat-empty">
            <div>◯</div>
            <small>YOUR SPACE TO CONNECT</small>
            <h3>대화를 선택해 주세요</h3>
            <p>
              왼쪽 목록에서 대화를 선택하거나
              <br />
              새로운 이야기를 시작해 보세요.
            </p>
            <button className="btn secondary" onClick={() => setModal(true)}>
              ＋ 새 대화 시작
            </button>
          </div>
        )}
      </div>
      {/* onCreated로 위의 created 함수를 넘기면 NewChatModal이 생성 성공 후 부모에게 결과를 알려 준다. */}
      {modal && (
        <NewChatModal
          user={user}
          users={users}
          onClose={() => setModal(false)}
          onCreated={created}
        />
      )}
    </div>
  );
}
