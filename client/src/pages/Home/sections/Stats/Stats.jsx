import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Stats.module.css";

const StatItem = ({ value, label, suffix = "+" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(progress * end);
      setCount(current);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
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
    <section className={styles.stats}>
      <StatItem value={2} label="Years of Experience" />
      <StatItem value={5} label="Satisfied Clients" />
      <StatItem value={10} label="Our Projects" />
    </section>
  );
};

export default Stats;
