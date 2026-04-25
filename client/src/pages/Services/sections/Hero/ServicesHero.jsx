import React from "react";
import { motion } from "framer-motion";
import styles from "./ServicesHero.module.css";

const highlights = [
  "Business websites",
  "Web apps and dashboards",
  "Backend APIs",
  "Ongoing support",
];

const ServicesHero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <span className={styles.eyebrow}>Web Development Services</span>
        <h1>Websites, web apps, dashboards, and APIs built for real business work.</h1>
        <p>
          Pandit Soft Solution builds company websites, custom web
          applications, admin panels, frontend interfaces, backend systems, and
          post-launch support. We handle new builds, redesigns, and ongoing
          feature work.
        </p>

        <div className={styles.highlights}>
          {highlights.map((item) => (
            <span key={item} className={styles.chip}>
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesHero;
