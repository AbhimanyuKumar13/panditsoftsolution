import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesCTA.module.css";
import { Link } from "react-router-dom";

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
        <h2>Ready to start your project?</h2>
        <p>Let’s discuss your requirements and timeline.</p>
        <Link to="/contact" className={styles.button}>
          Contact Us
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesCTA;
