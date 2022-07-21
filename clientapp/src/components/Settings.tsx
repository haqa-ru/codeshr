import React, { useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SharedProvider } from "../contexts/SharedContext";
import Editor from "./Editor";
import Footer from "./Footer";
import stylesDark from "./SettingsDark.module.scss";
import stylesLight from "./SettingsLight.module.scss";
import haqa from "./haqa.png";
import LocalContext from "../contexts/LocalContext";

function Settings() {
    const { local } = useContext(LocalContext);

    const styles = local.theme === "DARK" ? stylesDark : stylesLight;

    return (
        <div className={styles.Settings}>
            <img src={haqa} alt="Haqa logo." />
            <span>
                <b>haqa's technology</b>
            </span>
        </div>
    );
}

export default Settings;
