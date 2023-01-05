import { useParams, useSearchParams } from "react-router-dom";

import styles from "../styles/App.module.scss";

import Pad from "../components/Pad";
import Footer from "../components/Footer";
import { StorageProvider } from "../contexts/StorageContext";

function App() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  return (
    <div className={styles.App}>
      <StorageProvider
        id={params.id}
        secret={searchParams.get("secret") || undefined}
      >
        <Pad />
        <Footer />
      </StorageProvider>
    </div>
  );
}

export default App;
