import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesCTA.module.css";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

const reasons = [
  "Clear scope before build",
  "Responsive layouts on every screen",
  "Support after launch",
];

const ServicesCTA = () => {
  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.copy}>
          <span className={styles.kicker}>Ready To Build</span>
          <h2>Need a better service page, website, or web app?</h2>
          <p>
            Share your goals and pages. We will shape the right build.
          </p>

          <ul className={styles.reasons}>
            {reasons.map((item) => (
              <li key={item}>
                <FiCheckCircle aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <Link to="/Contact" className={styles.button}>
            Start a Project
            <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/Projects" className={styles.secondary}>
            View Projects
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesCTA;
