import React from "react";
import { motion } from "framer-motion";
import styles from "./CTA.module.css";
import {Link} from "react-router-dom"

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
        <h2>Have a project/Idea in mind?</h2>
        <p>
          Let’s talk about how Pandit Soft Solution can help you build it right.
        </p>

        <Link to="/contact" className={styles.button}>
          Contact Us
        </Link>
      </motion.div>
    </section>
  );
};

export default CTA;
