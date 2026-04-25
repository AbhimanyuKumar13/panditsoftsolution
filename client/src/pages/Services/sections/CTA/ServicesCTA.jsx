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
        <h2>Need a website or web app built?</h2>
        <p>
          Share the pages, features, or idea you have in mind, and we can plan
          the right build with you.
        </p>
        <Link to="/Contact" className={styles.button}>
          Start a Project
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesCTA;
