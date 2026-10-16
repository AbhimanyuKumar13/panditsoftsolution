import React, { createElement } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  const {
    VITE_COMPANY_NAME,
    VITE_COMPANY_TAGLINE,
    VITE_COMPANY_ADDRESS,
    VITE_COMPANY_EMAIL,
    VITE_COMPANY_PHONE,
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
  ];

  const certifications = [
    { label: "GSTIN", value: VITE_COMPANY_GSTIN },
    { label: "MSME", value: VITE_COMPANY_MSME },
  ].filter((item) => item.value && item.value !== "COMING SOON");

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
  ].filter((item) => item.href);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <div className={styles.brandCard}>
            <span className={styles.eyebrow}>Business solutions</span>
            <h2>{VITE_COMPANY_NAME}</h2>
            <p className={styles.tagline}>{VITE_COMPANY_TAGLINE}</p>

            <div className={styles.contactInfo}>
              {VITE_COMPANY_PHONE && (
                <a
                  href={`tel:${VITE_COMPANY_PHONE}`}
                  className={styles.infoItem}
                >
                  <FiPhone />
                  <span>{VITE_COMPANY_PHONE}</span>
                </a>
              )}

              <a
                href={`mailto:${VITE_COMPANY_EMAIL}`}
                className={styles.infoItem}
              >
                <FiMail />
                <span>{VITE_COMPANY_EMAIL}</span>
              </a>

              <div className={styles.infoItem}>
                <FiMapPin />
                <span>{VITE_COMPANY_ADDRESS}</span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className={styles.socialRow}>
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={label}
                  >
                    {createElement(icon)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.panelCard}>
            <span className={styles.sectionTitle}>Explore</span>

            <div className={styles.linksGrid}>
              {legalLinks.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.metaSection}>
          <div className={styles.panelCard}>
            <span className={styles.sectionTitle}>Credentials</span>

            {certifications.length > 0 ? (
              <div className={styles.badges}>
                {certifications.map((item) => (
                  <div key={item.label} className={styles.badge}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Trusted business partner</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>
          Copyright {new Date().getFullYear()} {VITE_COMPANY_NAME}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
