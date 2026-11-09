// [실제 백엔드 연결]
// GET /api/employee/jobpositions는 백엔드 EmployeeController.getJobPositions()와 연결된다.
// 응답 한 건의 모양은 JobPosition 엔티티의 { positionId, positionName }이다.
// fetch/response.json은 브라우저 함수이고, getJobPositions는 이 파일에서 만든 함수다.
// pages/AdminUsersPage.jsx의 CreateUserModal이 이 함수를 호출한다.
const BASE_URL = "http://localhost:8080/api/employee";

export const jobPositionApi = {

  async getJobPositions() {
    const response = await fetch(`${BASE_URL}/jobpositions`);

    if (!response.ok) {
      throw new Error("직책 목록을 불러오지 못했습니다.");
    }

    return response.json();
  }
};
