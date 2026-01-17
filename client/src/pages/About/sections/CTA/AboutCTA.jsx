import React from "react";
import { motion } from "framer-motion";
import styles from "./AboutCTA.module.css";
import { Link } from "react-router-dom";

const AboutCTA = () => {
  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2>Let’s build something meaningful</h2>
        <p>
          If our approach aligns with your goals, we’d love to talk.
        </p>
        <Link to="/contact" className={styles.button}>
          Get in Touch
        </Link>
      </motion.div>
    </section>
  );
};

export default AboutCTA;
