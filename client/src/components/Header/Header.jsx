import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
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
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt={`${VITE_COMPANY_NAME} logo`} />
          <span className={styles.name}>{VITE_COMPANY_NAME}</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={location.pathname === "/" ? styles.active : ""}
          >
            {VITE_NAV_HOME}
          </Link>
          <Link
            to="/ourServices"
            className={
              location.pathname === "/ourServices" ? styles.active : ""
            }
          >
            {VITE_NAV_SERVICES}
          </Link>
          <Link
            to="/projects"
            className={location.pathname === "/projects" ? styles.active : ""}
          >
            {VITE_NAV_PROJECTS}
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? styles.active : ""}
          >
            {VITE_NAV_ABOUT}
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? styles.active : ""}
          >
            {VITE_NAV_CONTACT}
          </Link>
        </nav>

        <div className={styles.right}>
          <div className={styles.floatingBtn}>
            <Link className={styles.container} to="/skill-lab">
              <span>Skill Lab</span>
              <FaArrowRightLong />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
