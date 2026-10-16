import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import founderImg from "../../assets/images/abhi.png";
import cofounderImg from "../../assets/images/anand.png";
import cofounderImg2 from "../../assets/images/shailesh.png";
import {
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiUsers,
  FiZap,
  FiShield,
} from "react-icons/fi";

import styles from "./About.module.css";

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

        <h1>Building software that businesses can actually rely on.</h1>

        <p>
          From websites and platforms to scalable digital solutions — we focus
          on clean execution, modern development, and long-term usability.
        </p>

        <div className={styles.heroActions}>
          <Link to="/Contact" className={styles.primaryBtn}>
            Start a project
            <FiArrowRight size={16} />
          </Link>

          <Link to="/ourServices" className={styles.secondaryBtn}>
            Explore services
          </Link>
        </div>
      </motion.section>

      <div className={styles.founder}>
        <motion.div className={styles.founderImage} {...fadeUp(0.05)}>
          <img src={founderImg} alt="Abhimanyu Pandit" loading="lazy" />
        </motion.div>

        <motion.div className={styles.founderText} {...fadeUp(0.07)}>
          <h2>Er. Abhimanyu Pandit</h2>

          <span>Founder & Lead Engineer</span>

          <p>
            Abhimanyu is a software engineer with over 4 years of experience in
            building web and mobile applications. He founded PSS to provide
            practical solutions that are modern, reliable, and easy to maintain
            over time.
          </p>
        </motion.div>
      </div>
      <div className={styles.cofounder}>
        <motion.div className={styles.cofounderImage} {...fadeUp(0.05)}>
          <img src={cofounderImg} alt="Anand Kumar" loading="lazy" />
        </motion.div>

        <motion.div className={styles.founderText} {...fadeUp(0.07)}>
          <h2>Er. Anand Kumar</h2>

          <span>Co-Founder & Head of Management</span>

          <p>
            Anand is a business strategist with over 5 years of experience in
            managing projects and teams. He co-founded PSS to ensure that
            clients receive clear communication, timely delivery, and
            high-quality solutions.
          </p>
        </motion.div>
      </div>
      <div className={styles.cofounder2}>
        <motion.div className={styles.cofounderImage2} {...fadeUp(0.05)}>
          <img src={cofounderImg2} alt="Shailesh Kumar" loading="lazy" />
        </motion.div>

        <motion.div className={styles.founderText} {...fadeUp(0.07)}>
          <h2>Er. Shailesh Pandit</h2>

          <span>Co-Founder & AI & ML Engineer</span>

          <p>
            Shailesh is an AI and ML engineer with over 3 years of experience in
            developing intelligent systems. He co-founded PSS to bring
            innovative AI and ML solutions to businesses, ensuring they stay
            ahead in the digital landscape.
          </p>
        </motion.div>
      </div>

      {/* STORY + PROCESS */}
      <div className={styles.grid}>
        <motion.section className={styles.card} {...fadeUp(0.08)}>
          <span className={styles.cardLabel}>Who we are</span>

          <h2>Built by engineers, not just marketers.</h2>

          <div className={styles.textStack}>
            <p>
              Pandit Soft Solution (PSS) was founded with a simple idea — build
              software properly and maintain honest communication throughout the
              process.
            </p>

            <p>
              We focus on practical solutions that are modern, reliable,
              scalable, and easy to maintain over time.
            </p>

            <p>
              Instead of overcomplicating things, we work closely with clients
              to understand real requirements and deliver meaningful results.
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

      {/* FOUNDER NOTE */}
      <motion.section className={styles.founderNote} {...fadeUp(0.18)}>
        <p className={styles.quote}>
          “We started PSS with a simple goal — build software properly and treat
          clients honestly.”
        </p>

        <span>— Abhimanyu Pandit, Founder</span>
      </motion.section>

      {/* CTA */}
      <motion.section className={styles.ctaCard} {...fadeUp(0.2)}>
        <div className={styles.ctaText}>
          <span className={styles.cardLabel}>Let&apos;s connect</span>

          <h2>Have an idea or project in mind?</h2>

          <p>
            We’d love to discuss your requirements and help you build something
            meaningful.
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
