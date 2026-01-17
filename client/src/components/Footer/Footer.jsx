import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

const Footer = () => {
  const {
    VITE_COMPANY_NAME,
    VITE_COMPANY_TAGLINE,
    VITE_COMPANY_ADDRESS,
    VITE_COMPANY_EMAIL,
    VITE_COMPANY_MAP_URL,
  } = import.meta.env;

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <h4>{VITE_COMPANY_NAME}</h4>
          <p>{VITE_COMPANY_TAGLINE}</p>
        </div>

        {/* Contact */}
        <div className={styles.contact}>
          <h5>Contact</h5>
          <p>
            <FaLocationDot /> {VITE_COMPANY_ADDRESS}
          </p>
          <p>
            <IoMail />
            <a
              className={styles.email}
              href={`mailto:${VITE_COMPANY_EMAIL}`}
            >
              {" "}{VITE_COMPANY_EMAIL}
            </a>
          </p>
        </div>

        {/* Map */}
        <div className={styles.map}>
          <h5>Our Location</h5>
          <a
            href={VITE_COMPANY_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Google Maps
          </a>
        </div>
      </div>

      <div className={styles.copy}>
        © {new Date().getFullYear()} {VITE_COMPANY_NAME}. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
