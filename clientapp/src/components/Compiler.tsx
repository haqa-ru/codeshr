import lightStyles from "./CompilerLight.module.scss";
import darkStyles from "./CompilerDark.module.scss";
import ReactMarkdown from "react-markdown";
import React, { useContext, useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import LocalContext from "../contexts/LocalContext";
import remarkGemoji from "remark-gemoji";

function Compiler({
    children,
    language,
    selfShow,
}: {
    children?: string;
    language: string;
    selfShow: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
    const { local } = useContext(LocalContext);
    const [showSelf, setShowSelf] = selfShow;

    const stylePath =
        local.theme === "LIGHT"
            ? "https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/atom-one-light.css"
            : "https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/atom-one-dark.css";
    const styles = local.theme === "DARK" ? darkStyles : lightStyles;

    const [module, setModule] = useState<React.CSSProperties>({
        width: 0,
    });

    useEffect(() => {
        setModule({
            width: window.screen.width <= 600 ? "100%" : "50%",
        });
    }, []);

    const handleOutsideClick = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        setModule({
            width: "0",
        });
        setTimeout(() => setShowSelf(false), 400);
    };

    return (
        <div className={styles.Background} onClick={handleOutsideClick}>
            <link rel="stylesheet" href={stylePath}></link>
            <div
                style={module}
                className={styles.Compiler}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.Close} onClick={handleOutsideClick}>
                    <i className="bi bi-chevron-right"></i>
                </div>
                {children &&
                    (language === "markdown" ? (
                        <ReactMarkdown
                            remarkPlugins={[
                                remarkMath,
                                remarkGfm,
                                remarkGemoji,
                            ]}
                            rehypePlugins={[
                                rehypeKatex,
                                rehypeRaw,
                                rehypeHighlight,
                            ]}
                            className={styles.MarkdownBody}
                        >
                            {children}
                        </ReactMarkdown>
                    ) : (
                        <div className={styles.Later}>
                            There is nothing, yet...
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Compiler;
