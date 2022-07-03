import "./Monaco.css";
import Editor from "@monaco-editor/react";
import { useContext } from "react";
import ConfigContext from "../contexts/ConfigContext";

function Monaco() {
    const { updateShared, shared, local } = useContext(ConfigContext);

    return (
        <div className="Monaco">
            <Editor
                height="calc(100vh - 35px)"
                defaultLanguage="plaintext"
                onChange={(value, e) => {
                    updateShared({ code: value });
                }}
                theme={local.theme}
                language={shared.lang}
                value={shared.code}
            ></Editor>
        </div>
    );
}

export default Monaco;
