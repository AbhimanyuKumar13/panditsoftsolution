import { motion } from "framer-motion";
import styles from "./Owner.module.css";
import { owners } from "../../../../data/OWNER/Owners.data";

const Owner = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>The Team</h2>
        <p>Three engineers. One shared goal — build software that lasts.</p>
      </header>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {owners.map((owner, i) => (
          <motion.div
            key={owner.id}
            className={styles.card}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
          >
            <div className={styles.avatarWrap}>
              <img src={owner.image} alt={owner.name} />
            </div>
            <div className={styles.info}>
              <h3>{owner.name}</h3>
              <span className={styles.role}>{owner.role}</span>
              {owner.bio && <p className={styles.bio}>{owner.bio}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Owner;