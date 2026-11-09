// [실제 백엔드 연결]
// POST /api/auth/employee/register는 백엔드 AuthController.register()와 연결된다.
// 요청 본문은 SignupRequest의 name, email, departmentId, positionId와 맞춘다.
// 성공 응답은 SignupResponse의 { employeeCode, name, email }이다.
// fetch/JSON.stringify/response.json은 브라우저가 제공하고, createEmployee는 이 파일에서 만든 함수다.
export const employeeApi = {
  async createEmployee(values) {
    // pages/AdminUsersPage.jsx의 CreateUserModal.submit()이 호출한다.
    // 현재 백엔드는 '사원 등록'만 받으므로 role이 customer인 값을 이 주소로 보내면 별도 고객 API 없이는 처리할 수 없다.
    const response = await fetch("http://localhost:8080/api/auth/employee/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        // select의 값은 문자열이므로 백엔드의 int 필드에 맞게 Number로 바꾼다.
        name: values.name,
        email: values.email,
        departmentId: Number(values.departmentId),
        positionId: Number(values.positionId),
      }),
    });

    if (!response.ok) {
      throw new Error("직원 등록에 실패했습니다.");
    }

    return response.json();
  },
};
