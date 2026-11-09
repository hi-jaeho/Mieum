import { useEffect, useState } from "react";
import { Avatar, Empty, Field, Loader, Modal } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { adminApi } from "../services/mockApi";
import { emailRegex } from "../utils/helpers";
import { departmentApi } from "../services/departmentApi";
import { jobPositionApi } from "../services/jobPositionApi";
import { employeeApi } from "../services/employeeApi";

// [함수/컴포넌트 출처]
// useState/useEffect는 React가 제공한다. Avatar/Empty/Field/Loader/Modal은 components/UI.jsx에서 만든 공용 컴포넌트다.
// useAuth/useToast는 context 폴더, emailRegex는 utils/helpers.js에서 만든 프로젝트 기능이다.
//
// [백엔드 연결 현황 - 이 화면에서 가장 중요한 부분]
// 1) 부서/직책 선택지: departmentApi/jobPositionApi → 실제 Spring EmployeeController → DB
// 2) 사원 생성: employeeApi → 실제 Spring AuthController.register() → DB
// 3) 사용자 목록: adminApi → 아직 mockApi.js의 localStorage 더미 데이터
// 즉, 새 사원이 DB에 등록되어도 아래 목록에는 자동으로 나타나지 않는다. 목록 조회 API를 연결해야 두 바구니가 하나가 된다.

// 입력 폼을 처음 열었을 때 사용할 프로젝트 상수다. useState가 이 값을 복사해 상태로 관리한다.
const initialForm = {
  role: "employee",
  name: "",
  email: "",
  company: "",
  department: "",
  title: "",
  password: "",
};

