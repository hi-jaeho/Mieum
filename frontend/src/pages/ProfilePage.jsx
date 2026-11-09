import { useState } from "react";
import { Avatar, Field } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

// [함수/컴포넌트 출처]
// useState는 React, Avatar/Field는 components/UI.jsx에서 제공한다.
// updateProfile은 context/AuthContext.jsx, showToast는 context/ToastContext.jsx에서 정의해 내려 준 함수다.
// [백엔드 연결 현황]
// 프로필 조회 전용 API는 아직 없고 user는 mockApi의 세션 사용자다. 저장도 localStorage만 바꾸며 DB에는 반영되지 않는다.

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  // 취소 버튼을 누르면 돌아갈 수 있도록 로그인 당시 값을 기준점으로 보관한다.
  const initial = {
    name: user.name,
    company: user.company,
    department: user.department || "",
    title: user.title,
  };
  // 관리자와 사원은 부서가 필요하지만 외부 고객은 회사 정보만 사용한다.
  const isStaff = user.role === "employee" || user.role === "admin";
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const update = (key, value) => {
    // 이 update는 ProfilePage 안에서 만든 입력 공용 함수다. React가 제공하는 함수가 아니다.
    setValues({ ...values, [key]: value });
    setErrors({ ...errors, [key]: "" });
  };
  // 필요한 칸을 모두 검사한 후 문제가 없을 때만 프로필을 저장한다.
  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    ["name", "company", "title"].forEach((key) => {
      if (!values[key].trim()) next[key] = "필수 입력 항목입니다.";
    });
    if (isStaff && !values.department.trim())
      next.department = "부서를 입력해 주세요.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      // updateProfile의 실제 정의 위치는 context/AuthContext.jsx이다.
      await updateProfile(values);
      showToast("프로필을 저장했어요.");
    } catch {
      showToast("저장하지 못했습니다.", "error");
    } finally {
      setBusy(false);
    }
  };
  const roleLabel =
    user.role === "admin"
      ? "관리자"
      : user.role === "employee"
        ? "미음 사원"
        : "고객";
  return (
    <div className="profile">
      <div className="profile-title">
        <small>YOUR PROFILE</small>
        <h2>
          나의 공간<span>.</span>
        </h2>
        <p>내 정보를 확인하고, 언제든 편하게 수정하세요.</p>
      </div>
      <div className="profile-grid">
        <section className="identity-card">
          <div className="identity-cover">
            <i />
          </div>
          <Avatar user={user} size="xl" />
          <div className="identity-title">
            <h3>{user.name}</h3>
            <b>{roleLabel}</b>
            <p>
              {user.title} · {user.company}
            </p>
          </div>
          <div className="identity-meta">
            <p>✉ {user.email}</p>
            <p>▣ {isStaff ? user.department : user.company}</p>
          </div>
          <footer>♢ Mieum에서 안전하게 대화를 이어가세요.</footer>
        </section>
        <section className="profile-form">
          <header>
            <div>
              <small>ACCOUNT DETAILS</small>
              <h3>기본 정보</h3>
              <p>다른 사람에게 보이는 정보를 관리하세요.</p>
            </div>
            <b>⌁</b>
          </header>
          <form onSubmit={submit}>
            <div className="field-grid">
              <Field
                id="profile-name"
                label="이름"
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />
              <Field
                id="profile-company"
                label="회사명"
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                error={errors.company}
              />
            </div>
            <div className="field-grid">
              {isStaff && (
                <Field
                  id="profile-department"
                  label="부서"
                  value={values.department}
                  onChange={(e) => update("department", e.target.value)}
                  error={errors.department}
                />
              )}
              <Field
                id="profile-title"
                label="직함"
                value={values.title}
                onChange={(e) => update("title", e.target.value)}
                error={errors.title}
              />
            </div>
            <Field
              id="profile-email"
              label="이메일"
              value={user.email}
              disabled
              hint="이메일은 현재 변경할 수 없습니다."
            />
            <footer>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setValues(initial);
                  setErrors({});
                }}
              >
                취소
              </button>
              <button className="btn pink" disabled={busy}>
                {busy ? "저장하는 중..." : "변경사항 저장 →"}
              </button>
            </footer>
          </form>
        </section>
      </div>
    </div>
  );
}
