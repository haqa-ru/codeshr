import { ChangeEvent, useContext, useEffect, useState } from "react";
import ConfigContext from "../contexts/SharedContext";
import styles from "./Footer.module.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import LocalContext from "../contexts/LocalContext";
import { useNavigate } from "react-router-dom";
import Compiler from "./Compiler";

function Footer() {
    const { shared, updateShared, status } = useContext(ConfigContext);
    const { local, updateLocal } = useContext(LocalContext);

    const [showCompiler, setShowCompiler] = useState(false);

    const navigate = useNavigate();

    const [langs, setLangs] = useState<{ name: string; value: string }[]>([
        {
            name: "Plain Text",
            value: "plaintext",
        },
    ]);

    useEffect(() => {
        const fetchLangs = async () => {
            const res = await fetch("/languages.json");

            if (res.ok) {
                setLangs(await res.json());
            }
        };

        fetchLangs();
    }, []);

    useEffect(() => {
        window.history.replaceState(
            null,
            "codeshr",
            `${shared.id ? shared.id : ""}${
                shared.secret && local.exposed
                    ? "?" +
                      new URLSearchParams({ secret: shared.secret }).toString()
                    : ""
            }`
        );
    }, [local.exposed, shared.secret, shared.id]);

    const handleLangSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        updateShared({ language: e.target.value });
    };

    const handleThemeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        updateLocal({ theme: e.target.checked ? "DARK" : "LIGHT" });
    };

    const handleCodeCopy = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.preventDefault();

        navigator.clipboard.writeText(shared.code);
    };

    const handleLinkCopy = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.preventDefault();

        navigator.clipboard.writeText(window.location.href);
    };

    const handleSecureToggle = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.preventDefault();

        if (shared.secret) {
            updateShared({ secure: !shared.secure });
        }
    };

    const handleNewTab = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();

        window.open(window.location.origin, "_blank")?.focus();
    };

    const handleInfo = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        navigate("/settings");
    };

    const handleExpose = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        updateLocal({
            exposed:
                !local.exposed && shared.id !== null && shared.secret !== null,
        });
    };

    const handleFork = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        updateShared({
            id: null,
        });
    };

    const handleCompilerShow = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        setShowCompiler(true);
    };

    return (
        <>
            <div className={styles.Footer}>
                <div className={styles.Meta}>
                    <div className={styles.Id} onClick={handleSecureToggle}>
                        <div className={styles.Status}>
                            <div className={styles[status]}>
                                {status === "BAD" ? (
                                    <i className="bi bi-cloud-slash"></i>
                                ) : status === "WAIT" ? (
                                    <i className="bi bi-cloud-arrow-up"></i>
                                ) : status === "INIT" ? (
                                    <i className="bi bi-cloud"></i>
                                ) : status === "DENY" ? (
                                    <i className="bi bi-cloud-minus"></i>
                                ) : (
                                    <i className="bi bi-cloud-check"></i>
                                )}
                            </div>
                        </div>
                        {local.exposed ? (
                            <b>{shared.id}</b>
                        ) : (
                            <i>{shared.id}</i>
                        )}
                    </div>
                    <div className={styles.Tools}>
                        <span
                            className={styles.New}
                            title="Open new codeshr tab."
                            onClick={handleNewTab}
                        >
                            <i className="bi bi-plus"></i>
                        </span>
                        {shared.id && shared.code !== "" && (
                            <span
                                className={styles.Fork}
                                title="Fork this share."
                                onClick={handleFork}
                            >
                                <i className="bi bi-diagram-2"></i>
                            </span>
                        )}
                        <span
                            className={styles.Key}
                            title="Embed secret to allow foreign editing."
                            onClick={handleExpose}
                        >
                            <i className="bi bi-key"></i>
                        </span>
                        <span
                            className={styles.Settings}
                            title="Easter Eggs!"
                            onClick={handleInfo}
                        >
                            <i className="bi bi-info"></i>
                        </span>
                    </div>
                </div>
                <div className={styles.Config}>
                    <div className={styles.Copy}>
                        <span
                            className={styles.Link}
                            title="Copy link to clipboard."
                            onClick={handleLinkCopy}
                        >
                            <i className="bi bi-link"></i>
                        </span>
                        <span
                            className={styles.Code}
                            title="Copy code to clipboard."
                            onClick={handleCodeCopy}
                        >
                            <i className="bi bi-code"></i>
                        </span>
                    </div>
                    <div className={styles.Lang}>
                        <select
                            value={shared.language}
                            onChange={handleLangSelect}
                        >
                            {langs.map((val, idx) => (
                                <option key={idx} value={val.value}>
                                    {val.name}
                                </option>
                            ))}
                        </select>
                        <span
                            className={styles.Compile}
                            title="Open compiller."
                            onClick={handleCompilerShow}
                        >
                            <i className="bi bi-box"></i>
                        </span>
                    </div>
                    <div className={styles.Theme}>
                        <input
                            type="checkbox"
                            className={styles.Switch}
                            checked={local.theme === "DARK"}
                            onChange={handleThemeSwitch}
                        ></input>
                    </div>
                </div>
            </div>
            {showCompiler && (
                <Compiler
                    selfShow={[showCompiler, setShowCompiler]}
                    language={shared.language}
                >
                    {shared.code}
                </Compiler>
            )}
        </>
    );
}

export default Footer;
