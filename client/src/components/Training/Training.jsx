import { Link, useLocation } from "react-router-dom";
import styles from "./Training.module.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Training() {
  const location = useLocation();
  const hideButton = location.pathname.includes("/skill-lab");
  return (
    <>
      {!hideButton && (
        <motion.div
          className={styles.floatingBtn}
          aria-label="Training Center"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Link className={styles.container} to="/skill-lab">
            <span> Skill Lab </span> <FaArrowRightLong />
          </Link>
        </motion.div>
      )}
    </>
  );
}
