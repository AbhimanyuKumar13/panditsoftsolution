import { motion } from "framer-motion";
import styles from "./Owner.module.css";
import { owners } from "../../../../data/OWNER/Owners.data";

const Owner = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.box}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {owners.map((owner) => (
          <div key={owner.id} className={styles.card}>
            <div className={styles.avatarWrap}>
              <img src={owner.image} alt={owner.name} />
            </div>
            <h3>{owner.name}</h3>
            <p>{owner.role}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Owner;
