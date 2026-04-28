import React from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiExternalLink,
  FiFileText,
  FiMail,
  FiMapPin,
  FiShield,
} from "react-icons/fi";
import { FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

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
    VITE_COMPANY_ISO,
  } = import.meta.env;

  const companyLinks = [
    { to: "/", label: "Home" },
    { to: "/ourServices", label: "Services" },
    { to: "/Projects", label: "Projects" },
    { to: "/About", label: "About" },
    { to: "/Contact", label: "Contact" },
    { to: "/skill-lab", label: "Skill Lab" },
  ];

  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-condition-policy", label: "Terms & Conditions" },
    { to: "/refund-policy", label: "Refund Policy" },
    { to: "/data-protection-policy", label: "Data Protection" },
    { to: "/incident-response-policy", label: "Incident Response" },
    { to: "/code-of-conduct-policy", label: "Code of Conduct" },
    { to: "/internship-policy", label: "Internship Policy" },
    { to: "/esop-policy", label: "ESOP Policy" },
    { to: "/Msa-policy", label: "MSA" },
    { to: "/Nda-policy", label: "NDA" },
  ];

  const certifications = [
    { label: "GSTIN", value: VITE_COMPANY_GSTIN },
    { label: "MSME", value: VITE_COMPANY_MSME },
    { label: "ISO", value: VITE_COMPANY_ISO },
  ].filter((item) => item.value);

  const socialLinks = [
    { label: "LinkedIn", href: VITE_SOCIAL_LINKEDIN, icon: FaLinkedinIn },
    { label: "Instagram", href: VITE_SOCIAL_INSTAGRAM, icon: FaInstagram },
    { label: "YouTube", href: VITE_SOCIAL_YOUTUBE, icon: FaYoutube },
  ].filter((item) => item.href);

  const workStyle = [
    "Clear scope and communication",
    "Responsive, fast builds",
    "Support after launch",
  ];

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className={styles.shell}>
        <div className={styles.brandCard}>
          <span className={styles.kicker}>Build Better</span>
          <h4>{VITE_COMPANY_NAME}</h4>
          <p className={styles.tagline}>{VITE_COMPANY_TAGLINE}</p>

          <div className={styles.infoStack}>
            <div className={styles.infoItem}>
              <FiMapPin aria-hidden="true" />
              <span>{VITE_COMPANY_ADDRESS}</span>
            </div>

            <a href={`mailto:${VITE_COMPANY_EMAIL}`} className={styles.infoItem}>
              <FiMail aria-hidden="true" />
              <span>{VITE_COMPANY_EMAIL}</span>
            </a>
          </div>

          <div className={styles.actionRow}>
            <Link to="/Contact" className={styles.primaryAction}>
              Start Project
              <FiArrowRight aria-hidden="true" />
            </Link>

            {VITE_COMPANY_MAP_URL ? (
              <a
                href={VITE_COMPANY_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryAction}
              >
                View Map
                <FiExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>

          <div className={styles.socialRow}>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={label}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.linksCard}>
          <div className={styles.linkSection}>
            <span className={styles.sectionLabel}>Menu</span>
            <nav className={styles.linkList}>
              {companyLinks.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.linkSection}>
            <span className={styles.sectionLabel}>Legal</span>
            <nav className={`${styles.linkList} ${styles.policyGrid}`}>
              {legalLinks.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.metaCard}>
          <div className={styles.metaBlock}>
            <span className={styles.sectionLabel}>Credentials</span>
            <div className={styles.badges}>
              {certifications.map((item) => (
                <div key={item.label} className={styles.badge}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.metaBlock}>
            <span className={styles.sectionLabel}>How We Work</span>
            <ul className={styles.metaList}>
              {workStyle.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.metaNote}>
            <span className={styles.noteIcon}>
              <FiShield aria-hidden="true" />
            </span>
            <div>
              <h5>Need docs fast?</h5>
              <p>
                Policies and compliance links stay easy to find.
              </p>
            </div>
          </div>

          <Link to="/privacy-policy" className={styles.inlineLink}>
            Open Legal Docs
            <FiFileText aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>
          Copyright {new Date().getFullYear()} {VITE_COMPANY_NAME}. All rights
          reserved.
        </p>
        <span>{VITE_COMPANY_TAGLINE}</span>
      </div>
    </motion.footer>
  );
};

export default Footer;
