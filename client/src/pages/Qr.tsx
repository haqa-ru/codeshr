import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import styles from "../styles/Qr.module.scss";

interface INavigateState {
  url: string;
}

function Qr() {
  const navigateRef = useRef(useNavigate());
  const location = useLocation();

  const urlRef = useRef((location.state as INavigateState).url);

  useEffect(() => {
    const accessCheck = async (url: string) => {
      const res = await fetch(url);

      if (!res.ok) navigateRef.current("/error");
    };

    accessCheck(urlRef.current);
  }, []);

  return (
    <div className={styles.Qr}>
      <div className={styles.Container}>
        <QRCode value={urlRef.current}></QRCode>
      </div>
    </div>
  );
}

export default Qr;
