import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import styles from "./Hero.module.css";
import summerTrainingPoster from "../../../../assets/images/training/summerTraining.png";

const quickPoints = [
  {
    icon: FiClock,
    label: "45 Days Summer Training",
  },
  {
    icon: FiTrendingUp,
    label: "6 Months Career Tracks",
  },
  {
    icon: FiAward,
    label: "Certificate + Live Projects",
  },
];

const programs = [
  "Frontend Development",
  "Backend Development",
  "Python Development",
  "Data Analytics",
  "UI/UX Design",
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.shell}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className={styles.topBadges}>
            <span>Summer Training 2026</span>
            <span>Industrial Training</span>
          </div>

          <h1>
            Industrial training for college students with{" "}
            <span>45-day summer batches</span> and{" "}
            <span>6-month career tracks</span>.
          </h1>

          <p>
            Hands-on, practical, and job-focused training designed to help
            students build real skills, real projects, and stronger placement
            confidence.
          </p>

          <div className={styles.heroBanner}>
            <strong>45 Days</strong>
            <span>Hands-on | Practical | Job-Focused</span>
          </div>

          <div className={styles.programPills}>
            {programs.map((program) => (
              <span key={program}>{program}</span>
            ))}
          </div>

          <div className={styles.actions}>
            <a href="#training-programs" className={styles.primary}>
              Explore Programs
              <FiArrowRight aria-hidden="true" />
            </a>
            <Link to="/contact" className={styles.secondary}>
              Enroll Now
            </Link>
          </div>

          <div className={styles.quickGrid}>
            {quickPoints.map(({ icon: Icon, label }) => (
              <div key={label} className={styles.quickCard}>
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.posterWrap}
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        >
          <div className={styles.posterCard}>
            <img
              src={summerTrainingPoster}
              alt="Pandit Soft Solution Summer Training 2026 poster"
            />
          </div>
          <div className={styles.posterNote}>
            <span>Built around the current summer training campaign</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
