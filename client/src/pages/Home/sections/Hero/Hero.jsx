import React from "react";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { Link } from "react-router-dom";

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
          Power your <span>business</span> with our <br/><span>high-performing</span> websites and apps.
        </h1>

        <p>
          At Pandit Soft Solution, we don’t just code — we design fast,
          scalable, and conversion-focused digital products that help your
          business grow online.
        </p>

        <div className={styles.actions}>
          <Link to="/contact" className={styles.primary}>
            Start Your Project →
          </Link>
          <Link to="/projects" className={styles.secondary}>
            See Our Work
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;