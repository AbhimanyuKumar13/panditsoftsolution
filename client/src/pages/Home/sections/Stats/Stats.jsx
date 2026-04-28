import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FiClock, FiMessageSquare, FiSmartphone } from "react-icons/fi";
import styles from "./Stats.module.css";

const metrics = [
  {
    value: 2,
    label: "Years delivering web projects",
    note: "Websites, landing pages, dashboards, and custom systems.",
  },
  {
    value: 5,
    label: "Clients served",
    note: "Work delivered with clear reviews and regular feedback.",
  },
  {
    value: 10,
    label: "Projects shipped",
    note: "Builds made for real business needs.",
  },
];

const supportPoints = [
  {
    icon: FiMessageSquare,
    title: "Clear reviews",
    text: "Scope and progress stay easy to follow.",
  },
  {
    icon: FiSmartphone,
    title: "Responsive design",
    text: "Mobile and desktop are planned from the start.",
  },
  {
    icon: FiClock,
    title: "Ongoing support",
    text: "Fixes and follow-up updates stay simple.",
  },
];

const spotlightItems = [
  "Clear scope",
  "Better UX",
  "Less launch risk",
];

const StatItem = ({ value, label, suffix = "+" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return undefined;

    let frameId;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * value);
      setCount(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <div ref={ref} className={styles.item}>
      <span className={styles.number}>
        {count}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

const Stats = () => {
  return (
    <section className={styles.section}>
      <div className={styles.wrapper}>
        <div className={styles.topRow}>
          <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
          >
            <span className={styles.kicker}>Proof</span>
            <h2>Good delivery should feel clear before launch.</h2>
            <p>
              This section adds proof, process, and working style in a quick scan.
            </p>
          </motion.header>

          <motion.aside
            className={styles.spotlight}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <span className={styles.spotlightLabel}>What clients value most</span>
            <ul className={styles.spotlightList}>
              {spotlightItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.aside>
        </div>

        <div className={styles.metricGrid}>
          {metrics.map((metric, i) => (
            <motion.article
              key={metric.label}
              className={styles.metricCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <StatItem value={metric.value} label={metric.label} suffix="+" />
              <p className={styles.note}>{metric.note}</p>
            </motion.article>
          ))}
        </div>

        <div className={styles.supportGrid}>
          {supportPoints.map(({ icon: Icon, title, text }, i) => (
            <motion.article
              key={title}
              className={styles.supportCard}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className={styles.supportIcon}>
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
