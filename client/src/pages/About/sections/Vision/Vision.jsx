import React from "react";
import { motion } from "framer-motion";
import styles from "./Vision.module.css";

const Vision = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <span className={styles.eyebrow}>Our Vision</span>
        <h2>
          The go-to engineering partner for businesses that want software
          built right — not just built fast.
        </h2>
        <p>
          We're not chasing scale for its own sake. We want to be the team that
          founders and business owners trust to turn their ideas into reliable,
          maintainable products — the kind of team you call again for the next
          version.
        </p>
      </motion.div>
    </section>
  );
};

export default Vision;