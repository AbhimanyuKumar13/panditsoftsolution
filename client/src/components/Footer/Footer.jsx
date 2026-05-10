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
} from "react-icons/fi";

import { FaFacebook, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";

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
    VITE_SOCIAL_FACEBOOK,
    VITE_COMPANY_GSTIN,
    VITE_COMPANY_MSME,
    VITE_COMPANY_ISO,
  } = import.meta.env;

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
    {
      label: "LinkedIn",
      href: VITE_SOCIAL_LINKEDIN,
      icon: FaLinkedinIn,
    },
    {
      label: "Instagram",
      href: VITE_SOCIAL_INSTAGRAM,
      icon: FaInstagram,
    },
    {
      label: "Facebook",
      href: VITE_SOCIAL_FACEBOOK,
      icon: FaFacebook,
    },
    {
      label: "YouTube",
      href: VITE_SOCIAL_YOUTUBE,
      icon: FaYoutube,
    },
    {
      label: "Google map",
      href: VITE_COMPANY_MAP_URL,
      icon: FiMapPin,
    },
  ].filter((item) => item.href);

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.brandSection}> 

          <h2>{VITE_COMPANY_NAME}</h2>

          <p className={styles.tagline}>{VITE_COMPANY_TAGLINE}</p>

          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <FiMapPin />
              <span>{VITE_COMPANY_ADDRESS}</span>
            </div>

            <a
              href={`mailto:${VITE_COMPANY_EMAIL}`}
              className={styles.infoItem}
            >
              <FiMail />
              <span>{VITE_COMPANY_EMAIL}</span>
            </a>
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
                <Icon />
              </a>
            ))}
          </div>
          {VITE_COMPANY_MAP_URL && (
            <div className={styles.mapWrapper}>
              <iframe
                src={VITE_COMPANY_MAP_URL}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          )}
        </div>

        {/* CENTER */}
        <div className={styles.linksSection}>
          <div>
            <span className={styles.sectionTitle}>Legals</span>

            <div className={styles.linksGrid}>
              {legalLinks.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div> 
        </div>

        {/* RIGHT */}
        <div className={styles.metaSection}>
          <div>
            <span className={styles.sectionTitle}>Credentials</span>

            <div className={styles.badges}>
              {certifications.map((item) => (
                <div key={item.label} className={styles.badge}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>
          Copyright {new Date().getFullYear()} {VITE_COMPANY_NAME}. All rights
          reserved.
        </p> 
      </div>
    </motion.footer>
  );
};

export default Footer;
