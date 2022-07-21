import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SharedProvider } from "../contexts/SharedContext";
import Editor from "./Editor";
import Footer from "./Footer";
import styles from "./Error.module.scss";

function Error() {
  const params = useParams();
  const [searchParams] = useSearchParams();

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

export default Error;
