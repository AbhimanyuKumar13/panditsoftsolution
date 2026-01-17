import { motion } from "framer-motion";
import styles from "./Audience.module.css";
import { fadeUp } from "../../../../animations";

export default function Audience() {
  return (
    <section className={styles.audience}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>Who This Is For</h2>
        <ul>
          <li>CS / IT students (2nd year onwards)</li>
          <li>Fresh graduates confused after learning many technologies</li>
          <li>Self-taught developers stuck in tutorial loops</li>
        </ul>

        <p className={styles.note}>
          ❌ Not for people looking for shortcuts, fake certificates,
          or guaranteed placements.
        </p>
      </motion.div>
    </section>
  );
}
