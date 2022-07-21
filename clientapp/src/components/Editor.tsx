import styles from "./Editor.module.scss";
import Editor from "@monaco-editor/react";
import { useContext } from "react";
import SharedContext from "../contexts/SharedContext";
import LocalContext from "../contexts/LocalContext";

function CshEditor() {
  const { updateShared, shared } = useContext(SharedContext);
  const { local } = useContext(LocalContext);

  return (
    <div className={styles.Editor}>
      <Editor
        height="calc(100vh - 35px)"
        defaultLanguage="plaintext"
        onChange={(value, e) => {
          updateShared({ code: value });
        }}
        theme={local.theme === "DARK" ? "vs-dark" : "light"}
        language={shared.language}
        value={shared.code}
      ></Editor>
    </div>
  );
}

export default CshEditor;
