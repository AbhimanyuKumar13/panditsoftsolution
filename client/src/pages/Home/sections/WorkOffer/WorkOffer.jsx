import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiLayout,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./WorkOffer.module.css";
import { projects } from "../../../../data/Home/Work.data";

const iconMap = {
  "Business Websites": FiGlobe,
  "Admin Dashboard Web App": FiLayout,
  "Landing Page for Services": FiTrendingUp,
};

const highlights = [
  "Mobile-first",
  "Clear messaging",
  "Post-launch support",
];

const WorkOffer = () => {
  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.introRow}>
          <header className={styles.header}>
            <span className={styles.kicker}>Offer Snapshot</span>
            <h2>What we build once the goals are clear.</h2>
            <p>
              We build websites and products that are easier to use, trust, and grow.
            </p>
          </header>

          <motion.aside
            className={styles.summary}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <span className={styles.summaryLabel}>Why it works</span>
            <p>
              Each build is shaped around user flow, clear screens, and the actions
              people need to take.
            </p>

            <ul className={styles.summaryList}>
              {highlights.map((item) => (
                <li key={item}>
                  <FiCheckCircle aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>

        <div className={styles.list}>
          {projects.map((project, i) => {
            const Icon = iconMap[project.title] || FiLayout;

            return (
              <motion.article
                key={project.title}
                className={styles.card}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className={styles.top}>
                  <div className={styles.topMeta}>
                    <span className={styles.iconWrap}>
                      <Icon aria-hidden="true" />
                    </span>
                    <span className={styles.type}>{project.type}</span>
                  </div>
                  <h3>{project.title}</h3>
                </div>

                <p>{project.desc}</p>

                <ul className={styles.points}>
                  {project.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className={styles.meta}>
                  <div className={styles.metaBlock}>
                    <span>Stack</span>
                    <strong>{project.stack}</strong>
                  </div>

                  <div className={styles.metaBlock}>
                    <span>Best for</span>
                    <strong>{project.audience}</strong>
                  </div>
                </div>

                <p className={styles.result}>{project.result}</p>
              </motion.article>
            );
          })}
        </div>

        <div className={styles.ctaWrap}>
          <Link to="/ourServices" className={styles.cta}>
            View All Services
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WorkOffer;
