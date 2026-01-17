import React from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import {Link} from "react-router-dom"

const Hero = () => {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1>
          We build <span>secure</span>, <span>scalable</span> digital products
        </h1>

        <p>
          PanditSoftSolution helps startups and businesses turn ideas into
          reliable web applications — that actually gives Results.
        </p>

        <div className={styles.actions}>
          <Link to="/contact" className={styles.primary}>
            Get a Free Consultation
          </Link>
          <Link to="/projects" className={styles.secondary}>
            View Work
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
