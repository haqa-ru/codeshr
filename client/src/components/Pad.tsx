import Editor from "@monaco-editor/react";
import { useContext } from "react";

import StorageContext from "../contexts/StorageContext";

import styles from "../styles/Pad.module.scss";

function Pad() {
  const { updateShared, shared } = useContext(StorageContext);

  return (
    <div className={styles.Editor}>
      <Editor
        height="calc(100vh - 2rem)"
        defaultLanguage="plaintext"
        onChange={(value, e) => {
          updateShared({ code: value });
        }}
        theme="vs-dark"
        language={shared.language}
        value={shared.code}
      ></Editor>
    </div>
  );
}

export default Pad;
