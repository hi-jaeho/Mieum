// [실제 백엔드 연결]
// fetch와 response.json()은 브라우저가 제공하는 함수다.
// GET /api/employee/departments는 백엔드 EmployeeController.getDepartments()와 연결된다.
// 응답 한 건의 모양은 Department 엔티티의 { departmentId, departmentName }이다.
// 이 주소는 개발용 하드코딩이므로 배포할 때는 환경 변수(VITE_API_BASE_URL 등)로 분리하는 것이 좋다.
const BASE_URL = "http://localhost:8080/api/employee";

export const departmentApi = {

  async getDepartments() {
    // getDepartments는 이 파일에서 만든 함수이며 pages/AdminUsersPage.jsx의 CreateUserModal이 호출한다.
    const response = await fetch(`${BASE_URL}/departments`);

    if (!response.ok) {
      throw new Error("부서 목록을 불러오지 못했습니다.");
    }

    return response.json();
  },

};
