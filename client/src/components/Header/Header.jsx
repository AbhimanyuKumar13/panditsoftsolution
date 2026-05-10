import React from "react";
import { Link,useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Header.module.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import logo from "../../assets/images/pss_no_bg.png";
import { FaArrowRightLong } from "react-icons/fa6";

const Header = () => {
  const location = useLocation();
  const {
    VITE_COMPANY_NAME,
    VITE_NAV_HOME,
    VITE_NAV_SERVICES,
    VITE_NAV_PROJECTS,
    VITE_NAV_ABOUT,
    VITE_NAV_CONTACT,
  } = import.meta.env;

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className={styles.inner}>

        <Link to="/" className={styles.brand}>
          <img src={logo} alt={`${VITE_COMPANY_NAME} logo`} />
          <span className={styles.name}>{VITE_COMPANY_NAME}</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/"  className={location.pathname === "/" ? styles.active : ""}>{VITE_NAV_HOME}</Link>
          <Link to="/ourServices"  className={location.pathname === "/ourServices" ? styles.active : ""}>{VITE_NAV_SERVICES}</Link>
          <Link to="/projects"  className={location.pathname === "/projects" ? styles.active : ""}>{VITE_NAV_PROJECTS}</Link>
          <Link to="/about"  className={location.pathname === "/about" ? styles.active : ""}>{VITE_NAV_ABOUT}</Link>
          <Link to="/contact"  className={location.pathname === "/contact" ? styles.active : ""}>{VITE_NAV_CONTACT}</Link>
        </nav>

        <div className={styles.right}>
          <ThemeToggle />
          <motion.div
            className={styles.floatingBtn}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link className={styles.container} to="/skill-lab">
              <span>Skill Lab</span>
              <FaArrowRightLong />
            </Link>
          </motion.div>
        </div>

      </div>
    </motion.header>
  );
};

export default Header;