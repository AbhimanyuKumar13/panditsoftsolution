import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowDown,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiCode,
  FiLayers,
} from "react-icons/fi";
import styles from "./Hero.module.css";

const highlights = [
  { icon: <FiClock aria-hidden="true" />, value: "45 days", label: "Focused training" },
  { icon: <FiCode aria-hidden="true" />, value: "Real projects", label: "Learn by building" },
  { icon: <FiAward aria-hidden="true" />, value: "Certificate", label: "Show what you learned" },
];

const roadmapSteps = [
  {
    icon: <FiBookOpen aria-hidden="true" />,
    number: "01",
    title: "Learn the foundations",
    detail: "Build a strong base with guided practice.",
  },
  {
    icon: <FiCode aria-hidden="true" />,
    number: "02",
    title: "Build with guidance",
    detail: "Apply your skills to real project work.",
  },
  {
    icon: <FiLayers aria-hidden="true" />,
    number: "03",
    title: "Show what you can do",
    detail: "Leave with work you can share.",
  },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.shell}>
        <Motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Pandit Skill Lab
            <span className={styles.eyebrowDivider} />
            Practical tech training
          </div>

          <h1>
            Build skills you can <span>prove.</span>
          </h1>
          <p className={styles.intro}>
            Learn by building real projects with mentor guidance. Choose a
            focused 45-day program or a deeper 6-month career track.
          </p>

          <div className={styles.actions}>
            <a href="#training-programs" className={styles.primary}>
              Explore programs
              <FiArrowDown aria-hidden="true" />
            </a>
            <Link to="/contact" className={styles.secondary}>
              Talk to a mentor
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.highlights} aria-label="Training highlights">
            {highlights.map(({ icon, value, label }) => (
              <div key={value} className={styles.highlight}>
                <span className={styles.highlightIcon}>{icon}</span>
                <span>
                  <strong>{value}</strong>
                  <small>{label}</small>
                </span>
              </div>
            ))}
          </div>
        </Motion.div>

        <Motion.aside
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          aria-label="Your training roadmap"
        >
          <div className={styles.roadmapCard}>
            <div className={styles.roadmapTop}>
              <div>
                <span className={styles.roadmapEyebrow}>Your learning roadmap</span>
                <h2>From curious to capable.</h2>
              </div>
              <span className={styles.roadmapMark}>
                <FiLayers aria-hidden="true" />
              </span>
            </div>
            <div className={styles.roadmapSteps}>
              {roadmapSteps.map(({ icon, number, title, detail }) => (
                <div className={styles.roadmapStep} key={number}>
                  <span className={styles.stepIcon}>{icon}</span>
                  <span className={styles.stepText}>
                    <span className={styles.stepKicker}>STEP {number}</span>
                    <strong>{title}</strong>
                    <small>{detail}</small>
                  </span>
                  {number === "03" && (
                    <span className={styles.stepCheck}>
                      <FiCheck aria-hidden="true" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.roadmapFooter}>
              <span className={styles.footerAward}>
                <FiAward aria-hidden="true" />
              </span>
              <span>
                <strong>Progress you can show</strong>
                <small>Projects, practical skills & a certificate</small>
              </span>
            </div>
          </div>
          <Link
            to="/skill-lab/certificateVerification"
            className={styles.verifyLink}
          >
            <FiAward aria-hidden="true" />
            <span>Already trained with us?</span>
            <strong>Verify your certificate</strong>
            <FiArrowRight className={styles.verifyArrow} aria-hidden="true" />
          </Link>
        </Motion.aside>
      </div>
    </section>
  );
}
