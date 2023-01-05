import { useNavigate, useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkGemoji from "remark-gemoji";
import ReactMarkdown from "react-markdown";

import { useShared } from "../hooks/useShared";

import styles from "../styles/Markdown.module.scss";
import "highlight.js/scss/atom-one-dark.scss";
import { useUpdateEffect } from "../hooks/useUpdateEffect";

function Markdown() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id") ?? undefined;
  const [shared] = useShared(id);

  useUpdateEffect(() => {
    if (!shared.id) navigate("/error");
  }, [shared.id]);

  return (
    <div className={styles.Markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkGemoji]}
        rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
        className={styles.MarkdownBody}
      >
        {shared.code}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
