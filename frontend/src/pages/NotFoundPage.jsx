import { Link } from "react-router-dom";
import { Logo } from "../components/UI";

// Link는 react-router-dom이 제공하고 Logo는 components/UI.jsx에서 만든 컴포넌트다.
// 이 페이지는 App.jsx의 path="*"와 연결되어, 정해진 어떤 주소에도 맞지 않을 때 보인다. 백엔드 데이터는 사용하지 않는다.
// 등록되지 않은 주소로 들어왔을 때 사용자가 길을 잃지 않도록 홈 링크를 제공한다.
export default function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo />
      <strong>
        404<span>.</span>
      </strong>
      <h1>찾으시는 페이지가 없어요.</h1>
      <p>주소를 다시 확인하거나 홈으로 돌아가 주세요.</p>
      <Link className="btn pink" to="/">
        홈으로 돌아가기 →
      </Link>
    </main>
  );
}
