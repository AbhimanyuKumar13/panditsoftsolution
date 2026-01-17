import { motion } from "framer-motion";
import styles from "./Why.module.css";
import { fadeUp } from "../../../../animations";

export default function Why() {
  return (
    <section className={styles.why}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h2>Why SkillLab Exists</h2>
        <p>
          Colleges teach subjects. Tutorials teach syntax.
          Industry expects engineers who can solve unclear problems,
          collaborate with teams, and handle real constraints.
        </p>
        <p>
          SkillLab exists to close this gap using real development workflows,
          not classroom-style teaching.
        </p>
      </motion.div>
    </section>
  );
}
