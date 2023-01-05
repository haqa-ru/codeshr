import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import StorageContext from "../contexts/StorageContext";

import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../styles/Footer.module.scss";
import { IShared, status } from "../hooks/useShared";

function Status({
  id,
  status,
  secure,
  update,
}: {
  id: string | null;
  status: status;
  secure: boolean;
  update: (data: Partial<IShared>) => void;
}) {
  const stateColor = (state: string) => {
    return state === "FORBID"
      ? styles.Navy
      : state === "WAIT"
      ? styles.Yellow
      : state === "DENY"
      ? styles.Red
      : styles.Green;
  };

  const idClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    update({ secure: !secure });
  };

  return (
    <>
      {id && (
        <div className={`${styles.Status} ${stateColor(status)}`}>
          <span className={styles.Id} onClick={idClick}>
            {id}
          </span>
        </div>
      )}
    </>
  );
}

function Utilities({
  id,
  code,
  language,
  update,
}: {
  id: string | null;
  code: string;
  language: string;
  update: (data: Partial<IShared>) => void;
}) {
  const navigate = useNavigate();

  const [languages, setLanguages] = useState<{ name: string; value: string }[]>(
    [
      {
        name: "Plain Text",
        value: "plaintext",
      },
    ]
  );

  useEffect(() => {
    const fetchLanguages = async () => {
      const res = await fetch("/languages.json");

      if (res.ok) {
        setLanguages(await res.json());
      }
    };

    fetchLanguages();
  }, []);

  const linkClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    navigator.clipboard.writeText(window.location.href);
  };

  const textClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    navigator.clipboard.writeText(code);
  };

  const qrClick = () => {
    if (id)
      navigate(`/qr?id=${id}`, {
        state: { url: window.location.href },
      });
  };

  const languageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    update({ language: e.target.value });
  };

  const mdClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();

    if (id) navigate(`/markdown?id=${id}`);
  };

  return (
    <div className={styles.Utilities}>
      <span onClick={linkClick}>
        <i className="bi bi-link"></i>
      </span>
      <span onClick={textClick}>
        <i className="bi bi-code"></i>
      </span>
      <span onClick={qrClick}>
        <i className="bi bi-qr-code-scan"></i>
      </span>
      <select value={language} onChange={languageChange}>
        {languages.map((val, idx) => (
          <option key={idx} value={val.value}>
            {val.name}
          </option>
        ))}
      </select>
      {language === "markdown" && (
        <span onClick={mdClick}>
          <i className="bi bi-markdown"></i>
        </span>
      )}
    </div>
  );
}

function Actions({
  id,
  secure,
  secret,
  update,
}: {
  id: string | null;
  secure: boolean;
  secret: string | null;
  update: (data: Partial<IShared>) => void;
}) {
  const navigateRef = useRef(useNavigate());

  const [exposed, setExposed] = useState(false);

  useEffect(() => {
    navigateRef.current(
      `/${id ?? ""}${exposed && secret ? `?secret=${secret}` : ""}`
    );
  }, [id, secure, exposed, secret]);

  const plusClick = () => {
    window.open(window.location.origin, "_black")?.focus();
  };

  const forkClick = () => {
    update({ id: null });
  };

  const exposeClick = () => {
    setExposed((state) => !state);
  };

  const creditsClick = () => {
    navigateRef.current("/credits");
  };

  return (
    <div className={styles.Actions}>
      {id && (
        <>
          <span onClick={plusClick}>
            <i className="bi bi-plus"></i>
          </span>

          <span onClick={forkClick}>
            <i className="bi bi-diagram-2"></i>
          </span>

          <span onClick={exposeClick}>
            <i className="bi bi-key"></i>
          </span>
        </>
      )}
      <span onClick={creditsClick}>
        <i className="bi bi-postcard"></i>
      </span>
    </div>
  );
}

function Footer() {
  const { shared, updateShared, status } = useContext(StorageContext);

  return (
    <div className={styles.Footer}>
      <Status
        secure={shared.secure}
        id={shared.id}
        status={status}
        update={updateShared}
      />
      <Actions
        id={shared.id}
        secure={shared.secure}
        secret={shared.secret}
        update={updateShared}
      />
      <Utilities
        id={shared.id}
        code={shared.code}
        language={shared.language}
        update={updateShared}
      />
    </div>
  );
}

export default Footer;
