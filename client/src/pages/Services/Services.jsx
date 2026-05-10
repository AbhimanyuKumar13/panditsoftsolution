import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiLayout,
  FiMonitor,
  FiServer,
  FiShoppingBag,
} from "react-icons/fi";
import styles from "./Services.module.css";
import { services } from "../../data/Services/List.data";
import { steps } from "../../data/Services/Process.data";
import { techGroups } from "../../data/Services/Tech.data";

const iconMap = {
  "Business Websites": FiGlobe,
  "Custom Web Applications": FiMonitor,
  "E-commerce Stores": FiShoppingBag,
  "Frontend Development": FiLayout,
  "Backend & API Development": FiServer,
  "Maintenance & Feature Support": FiActivity,
};

const Services = () => {
  return (
    <>
      <section className={styles.servicesHero}>
        <div className={styles.servicesHeroBackdrop} />

        <div className={styles.servicesHeroShell}>
          <motion.div
            className={styles.servicesHeroContent}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className={styles.servicesHeroEyebrow}>
              Web Development Services
            </span>
            <h1>
              Websites and apps built for{" "}
              <span>clarity, speed, and reliability.</span>
            </h1>
            <p>
              We build business websites, dashboards, web apps, and backend
              systems with clear scope and reliable delivery.
            </p>

            <div className={styles.servicesHeroActions}>
              <Link
                to="/Contact"
                className={styles.servicesHeroPrimaryAction}
              >
                Start a Project
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/Projects"
                className={styles.servicesHeroSecondaryAction}
              >
                View Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.servicesListSection}>
        <div className={styles.servicesListWrapper}>
          <header className={styles.servicesListHeader}>
            <span className={styles.servicesListKicker}>Service Areas</span>
            <h2>Services built around clear business needs.</h2>
            <p>
              From websites to dashboards and ongoing support, we focus on work
              that is practical and easy to maintain.
            </p>
          </header>

          <div className={styles.servicesListGrid}>
            {services.map((item, i) => (
              <motion.div
                key={item.title}
                className={styles.servicesListCardShell}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, duration: 0.42 }}
              >
                <article className={styles.servicesListBlock}>
                  <div className={styles.servicesListTop}>
                    <span className={styles.servicesListIconWrap}>
                      {React.createElement(iconMap[item.title], {
                        "aria-hidden": true,
                      })}
                    </span>

                    <div className={styles.servicesListCopy}>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>

                  <ul className={styles.servicesListPoints}>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.servicesProcessSection}>
        <div className={styles.servicesProcessWrapper}>
          <header className={styles.servicesProcessHeader}>
            <span className={styles.servicesProcessKicker}>
              Delivery Process
            </span>
            <h2>A clear process keeps the project on track.</h2>
            <p>
              Each stage is planned so progress, feedback, and delivery stay
              clear.
            </p>
          </header>

          <div className={styles.servicesProcessPath}>
            {steps.map((step, i) => (
              <motion.article
                key={step.title}
                className={styles.servicesProcessNode}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className={styles.servicesProcessMarker}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className={styles.servicesProcessContent}>
                  <span className={styles.servicesProcessFocus}>
                    {step.focus}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.servicesTechSection}>
        <div className={styles.servicesTechWrapper}>
          <div className={styles.servicesTechHeader}>
            <span className={styles.servicesTechKicker}>
              Technology Choices
            </span>
            <h2>Technology should fit the product.</h2>
            <p>
              We choose tools based on project needs, performance, and
              long-term support.
            </p>
          </div>

          <div className={styles.servicesTechList}>
            {techGroups.map((group) => (
              <article key={group.title} className={styles.servicesTechGroup}>
                <div className={styles.servicesTechGroupHeader}>
                  <h3>{group.title}</h3>
                  <p>{group.desc}</p>
                </div>

                <ul className={styles.servicesTechItems}>
                  {group.items.map((item) => (
                    <li key={item}>
                      <FiCheckCircle aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.servicesCtaSection}>
        <motion.div
          className={styles.servicesCtaInner}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className={styles.servicesCtaCopy}>
            <span className={styles.servicesCtaKicker}>Ready To Build</span>
            <h2>Need a website, web app, or system for your business?</h2>
            <p>
              Share your requirements and we will suggest the right approach.
            </p>
          </div>

          <div className={styles.servicesCtaActions}>
            <Link to="/Contact" className={styles.servicesCtaButton}>
              Start a Project
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Services;
