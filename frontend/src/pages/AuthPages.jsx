import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Field, Logo } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { emailRegex } from "../utils/helpers";

// [함수 출처]
// useState는 React, Link/Navigate/useNavigate는 react-router-dom이 정해 둔 기능이다.
// Field/Logo는 components/UI.jsx, useAuth는 context/AuthContext.jsx, emailRegex는 utils/helpers.js에서 만들었다.
// [백엔드 연결 현황]
// 현재 login()은 실제 서버가 아니라 AuthContext를 거쳐 mockApi.js의 더미 사용자와 비교한다.
// 아래 체험 계정도 data/mockData.js에 정의되어 있고 비밀번호는 모두 Password1!이다.

function AuthAside() {
  return (
    <aside className="auth-aside">
      <Link to="/">← 홈으로</Link>
      <div>
        <small>MIEUM COMMUNICATION HUB</small>
        <h2>
          미음의 모든 연결은
          <br />
          <em>대화에서 시작돼요.</em>
        </h2>
        <p>
          미음 구성원의 빠른 협업과
          <br />
          고객과의 깊은 소통을 한곳에서 이어갑니다.
        </p>
        <div className="auth-art">
          <i />
          <i />
          <i />
          <span>✦ &nbsp; 오늘도 좋은 대화를 나눠요</span>
        </div>
      </div>
      <small>© 2026 Mieum. Every conversation matters.</small>
    </aside>
  );
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  if (user)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/users" : "/dashboard"}
        replace
      />
    );

  const update = (key, value) => {
    // update는 LoginPage 안에서 만든 함수다. 여러 입력칸이 같은 변경 규칙을 함께 사용한다.
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setFormError("");
  };

  const submit = async (event) => {
    // submit은 form의 onSubmit이 호출한다. preventDefault는 브라우저의 기본 새로고침 제출을 막는 정해진 함수다.
    event.preventDefault();
    const next = {};
    if (!values.email) next.email = "사번을 입력해 주세요.";
    else if (!emailRegex.test(values.email))
      next.email = "올바른 이메일 형식이 아닙니다.";
    if (!values.password) next.password = "비밀번호를 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      // login은 context/AuthContext.jsx에서 정의했다. 현재는 mockApi, 추후에는 실제 로그인 API를 호출할 자리다.
      const signedInUser = await login(values);
      navigate(signedInUser.role === "admin" ? "/admin/users" : "/dashboard");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (email) => {
    // 이 함수는 아래 세 개의 '화면 체험하기' 버튼만 사용하며 서버에는 요청하지 않는다.
    setValues({ email, password: "Password1!" });
    setErrors({});
    setFormError("");
  };

  return (
    <div className="auth-page">
      <AuthAside />
      <main className="auth-main">
        <header>
          <Logo />
          <span className="issued-account">
            계정은 미음 관리자가 발급합니다
          </span>
        </header>
        <section className="auth-card">
          <small>WELCOME TO MIEUM</small>
          <h1>
            업무 대화를 이어가세요<span>.</span>
          </h1>
          <p>관리자에게 발급받은 계정으로 로그인해 주세요.</p>
          <form onSubmit={submit} noValidate>
            <Field
              id="email"
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="name@mieum.com"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              error={errors.email}
            />
            <Field
              id="password"
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              error={errors.password}
            />
            {formError && <div className="form-error">! {formError}</div>}
            <button className="btn pink full" disabled={busy}>
              {busy ? "로그인 중..." : "로그인 →"}
            </button>
          </form>
          <div className="account-notice">
            <b>관리자 발급 계정</b>
            <p>
              보안을 위해 공개 회원가입을 제공하지 않습니다. 계정이 필요하거나
              로그인에 문제가 있다면 미음 관리자에게 문의해 주세요.
            </p>
          </div>
          <div className="demo">
            <div>
              <b>✦ 화면 체험하기</b>
              <small>DEMO ACCOUNT</small>
            </div>
            <p>역할별 화면을 확인할 수 있는 샘플 계정입니다.</p>
            <div className="demo-three">
              <button type="button" onClick={() => fillDemo("admin@mieum.com")}>
                관리자 ↗
              </button>
              <button
                type="button"
                onClick={() => fillDemo("employee@mieum.com")}
              >
                사원 ↗
              </button>
              <button
                type="button"
                onClick={() => fillDemo("customer@example.com")}
              >
                고객 ↗
              </button>
            </div>
          </div>
        </section>
        <small className="auth-bottom">
          미음 구성원과 고객을 잇는 업무 공간
        </small>
      </main>
    </div>
  );
}
