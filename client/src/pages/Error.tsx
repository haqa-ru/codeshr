import { useParams, useSearchParams } from "react-router-dom";

function App() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  return (
    <p>
      {params.id} {searchParams.get("secret")}
    </p>
  );
}

export default App;
