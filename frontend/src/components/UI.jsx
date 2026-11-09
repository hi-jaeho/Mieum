import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// [공용 UI 컴포넌트 모음]
// 이 파일의 Logo/Avatar/Field/Loader/Empty/Modal은 React나 브라우저의 기본 기능이 아니라 이 프로젝트에서 만든 컴포넌트다.
// 여러 페이지가 같은 모양과 동작을 복사하지 않고 가져다 쓰도록 한 '공용 부품 상자'라고 생각하면 된다.
// useEffect/useRef는 React, Link는 react-router-dom이 제공한다. 이 파일은 백엔드 API를 직접 호출하지 않는다.

export function Logo({ light = false }) {
  // 사용 위치: main/AppLayout/HomePage/AuthPages. light는 부모가 선택적으로 전달하는 props다.
  return (
    <Link
      to="/"
      className={`logo ${light ? "light" : ""}`}
      aria-label="Mieum 홈"
    >
      <span className="logo-mark">
        <i />
        <i />
        <i />
      </span>
      <strong>
        mieum<span>.</span>
      </strong>
    </Link>
  );
}

export function Avatar({ user, size = "md" }) {
  // user는 부모 컴포넌트가 전달한다. 이미지 URL이 아니라 이름 첫 글자와 더미 color 값으로 아바타를 그린다.
  return (
    <span
      className={`avatar ${user?.color || "pink"} ${size}`}
      aria-label={user?.name}
    >
      {user?.name?.slice(0, 1) || "?"}
    </span>
  );
}

export function Field({ id, label, error, hint, ...props }) {
  // 사용 위치: AuthPages/ProfilePage/AdminUsersPage.
  // ...props는 value/onChange/type 같은 나머지 속성을 한 꾸러미로 받아 실제 <input>에 전달하는 JavaScript 문법이다.
  // id를 label과 오류 문구에 함께 연결해 화면 읽기 도구도 입력칸을 이해하게 한다.
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <small className="field-error" id={`${id}-error`}>
          {error}
        </small>
      )}
      {!error && hint && <small>{hint}</small>}
    </div>
  );
}

export function Loader({ label = "불러오는 중..." }) {
  // 서버 또는 더미 API 응답을 기다리는 동안 부모가 조건부로 보여 주는 화면이다.
  return (
    <div className="state">
      <span className="spinner" />
      <h3>{label}</h3>
    </div>
  );
}

export function Empty({ title, text, action, onAction, error = false }) {
  // onAction은 부모가 만든 함수다. 예: DashboardPage의 reload 또는 AdminUsersPage의 setRefresh 호출.
  return (
    <div className={`state ${error ? "error" : ""}`}>
      <span className="state-icon">{error ? "!" : "⌁"}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action && (
        <button
          type="button"
          className="btn secondary small"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function Modal({ title, subtitle, onClose, children }) {
  // children은 <Modal>...</Modal> 사이에 부모가 넣은 JSX다.
  // onClose도 부모가 전달하며, NewChatModal과 CreateUserModal의 바깥 닫기 동작에 사용된다.
  const ref = useRef(null);

  // 모달이 열리면 첫 버튼으로 초점을 옮기고 Esc 키로 닫을 수 있게 한다.
  // 닫힌 뒤에는 원래 누르고 있던 요소로 초점을 되돌려 사용 흐름을 잃지 않게 한다.
  useEffect(() => {
    // document는 브라우저가 제공하며, activeElement에는 모달이 열리기 직전 선택된 요소가 들어 있다.
    const previous = document.activeElement;
    ref.current?.querySelector("button,input")?.focus();
    const key = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className="modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header>
          <div>
            <h2 id="modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
