import React from "react";
import { motion } from "framer-motion";
import styles from "./ContactInfo.module.css";

const ContactInfo = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.box}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <h3>What happens next?</h3>
        <ul>
          <li>We review your requirements</li>
          <li>We clarify scope & timeline</li>
          <li>We propose a clear solution</li>
        </ul>

        <p className={styles.note}>
          No spam. No unnecessary calls. Just clear communication.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactInfo;
