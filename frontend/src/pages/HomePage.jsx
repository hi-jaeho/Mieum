import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/UI";

// [함수/컴포넌트 출처]
// Link는 react-router-dom의 페이지 이동 컴포넌트, Logo는 components/UI.jsx의 공용 컴포넌트다.
// useAuth는 context/AuthContext.jsx에서 현재 로그인 여부를 읽는다.
// [데이터 연결 현황]
// 이 랜딩 페이지의 대화 목록과 메시지는 아래 JSX 배열에 직접 적은 '디자인 미리보기'다.
// data/mockData.js나 백엔드 응답과 연결되지 않으며, 실제 메시지 수를 보여 주려면 별도 API 데이터가 필요하다.

export default function HomePage() {
  const { user } = useAuth();
  // 로그인 전에는 로그인 화면으로, 로그인 후에는 역할에 맞는 첫 화면으로 보낸다.
  const destination = user
    ? user.role === "admin"
      ? "/admin/users"
      : "/dashboard"
    : "/login";
  return (
    <div className="landing">
      <header className="landing-head wrap">
        <Logo />
        <nav>
          <a href="#features">서비스 소개</a>
          <Link to={destination}>로그인</Link>
          <Link to={destination} className="btn dark small">
            Mieum 접속 ↗
          </Link>
        </nav>
      </header>
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="tag">● MIEUM COMMUNICATION HUB</span>
            <h1>
              미음의 일을 잇는
              <br />
              <em>더 좋은 대화.</em>
            </h1>
            <p>
              미음 사원 간의 빠른 협업부터 고객과의 깊은 연결까지.
              <br />
              회사의 모든 업무 대화를 하나의 공간에서 이어가세요.
            </p>
            <div className="hero-actions">
              <Link className="btn pink large" to={destination}>
                Mieum 로그인 →
              </Link>
              <Link to="/login">체험 계정으로 둘러보기 ↗</Link>
            </div>
            <small className="hero-caption">
              — 미음과 고객 사이, 더 가까운 연결
            </small>
          </div>
          <div className="hero-visual">
            {/* 아래 mock-app은 실제 채팅 컴포넌트가 아니라 홍보용으로 모양만 그린 정적 샘플이다. */}
            <div className="mock-app">
              <aside>
                <b>
                  m<span>.</span>
                </b>
                <i>◯</i>
                <i>♙</i>
              </aside>
              <section className="mock-list">
                <small>MESSAGES</small>
                <h3>
                  메시지 <em>12</em>
                </h3>
                <div className="mock-search">⌕ 대화 검색</div>
                {/* map은 JavaScript 배열의 정해진 함수로, 항목 3개를 비슷한 JSX 3개로 바꾼다. */}
                {[
                  "웹사이트 리뉴얼 프로젝트",
                  "온리브 · 브랜드 문의",
                  "프로덕트 스탠드업",
                ].map((item, index) => (
                  <div
                    className={`mock-row ${index === 0 ? "active" : ""}`}
                    key={item}
                  >
                    <span>{["김", "정", "박"][index]}</span>
                    <div>
                      <strong>{item}</strong>
                      <small>
                        {
                          [
                            "시안 최종본 확인했습니다.",
                            "자료 확인 후 연락드릴게요.",
                            "오늘 오후 3시에 모일까요?",
                          ][index]
                        }
                      </small>
                    </div>
                  </div>
                ))}
              </section>
              <section className="mock-chat">
                <header>
                  <span>김</span>
                  <div>
                    <strong>웹사이트 리뉴얼 프로젝트</strong>
                    <small>팀 대화 · 멤버 3명</small>
                  </div>
                </header>
                <div className="mock-messages">
                  <small>오늘</small>
                  <p>
                    첫 화면 시안을 공유합니다.
                    <br />
                    전체 흐름을 중심으로 봐주세요!
                  </p>
                  <p className="mine">
                    여백이 넉넉해서
                    <br />
                    중요한 내용이 잘 보이네요 ✨
                  </p>
                  <p>피드백 반영해볼게요!</p>
                </div>
                <footer>
                  메시지를 입력하세요 <b>→</b>
                </footer>
              </section>
            </div>
            <div className="floating-card">
              <b>✓</b>
              <span>
                <strong>대화가 하나로 연결됐어요</strong>
                <small>팀과 고객, 모두 Mieum에서</small>
              </span>
            </div>
          </div>
        </section>
        <section className="features" id="features">
          <div className="wrap">
            <div className="section-title">
              <div>
                <span>WHY MIEUM</span>
                <h2>
                  대화가 편해지면,
                  <br />
                  일도 더 좋아집니다.
                </h2>
              </div>
              <p>
                복잡한 업무 도구 사이에서 놓치기 쉬운 대화.
                <br />
                Mieum은 꼭 필요한 소통에 집중합니다.
              </p>
            </div>
            <div className="feature-grid">
              {[
                [
                  "01",
                  "♙",
                  "팀 안의 대화",
                  "프로젝트와 동료의 이야기를 한곳에서. 업무 흐름을 끊지 않고 자연스럽게 이어갑니다.",
                ],
                [
                  "02",
                  "◯",
                  "고객과의 연결",
                  "문의부터 상담까지 한 공간에서. 중요한 고객의 목소리를 놓치지 않습니다.",
                ],
                [
                  "03",
                  "✦",
                  "단순하고 선명하게",
                  "필요한 대화를 빠르게 찾고, 해야 할 일에 집중할 수 있도록 정리했습니다.",
                ],
              ].map(([number, icon, title, text]) => (
                <article key={number}>
                  <em>{number}</em>
                  <i>{icon}</i>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="landing-cta wrap">
          <div>
            <span>CONNECT WITH MIEUM</span>
            <h2>
              미음의 좋은 일은
              <br />
              좋은 대화에서 시작됩니다.
            </h2>
          </div>
          <Link className="btn light large" to={destination}>
            Mieum 접속 →
          </Link>
        </section>
      </main>
      <footer className="landing-foot wrap">
        <Logo />
        <small>© 2026 Mieum. Every conversation matters.</small>
      </footer>
    </div>
  );
}
