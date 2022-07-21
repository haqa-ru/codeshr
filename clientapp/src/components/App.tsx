import React, { useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SharedProvider } from "../contexts/SharedContext";
import Editor from "./Editor";
import Footer from "./Footer";
import styles from "./App.module.scss";
import LocalContext from "../contexts/LocalContext";

function App() {
  const { local } = useContext(LocalContext);

  const params = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.body.classList.toggle(styles.Dark, local.theme === "DARK");
  }, [local.theme]);

  return (
    <SharedProvider
      id={params.id}
      secret={searchParams.get("secret") || undefined}
    >
      <Editor />
      <Footer />
    </SharedProvider>
  );
}

export default App;
