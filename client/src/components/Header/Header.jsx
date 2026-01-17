import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Header.module.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import logo from "../../assets/images/pss_no_bg.png";

const Header = () => {
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
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <img src={logo} alt={`${VITE_COMPANY_NAME} logo`} />
          <span className={styles.name}>{VITE_COMPANY_NAME}</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/">{VITE_NAV_HOME}</Link>
          <Link to="/ourServices">{VITE_NAV_SERVICES}</Link>
          <Link to="/projects">{VITE_NAV_PROJECTS}</Link>
          <Link to="/about">{VITE_NAV_ABOUT}</Link>
        </nav>

        {/* Right actions */}
        <div className={styles.right}>
          <ThemeToggle />
          <Link to="/contact" className={styles.cta}>
            {VITE_NAV_CONTACT}
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
