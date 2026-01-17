import { motion } from "framer-motion";
import styles from "./Process.module.css";
import { fadeUp } from "../../../../animations";

export default function Process() {
  return (
    <section className={styles.process}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>How Training Works</h2>
        <ul>
          <li>Project-first learning approach</li>
          <li>Minimal theory, maximum execution</li>
          <li>Code reviews and debugging sessions</li>
          <li>Mentorship focused on thinking, not memorization</li>
        </ul>
      </motion.div>
    </section>
  );
}
