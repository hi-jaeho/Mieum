# Mieum Frontend

Mieum 사원 간 협업과 Mieum 사원·고객 간 소통을 위한 React 프론트엔드입니다. 공개 회원가입은 제공하지 않으며 관리자가 사원 및 고객 계정을 발급합니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드는 `npm run build`로 확인할 수 있습니다.

## 체험 계정

- 관리자: `admin@mieum.com` / `Password1!`
- 사원: `employee@mieum.com` / `Password1!`
- 고객: `customer@example.com` / `Password1!`

로그인 화면에서 체험 계정 버튼을 누르면 입력값이 자동으로 채워집니다.

## URL

- `/` 메인
- `/login` 로그인
- `/dashboard` 대화 목록
- `/dashboard/chats/:id` 채팅방
- `/profile` 마이페이지
- `/admin/users` 관리자 전용 사용자 관리 및 계정 발급

## 구조

```text
src/
  components/  공통 UI, 레이아웃, 채팅 컴포넌트
  context/     로그인 및 토스트 상태
  data/        mock 데이터
  pages/       각 URL의 페이지
  services/    mock API 및 관리자 권한 검사 계층
  styles/      공통·페이지 스타일
  utils/       검증과 날짜 표시 도구
```

컴포넌트는 `services/mockApi.js`를 통해서만 데이터를 읽습니다. 관리자 계정 생성도 이 서비스에서 권한을 검사합니다. 나중에 Spring Boot REST API를 연결할 때 이 파일의 함수 내부를 실제 요청으로 교체하면 됩니다.
