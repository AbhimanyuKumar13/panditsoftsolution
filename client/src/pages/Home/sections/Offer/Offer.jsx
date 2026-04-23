import React from 'react'
import styles from "./Offer.module.css"

const Offer = () => {
  // Read offers from .env — VITE_OFFER_1, VITE_OFFER_2, ... up to any number
  // Falls back to empty array if none defined
  const offers = Object.entries(import.meta.env)
    .filter(([key]) => key.startsWith("VITE_OFFER_"))
    .sort(([a], [b]) => a.localeCompare(b))          // keep order: _1, _2, _3…
    .map(([, value]) => value);

  if (!offers.length) return null;

  const offerText = offers.join("   ✦   ");

  return (
    <div className={styles.main}>
      <div className={styles.track}>
        <p className={styles.offer}>{offerText}</p>
        <p className={styles.offer}>{offerText}</p>
      </div>
    </div>
  )
}

export default Offer