// 사용자 생성에 필요한 입력과 검증을 목록 화면에서 분리한 모달이다.
function CreateUserModal({ admin, onClose, onCreated }) {
  // onClose와 onCreated는 부모 AdminUsersPage가 props로 전달한 함수다.
  // admin도 부모가 전달하지만 현재 이 컴포넌트 안에서는 사용하지 않는다.
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);

  const update = (key, value) => {
    // update는 이 컴포넌트에서 만든 입력 공용 함수다. 예: update("name", "홍길동").
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setFormError("");
  };

  useEffect(() => {
    // useEffect는 React 함수다. 빈 배열 []이므로 모달이 처음 화면에 붙을 때 한 번만 실행된다.
    const loadOptions = async () => {
      try {
        // 두 함수는 각각 services/departmentApi.js와 services/jobPositionApi.js에 정의되어 있다.
        const departmentData = await departmentApi.getDepartments();
        const positionData = await jobPositionApi.getJobPositions();

        setDepartments(departmentData);
        setJobPositions(positionData);
      } catch (error) {
        setFormError(error.message);
      }
    };

    loadOptions();
  }, []);

  const submit = async (event) => {
  // submit은 아래 <form onSubmit={submit}>이 호출하는 프로젝트 함수다.
  // preventDefault는 브라우저의 기본 폼 제출(페이지 새로고침)을 막는 정해진 함수다.
  event.preventDefault();

  const next = {};

  // 입력값 검증
  if (!values.name.trim()) {
    next.name = "이름을 입력해 주세요.";
  }

  if (!emailRegex.test(values.email)) {
    next.email = "올바른 이메일을 입력해 주세요.";
  }

  if (values.role === "employee" && !values.departmentId) {
    next.departmentId = "부서를 선택해 주세요.";
  }

  if (values.role === "employee" && !values.positionId) {
    next.positionId = "직책을 선택해 주세요.";
  }

  // 비밀번호 정규표현식
  // if (
  //   values.password.length < 8 ||
  //   !/[A-Za-z]/.test(values.password) ||
  //   !/[0-9]/.test(values.password)
  // ) {
  //   next.password = "8자 이상, 영문과 숫자를 포함해 주세요.";
  // }

  setErrors(next);

  if (Object.keys(next).length) {
    return;
  }

  setBusy(true);

  try {
    // createEmployee는 services/employeeApi.js에 정의되어 있고 실제 백엔드의 사원 등록 API를 호출한다.
    // 현재 고객용 백엔드 API는 없으므로 customer 선택 상태도 이 함수로 보내지는 점을 추후 분리해야 한다.
    const created = await employeeApi.createEmployee(values);
    // onCreated는 아래 부모 컴포넌트의 created 함수다. 등록 성공 결과를 자식에서 부모로 올려 보낸다.
    onCreated(created);
  } catch (error) {
    setFormError(error.message);
  } finally {
    setBusy(false);
  }
};

  return (
    <Modal
      title="사용자 계정 생성"
      subtitle="미음 사원 또는 고객의 로그인 계정을 발급합니다."
      onClose={onClose}
    >
      <form className="admin-user-form" onSubmit={submit} noValidate>
        <fieldset className="role">
          <legend>사용자 유형</legend>
          <button
            type="button"
            className={values.role === "employee" ? "active" : ""}
            onClick={() => update("role", "employee")}
          >
            ▣{" "}
            <span>
              <b>미음 사원</b>
              <small>내부 구성원 계정</small>
            </span>
          </button>
          <button
            type="button"
            className={values.role === "customer" ? "active" : ""}
            onClick={() => update("role", "customer")}
          >
            ♙{" "}
            <span>
              <b>고객</b>
              <small>외부 고객 계정</small>
            </span>
          </button>
        </fieldset>
        <div className="field-grid">
          <Field
            id="member-name"
            label="이름"
            placeholder="이름을 입력하세요"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            error={errors.name}
          />
        </div>
        {values.role === "employee" ? (
          <div className="field-grid">
            <div className="select-field">
              <label htmlFor="member-department">부서</label>
              <select
                id="member-department"
                value={values.departmentId}
                onChange={(event) => update("departmentId", event.target.value)}
              >
                <option value="">부서를 선택하세요</option>

                {departments.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="select-field">
              <label htmlFor="member-position">직책</label>
              <select
                id="member-position"
                value={values.positionId}
                onChange={(event) => update("positionId", event.target.value)}
              >
                <option value="">직책을 선택하세요</option>

                {jobPositions.map((position) => (
                  <option key={position.positionId} value={position.positionId}>
                    {position.positionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <Field
            id="member-company"
            label="고객사"
            placeholder="회사명을 입력하세요"
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
            error={errors.company}
          />
        )}
        <Field
          id="member-email"
          label="로그인 이메일"
          type="email"
          placeholder={
            values.role === "employee" ? "name@mieum.com" : "name@company.com"
          }
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
        />
        {formError && <div className="form-error">! {formError}</div>}
        <div className="admin-form-notice">
          <b>계정 발급 안내</b>
          <p>
            생성된 사용자는 이 이메일과 임시 비밀번호로 Mieum에 로그인할 수
            있습니다.
          </p>
        </div>
        <footer>
          <button type="button" className="btn secondary" onClick={onClose}>
            취소
          </button>
          <button className="btn pink" disabled={busy} type="submit">
            {busy ? "생성하는 중..." : "계정 생성 →"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 검색어나 필터, 페이지가 바뀔 때마다 조건에 맞는 사용자 목록을 다시 읽는다.
    // adminApi.listUsers는 services/mockApi.js에 있으므로 이 목록은 아직 백엔드 DB가 아닌 더미 데이터다.
    let active = true;
    setLoading(true);
    adminApi
      .listUsers({ requester: user, search, filter, page })
      .then((data) => {
        if (active) {
          setResult(data);
          setPage(data.page);
          setError("");
        }
      })
      .catch((cause) => {
        if (active) setError(cause.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    // 요청 도중 다른 화면으로 이동하면 늦은 응답이 상태를 바꾸지 못하게 한다.
    return () => {
      active = false;
    };
  }, [user, search, filter, page, refresh]);

  // 새 계정이 어떤 필터에도 가려지지 않도록 목록 조건을 초기화한다.
  const created = (member) => {
    // 이 함수는 CreateUserModal에 onCreated라는 이름으로 전달된다.
    setModalOpen(false);
    setSearch("");
    setFilter("all");
    setPage(1);
    setRefresh((value) => value + 1);
    showToast(`${member.name}님의 계정을 생성했어요.`);
  };
  // 요약 카드의 수는 전체가 아니라 현재 페이지에 보이는 사용자 수다.
  const employees =
    result?.items.filter((member) => member.role === "employee").length ?? 0;
  const customers =
    result?.items.filter((member) => member.role === "customer").length ?? 0;

  return (
    <div className="admin-users">
      <div className="admin-heading">
        <div>
          <small>ADMIN / USER MANAGEMENT</small>
          <h2>
            사용자 관리<span>.</span>
          </h2>
          <p>미음 사원과 고객의 계정을 생성하고 확인하세요.</p>
        </div>
        <button className="btn pink" onClick={() => setModalOpen(true)}>
          ＋ 사용자 추가
        </button>
      </div>
      <div className="admin-summary">
        <article>
          <span>등록된 사용자</span>
          <strong>{result?.total ?? "–"}</strong>
          <small>관리자 계정 제외</small>
        </article>
        <article>
          <span>현재 목록의 사원</span>
          <strong>{loading ? "–" : employees}</strong>
          <small>Mieum 내부 구성원</small>
        </article>
        <article>
          <span>현재 목록의 고객</span>
          <strong>{loading ? "–" : customers}</strong>
          <small>외부 고객 계정</small>
        </article>
      </div>
      <section className="member-panel">
        <header>
          <div>
            <h3>계정 목록</h3>
            <p>관리자가 발급한 계정만 표시됩니다.</p>
          </div>
          <div className="member-tools">
            <label className="search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="이름, 이메일, 회사 검색"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <div className="filters">
              {[
                ["all", "전체"],
                ["employee", "사원"],
                ["customer", "고객"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={filter === value ? "active" : ""}
                  onClick={() => {
                    setFilter(value);
                    setPage(1);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="member-table-wrap">
          {loading ? (
            <Loader label="사용자 목록을 불러오는 중이에요" />
          ) : error ? (
            <Empty
              error
              title="사용자 목록을 불러오지 못했어요"
              text={error}
              action="다시 시도"
              onAction={() => setRefresh((value) => value + 1)}
            />
          ) : result?.items.length ? (
            <table className="member-table">
              <thead>
                <tr>
                  <th>사용자</th>
                  <th>유형</th>
                  <th>소속</th>
                  <th>직함</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-identity">
                        <Avatar user={member} size="sm" />
                        <span>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${member.role}`}>
                        {member.role === "employee" ? "미음 사원" : "고객"}
                      </span>
                    </td>
                    <td>
                      {member.role === "employee"
                        ? member.department
                        : member.company}
                    </td>
                    <td>{member.title}</td>
                    <td>
                      <span className="active-status">
                        <i />
                        사용 중
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty
              title={search ? "검색 결과가 없어요" : "등록된 사용자가 없어요"}
              text={
                search
                  ? "다른 검색어를 입력해 보세요."
                  : "사용자 추가 버튼으로 첫 계정을 발급해 보세요."
              }
              action={!search ? "사용자 추가" : null}
              onAction={() => setModalOpen(true)}
            />
          )}
        </div>
        {!loading && result?.pages > 1 && (
          <footer className="member-pagination">
            <span>총 {result.total}명</span>
            <div>
              <button
                disabled={result.page === 1}
                onClick={() => setPage(result.page - 1)}
              >
                ‹
              </button>
              <b>
                {result.page} / {result.pages}
              </b>
              <button
                disabled={result.page === result.pages}
                onClick={() => setPage(result.page + 1)}
              >
                ›
              </button>
            </div>
          </footer>
        )}
      </section>
      {/* Modal의 닫기/완료 동작을 부모가 함수로 만들어 props로 내려 준다. */}
      {modalOpen && (
        <CreateUserModal
          admin={user}
          onClose={() => setModalOpen(false)}
          onCreated={created}
        />
      )}
    </div>
  );
}
