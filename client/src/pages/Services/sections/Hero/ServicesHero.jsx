import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLayers,
  FiMessageSquare,
  FiSmartphone,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./ServicesHero.module.css";

const quickStats = [
  { value: "Mobile-first", label: "Clean on mobile, tablet, and desktop" },
  { value: "Clear scope", label: "Better planning before development" },
  { value: "Fast updates", label: "Progress reviewed in milestones" },
];

const priorities = [
  {
    icon: FiMessageSquare,
    title: "Clear communication",
    text: "Easy to review, explain, and approve.",
  },
  {
    icon: FiSmartphone,
    title: "Responsive design",
    text: "Built for mobile, tablet, and desktop.",
  },
  {
    icon: FiTrendingUp,
    title: "Built for results",
    text: "Focused on clarity, speed, and conversion.",
  },
];

const buildFlow = [
  "Set scope and features",
  "Plan structure and actions",
  "Build, review, and launch",
];

const ServicesHero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.backdrop} />

      <div className={styles.shell}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <span className={styles.eyebrow}>Web Development Services</span>
          <h1>
            Websites and apps should feel{" "}
            <span>clear, fast, and easy to use.</span>
          </h1>
          <p>
            We build websites, dashboards, web apps, and backend systems with a
            focus on clarity, speed, and business goals.
          </p>

          <div className={styles.actions}>
            <Link to="/Contact" className={styles.primaryAction}>
              Start a Project
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/Projects" className={styles.secondaryAction}>
              See Recent Work
            </Link>
          </div>

          <div className={styles.stats}>
            {quickStats.map((item) => (
              <div key={item.value} className={styles.statCard}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          className={styles.panel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div className={styles.panelTop}>
            <span className={styles.panelTag}>
              <FiLayers aria-hidden="true" />
              What clients need
            </span>
            <h2>Better flow, clearer structure, cleaner delivery.</h2>
          </div>

          <div className={styles.priorityList}>
            {priorities.map(({ icon: Icon, title, text }) => (
              <div key={title} className={styles.priorityCard}>
                <span className={styles.priorityIcon}>
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.flowCard}>
            <div className={styles.flowHeader}>
              <span>Typical flow</span>
              <p>Simple steps. Fewer revisions.</p>
            </div>

            <ul className={styles.flowList}>
              {buildFlow.map((item) => (
                <li key={item}>
                  <FiCheckCircle aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default ServicesHero;
