import React from "react";
import {Link} from "react-router-dom"
import { motion } from "framer-motion";
import styles from "./WorkOffer.module.css";
import { projects } from "../../../../data/Home/Work.data";

const WorkOffer = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>What We Offer</h2>
        <p>
          We build fast, scalable websites and applications for real-world businesses.
        </p> 
      </header>

      <div className={styles.list}>
        {projects.map((project, i) => (
          <motion.article
            key={project.title}
            className={styles.card}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className={styles.top}>
              <span className={styles.type}>{project.type}</span>
              <h3>{project.title}</h3>
            </div>

            <p>{project.desc}</p>

            <div className={styles.tags}>
              <span>{project.stack}</span>
              <span>{project.audience}</span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* CTA */}
      <div className={styles.ctaWrap}>
        <Link to="/ourservices" className={styles.cta}>
          Explore All Services →
        </Link>
      </div>
    </section>
  );
};

export default WorkOffer;