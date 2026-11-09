// [실제 백엔드와 연결하려고 만든 서비스 - 현재 화면에서는 사용하지 않음]
// LoginPage는 이 파일이 아니라 context/AuthContext.jsx → services/mockApi.js의 authApi.login을 호출한다.
// 또한 백엔드 AuthController.login()은 POST /api/auth/login과
// { employeeCode, password } 본문을 요구하고 JWT 문자열을 반환하므로, 아래 GET 구현은 아직 계약이 맞지 않는다.
// 실제 로그인으로 전환할 때 method, headers, body, 토큰 저장 방식을 함께 구현해야 한다.

export const loginApi = {
    async login(){
        // fetch와 response.json은 브라우저 함수이며 login은 이 객체에 직접 정의한 프로젝트 함수다.
        const reponse = await fetch("http://localhost:8080/api/auth/login")

        if (!reponse.ok) {
            throw new Error("로그인에 실패하였습니다.")
        }

        return reponse.json();
    }
}
