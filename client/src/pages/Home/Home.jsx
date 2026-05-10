import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FiArrowRight,
  FiGlobe,
  FiLayout,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./Home.module.css";
import { points } from "../../data/Home/Whyus.data";
import { projects } from "../../data/Home/Work.data";

const metrics = [
  {
    value: 2,
    label: "Years of Experience",
  },
  {
    value: 5,
    label: "Clients Served",
  },
  {
    value: 10,
    label: "Projects Delivered",
  },
];

const iconMap = {
  "Business Websites": FiGlobe,
  "Admin Dashboard Web App": FiLayout,
  "Landing Page for Services": FiTrendingUp,
};

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
    <div ref={ref} className={styles.homeStatsItem}>
      <span className={styles.homeStatsNumber}>
        {count}
        {suffix}
      </span>
      <span className={styles.homeStatsLabel}>{label}</span>
    </div>
  );
};

const Home = () => {
  return (
    <>
      <section className={styles.homeHero}>
        <motion.div
          className={styles.homeHeroContent}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1>
            Professional <span>websites</span> and <br />
            <span>web apps</span> for growing businesses.
          </h1>

          <p>
            We design and build reliable digital products for service
            businesses, startups, and teams.
          </p>

          <div className={styles.homeHeroActions}>
            <Link to="/Contact" className={styles.homeHeroPrimary}>
              Start Your Project
            </Link>
            <Link to="/Projects" className={styles.homeHeroSecondary}>
              View Projects
            </Link>
          </div>
        </motion.div>
      </section>

      <section className={styles.homeWhySection}>
        <div className={styles.homeWhyWrapper}>
          <header className={styles.homeWhyHeader}>
            <h2>Why Choose Us</h2>
          </header>

          <div className={styles.homeWhyTimeline}>
            {points.map((item, i) => (
              <motion.div
                key={item.title}
                className={styles.homeWhyItem}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.homeWhyCard}>
                  <div className={styles.homeWhyInner}>
                    <div className={styles.homeWhyImageWrapper}>
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className={styles.homeWhyContent}>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.homeOfferSection}>
        <div className={styles.homeOfferShell}>
          <header className={styles.homeOfferHeader}>
            <span className={styles.homeOfferKicker}>What We Build</span>
            <h2>Practical digital products for real business needs.</h2>
            <p>
              We build websites, dashboards, and landing pages with clear
              structure and reliable delivery.
            </p>
          </header>

          <div className={styles.homeOfferList}>
            {projects.map((project, i) => {
              const Icon = iconMap[project.title] || FiLayout;

              return (
                <motion.article
                  key={project.title}
                  className={styles.homeOfferCard}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className={styles.homeOfferTop}>
                    <div className={styles.homeOfferTopMeta}>
                      <span className={styles.homeOfferIconWrap}>
                        <Icon aria-hidden="true" />
                      </span>
                      <span className={styles.homeOfferType}>
                        {project.type}
                      </span>
                    </div>
                    <h3>{project.title}</h3>
                  </div>

                  <p>{project.desc}</p>

                  <ul className={styles.homeOfferPoints}>
                    {project.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>

          <div className={styles.homeOfferCtaWrap}>
            <Link to="/ourServices" className={styles.homeOfferCta}>
              View All Services
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.homeStatsSection}>
        <div className={styles.homeStatsWrapper}>
          <div className={styles.homeStatsMetricGrid}>
            {metrics.map((metric, i) => (
              <motion.article
                key={metric.label}
                className={styles.homeStatsMetricCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <StatItem
                  value={metric.value}
                  label={metric.label}
                  suffix="+"
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.homeCtaSection}>
        <motion.div
          className={styles.homeCtaInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.homeCtaCopy}>
            <span className={styles.homeCtaKicker}>Ready To Talk</span>
            <h2>Have a project in mind?</h2>
            <p>
              Tell us what you need and we will help you plan the right build.
            </p>
          </div>

          <div className={styles.homeCtaActions}>
            <Link to="/Contact" className={styles.homeCtaButton}>
              Contact Us
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
