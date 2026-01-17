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
        <h2>Our Vision</h2>
        <p>
          To become a trusted technology partner for businesses by delivering
          secure, scalable, and thoughtfully engineered digital products.
        </p>
      </motion.div>
    </section>
  );
};

export default Vision;
