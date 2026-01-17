import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesHero.module.css";

const ServicesHero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <h1>Our Services</h1>
        <p>
          We provide end-to-end software development services focused on quality,
          security, and long-term scalability.
        </p>
      </motion.div>
    </section>
  );
};

export default ServicesHero;
