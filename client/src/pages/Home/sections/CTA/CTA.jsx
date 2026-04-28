import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import styles from "./CTA.module.css";
import { Link } from "react-router-dom";

const reasons = [
  "Clear scope before build",
  "Better UX on every screen",
  "Help for new or existing projects",
];

const CTA = () => {
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
          <span className={styles.kicker}>Ready To Talk</span>
          <h2>Need help with a new build, redesign, or project issue?</h2>
          <p>
            We can turn it into a clear plan and a better user experience.
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
            Contact Us
            <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/Projects" className={styles.secondary}>
            See Projects
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
