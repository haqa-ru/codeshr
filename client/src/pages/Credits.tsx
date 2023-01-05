import styles from "../styles/Credits.module.scss";

function Credits() {
  return (
    <div className={styles.Credits}>
      <div className={styles.Container}>
        <a href="https://github.com/haqa-ru/codeshr">
          <h1>codeshr</h1>
        </a>
        <h3>instant code sharer!</h3>
        <h2>Made with ❤️ by haqa</h2>
        <a href="https://github.com/haqa-ru">Expore about us here!</a>
      </div>
    </div>
  );
}

export default Credits;
