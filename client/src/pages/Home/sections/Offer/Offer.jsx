import React from "react";
import styles from "./Offer.module.css";

const Offer = () => {
  const offers = Object.entries(import.meta.env)
    .filter(([key]) => key.startsWith("VITE_OFFER_"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  if (!offers.length) return null;

  return (
    <div className={styles.main}>
      <div className={styles.track}>
        {/* duplicate array 2 times */}
        {[...offers, ...offers].map((text, index) => (
          <span key={index} className={styles.item}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Offer;