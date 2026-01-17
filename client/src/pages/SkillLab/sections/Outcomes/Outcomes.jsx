import { motion } from "framer-motion";
import styles from "./Outcomes.module.css";
import { fadeUp } from "../../../../animations";

export default function Outcomes() {
  return (
    <section className={styles.outcomes}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>What You Will Build</h2>
        <ul>
          <li>Backend APIs with authentication and databases</li>
          <li>Frontend apps connected to real data</li>
          <li>Git workflows: commits, PRs, reviews</li>
          <li>Deployment, debugging, and performance fixes</li>
        </ul>
      </motion.div>
    </section>
  );
}
