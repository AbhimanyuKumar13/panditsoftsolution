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
        <h2>Have a project in mind?</h2>
        <p>
          Tell us what you're building. We'll tell you if we're the right fit —
          no sales pitch, just an honest conversation.
        </p>
        <Link to="/contact" className={styles.button}>
          Start a Conversation
        </Link>
      </motion.div>
    </section>
  );
};

export default AboutCTA;