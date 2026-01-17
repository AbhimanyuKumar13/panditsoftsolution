import { motion } from "framer-motion";
import styles from "./Tracks.module.css";
import { fadeUp } from "../../../../animations";

export default function Tracks() {
  return (
    <section className={styles.tracks}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>Training Tracks</h2>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Foundation Track</h3>
            <p>
              Programming mindset, tools, workflows,
              and how real engineering teams operate.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Full Stack / Backend Track</h3>
            <p>
              Build production-ready applications with
              APIs, databases, authentication, and deployment.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
