import React from "react";
import { motion } from "framer-motion";
import styles from "./AboutStory.module.css";

const AboutStory = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.box}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <span className={styles.label}>Our Story</span>
        <h2>Started Small. Built Real Things.</h2>
        <p>
          Pandit Soft Solution started from a simple frustration — too many
          businesses were paying for websites that looked good but didn't work,
          or getting handed off to freelancers who disappeared after delivery.
        </p>
        <p>
          We're a team of three engineers from Bihar who decided to build
          differently. Every project we take on, we understand the actual
          business problem first — then we design and build a solution that fits
          it. No templates, no off-the-shelf fills, no inflated agency retainers.
        </p>
        <p>
          From local construction businesses in Gujarat to e-commerce stores,
          AI tools, and EdTech platforms — we've built across domains, always
          with the same rule: ship clean, documented, and maintainable software
          that clients can own for the long term.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutStory;