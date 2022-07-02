import { ChangeEvent, useContext, useEffect, useState } from "react";
import ConfigContext from "../contexts/ConfigContext";
import "./Footer.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
    const { shared, updateShared, local, updateLocal, status } =
        useContext(ConfigContext);
    const [langs, setLangs] = useState<{ name: string; value: string }[]>([
        {
            name: "Plain Text",
            value: "plaintext",
        },
    ]);

    useEffect(() => {
        const fetchLangs = async () => {
            const res = await fetch("/langs.json");

            if (res.ok) {
                setLangs(await res.json());
            }
        };

        fetchLangs();
    }, []);

    const handleLangSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();

        updateShared({ lang: e.target.value });
    };

    const handleThemeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
        updateLocal({ theme: e.target.checked ? "vs-dark" : "light" });
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

        updateShared({ secure: !shared.secure });
    };

    return (
        <div className="Footer">
            <div className="Meta">
                <div className="Status">
                    <div className={status}>
                        {status === "BAD" ? (
                            <i className="bi bi-cloud-slash"></i>
                        ) : status === "WAIT" ? (
                            <i className="bi bi-cloud-arrow-up"></i>
                        ) : (
                            <i className="bi bi-cloud-check"></i>
                        )}
                    </div>
                </div>
                <div className="Id" onClick={handleSecureToggle}>
                    <i>{shared.id}</i>
                </div>
            </div>
            <div className="Config">
                <div className="Copy">
                    <span className="Link" onClick={handleLinkCopy}>
                        <i className="bi bi-link"></i>
                    </span>
                    <span className="Code" onClick={handleCodeCopy}>
                        <i className="bi bi-code"></i>
                    </span>
                </div>
                <div className="Lang">
                    <select value={shared.lang} onChange={handleLangSelect}>
                        {langs.map((val, idx) => (
                            <option key={idx} value={val.value}>
                                {val.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="Theme">
                    <input
                        type="checkbox"
                        className="Switch"
                        checked={local.theme === "vs-dark"}
                        onChange={handleThemeSwitch}
                    ></input>
                </div>
            </div>
        </div>
    );
}

export default Footer;
