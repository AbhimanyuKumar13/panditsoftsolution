import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { fadeUp } from "../../../../animations";
import {Link} from 'react-router-dom';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <h1>
          Industry Doesn’t Need More Theory.
          <span> It Needs Builders.</span>
        </h1>

        <p>
          SkillLab trains students to think, build, debug, and ship
          real software — not just pass exams.
        </p>

        <div className={styles.actions}>
          <Link to="/contact" className={styles.primary}>Apply for Training</Link> 
        </div>
      </motion.div>
    </section>
  );
}
