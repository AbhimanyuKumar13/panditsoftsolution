import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiUsers,
  FiZap,
  FiShield,
} from "react-icons/fi";

import styles from "./About.module.css";
import { owners } from "../../data/OWNER/Owners.data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

const highlights = [
  {
    icon: FiCode,
    title: "Founder-led execution",
    desc: "Projects are handled directly with technical understanding and clear communication.",
  },
  {
    icon: FiZap,
    title: "Fast support",
    desc: "Quick responses, faster revisions, and transparent progress updates.",
  },
  {
    icon: FiShield,
    title: "Reliable development",
    desc: "Clean, scalable, and maintainable solutions built for long-term use.",
  },
  {
    icon: FiUsers,
    title: "Client-first approach",
    desc: "We focus on practical business outcomes instead of unnecessary complexity.",
  },
];

const process = [
  "Understand the actual business requirement",
  "Plan the most practical solution",
  "Build with performance and scalability in mind",
  "Provide support after deployment",
];

const stats = [
  {
    number: "10+",
    label: "Projects Delivered",
  },
  {
    number: "24h",
    label: "Average Response",
  },
  {
    number: "100%",
    label: "Custom Solutions",
  },
];

const About = () => {
  return (
    <div className={styles.page}>
      {/* HERO */}
      <motion.section className={styles.hero} {...fadeUp(0)}>
        <span className={styles.heroTag}>
          Development • Training • Consultancy
        </span>

        <h1>
          Building software that businesses can actually rely on.
        </h1>

        <p>
          From websites and platforms to scalable digital solutions —
          we focus on clean execution, modern development, and
          long-term usability.
        </p>

        <div className={styles.heroActions}>
          <Link to="/Contact" className={styles.primaryBtn}>
            Start a project
            <FiArrowRight size={16} />
          </Link>

          <Link to="/Services" className={styles.secondaryBtn}>
            Explore services
          </Link>
        </div>
      </motion.section>

      {/* STATS */}
      <motion.section className={styles.statsGrid} {...fadeUp(0.05)}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <h3>{item.number}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </motion.section>

      {/* STORY + PROCESS */}
      <div className={styles.grid}>
        <motion.section className={styles.card} {...fadeUp(0.08)}>
          <span className={styles.cardLabel}>Who we are</span>

          <h2>Built by engineers, not just marketers.</h2>

          <div className={styles.textStack}>
            <p>
              Pandit Soft Solution (PSS) was founded with a simple idea —
              build software properly and maintain honest communication
              throughout the process.
            </p>

            <p>
              We focus on practical solutions that are modern, reliable,
              scalable, and easy to maintain over time.
            </p>

            <p>
              Instead of overcomplicating things, we work closely with
              clients to understand real requirements and deliver
              meaningful results.
            </p>
          </div>
        </motion.section>

        <motion.section className={styles.card} {...fadeUp(0.1)}>
          <span className={styles.cardLabel}>How we work</span>

          <h2>Simple process. Clear communication.</h2>

          <div className={styles.points}>
            {process.map((point) => (
              <div key={point} className={styles.pointItem}>
                <FiCheckCircle size={16} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* HIGHLIGHTS */}
      <motion.section className={styles.sectionCard} {...fadeUp(0.12)}>
        <div className={styles.sectionHead}>
          <span className={styles.cardLabel}>Why PSS</span>

          <h2>Focused on quality, speed, and long-term trust.</h2>
        </div>

        <div className={styles.highlightsGrid}>
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                className={styles.highlightCard}
                {...fadeUp(index * 0.05)}
              >
                <div className={styles.highlightIcon}>
                  <Icon size={20} />
                </div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      {/* FOUNDERS */}
      {/* <motion.section
        className={styles.founderSection}
        {...fadeUp(0.15)}
      >
        <div className={styles.sectionHead}>
          <span className={styles.cardLabel}>Leadership</span>

          <h2>Founder-led team with technical focus.</h2>

          <p>
            Every project is handled with direct involvement,
            technical understanding, and attention to detail.
          </p>
        </div>

        <div className={styles.teamGrid}>
          {owners.map((owner, index) => (
            <motion.article
              key={owner.id}
              className={styles.teamCard}
              {...fadeUp(index * 0.06)}
            >
              <div className={styles.avatarWrap}>
                <img
                  src={owner.image}
                  alt={owner.name}
                  loading="lazy"
                />
              </div>

              <div className={styles.teamInfo}>
                <h3>{owner.name}</h3>

                <span>{owner.role}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section> */}

      {/* FOUNDER NOTE */}
      <motion.section
        className={styles.founderNote}
        {...fadeUp(0.18)}
      >
        <p className={styles.quote}>
          “We started PSS with a simple goal —
          build software properly and treat clients honestly.”
        </p>

        <span>— Abhimanyu Pandit, Founder</span>
      </motion.section>

      {/* CTA */}
      <motion.section className={styles.ctaCard} {...fadeUp(0.2)}>
        <div className={styles.ctaText}>
          <span className={styles.cardLabel}>Let&apos;s connect</span>

          <h2>Have an idea or project in mind?</h2>

          <p>
            We’d love to discuss your requirements and help
            you build something meaningful.
          </p>
        </div>

        <Link to="/Contact" className={styles.ctaBtn}>
          Get in touch
          <FiArrowRight size={16} />
        </Link>
      </motion.section>
    </div>
  );
};

export default About;