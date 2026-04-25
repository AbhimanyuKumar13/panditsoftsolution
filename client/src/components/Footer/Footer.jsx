import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";

import map from "../../assets/images/map.png";
import Instagram from "../../assets/images/Insta.png";
import LinkedIn from "../../assets/images/linkedin.png"; 
import Youtube from "../../assets/images/youtube.png";

const Footer = () => {
  const {
    VITE_COMPANY_NAME,
    VITE_COMPANY_TAGLINE,
    VITE_COMPANY_ADDRESS,
    VITE_COMPANY_EMAIL,
    VITE_COMPANY_MAP_URL,
    VITE_SOCIAL_INSTAGRAM, 
    VITE_SOCIAL_YOUTUBE, 
    VITE_SOCIAL_LINKEDIN,
    VITE_COMPANY_GSTIN,
    VITE_COMPANY_MSME,
    VITE_COMPANY_ISO
  } = import.meta.env;

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className={styles.inner}>
        {/* Brand */}
        <div className={styles.brand}>
          <h4>{VITE_COMPANY_NAME}</h4>
          <address>
            <FaLocationDot /> {VITE_COMPANY_ADDRESS}
          </address>
          <h3>
            <IoMail />
            <a href={`mailto:${VITE_COMPANY_EMAIL}`}>
              {VITE_COMPANY_EMAIL}
            </a>
          </h3>
          <p className={styles.tagline}>{VITE_COMPANY_TAGLINE}</p>

          <div className={styles.social}>
            <a href={VITE_SOCIAL_LINKEDIN} target="_blank">
              <img src={LinkedIn} alt="LinkedIn" />
            </a>
            <a href={VITE_SOCIAL_INSTAGRAM} target="_blank">
              <img src={Instagram} alt="Instagram" />
            </a> 
            <a href={VITE_SOCIAL_YOUTUBE} target="_blank">
              <img src={Youtube} alt="YouTube" />
            </a>
            <a href={VITE_COMPANY_MAP_URL} target="_blank">
              <img src={map} alt="map" />
            </a>
          </div>
        </div> 

        {/* certification */}
        <div className={styles.block}>
          <h5>Certification</h5>
          <div className={styles.lists}> 
            <p>GSTIN: {VITE_COMPANY_GSTIN}</p>
            <p>MSME: {VITE_COMPANY_MSME}</p>
            <p>ISO: {VITE_COMPANY_ISO}</p>
          </div>
        </div>
        <div className={styles.block}>
          <h5>Legal</h5>
          <nav className={styles.links}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-condition-policy">Terms & Conditions</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/data-protection-policy">Data Protection</Link>
            <Link to="/incident-response-policy">Incident Response</Link>
            <Link to="/code-of-conduct-policy">Code of Conduct</Link>
            <Link to="/internship-policy">Internship Policy</Link>
            <Link to="/esop-policy">ESOP Policy</Link>
            <Link to="/Msa-policy">MSA</Link>
            <Link to="/Nda-policy">NDA</Link>
          </nav>
        </div>
      </div>

      <div className={styles.copy}>
        © {new Date().getFullYear()} {VITE_COMPANY_NAME}. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
