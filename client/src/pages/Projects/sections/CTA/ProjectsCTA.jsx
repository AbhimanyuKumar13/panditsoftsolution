import React from "react";
import { motion } from "framer-motion";
import styles from "./ProjectsCTA.module.css";
import {Link} from "react-router-dom"

const ProjectsCTA = () => {
  return (
    <section className={styles.cta}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2>Want to see your project here?</h2>
        <p>
          Let’s discuss how we can turn your idea into a reliable product.
        </p>
        <Link to="/contact" className={styles.button}>
          Start a Project
        </Link>
      </motion.div>
    </section>
  );
};

export default ProjectsCTA;
