import styles from "./LoadingScreen.module.css";
import logo from "../../assets/images/pss_no_bg.png";

const LoadingScreen = ({ inline = false, label = "Loading..." }) => (
  <div
    className={`${styles.loader} ${inline ? styles.inline : styles.fullScreen}`}
    role="status"
    aria-live="polite"
  >
    <img className={styles.logo} src={logo} alt="PSS" />
    <span>{label}</span>
  </div>
);

export default LoadingScreen;
