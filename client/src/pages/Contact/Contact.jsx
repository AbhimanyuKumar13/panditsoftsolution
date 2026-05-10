import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMapPin, FiMail } from "react-icons/fi";
import styles from "./Contact.module.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: "easeOut", delay },
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const {
    VITE_API_BASE_URL,
    VITE_WHATSAPP_NUMBER,
    VITE_WHATSAPP_DEFAULT_MESSAGE,
    VITE_COMPANY_PHONE,
    VITE_COMPANY_EMAIL,
    VITE_COMPANY_ADDRESS,
  } = import.meta.env;

  const whatsappLink = `https://wa.me/${VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    VITE_WHATSAPP_DEFAULT_MESSAGE
  )}`;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "We review your requirements and understand your goals",
    "We clarify scope, timeline, and any technical questions",
    "You receive a clear proposal with pricing within 24 hours",
  ];

  const contactDetails = [
    {
      icon: FiPhone,
      label: "Call us",
      value: VITE_COMPANY_PHONE,
      href: `tel:${VITE_COMPANY_PHONE}`,
    },
    {
      icon: FiMail,
      label: "Email us",
      value: VITE_COMPANY_EMAIL,
      href: `mailto:${VITE_COMPANY_EMAIL}`,
    },
    {
      icon: FiMapPin,
      label: "Visit us",
      value: VITE_COMPANY_ADDRESS,
      href: null,
    },
  ].filter((item) => item.value);

  return (
    <div className={styles.page}>

      {/* Hero */}
      <motion.div className={styles.hero} {...fadeUp(0)}>
        <span className={styles.kicker}>Contact</span>
        <h1>Let's build something together</h1>
        <p>Tell us about your project and we'll respond with clear next steps within 24 hours.</p>
      </motion.div>

      <div className={styles.grid}>

        {/* LEFT — Form */}
        <motion.div className={styles.formCard} {...fadeUp(0.05)}>
          <h2>Send us a message</h2>
          <p className={styles.formSub}>
            Fill in the details and we'll get back to you shortly.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Project details</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Briefly describe what you need — type of site, key features, timeline, budget if known"
                required
              />
            </div>

            {status === "success" && (
              <p className={styles.successMsg}>
                Message sent — we'll be in touch within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p className={styles.errorMsg}>
                Something went wrong. Please try WhatsApp below.
              </p>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send message"}
            </button>

            <p className={styles.fallback}>
              If this form doesn't work, reach us on WhatsApp above.
            </p>
          </form>
        </motion.div>

        {/* RIGHT */}
        <div className={styles.right}>

          {/* WhatsApp */}
          <motion.div className={styles.waCard} {...fadeUp(0.08)}>
            <div className={styles.waInfo}>
              <span className={styles.waDot} />
              <div>
                <h3>Need a faster reply?</h3>
                <p>Chat with us directly on WhatsApp</p>
              </div>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Contact details — phone, email, address */}
          {contactDetails.length > 0 && (
            <motion.div className={styles.card} {...fadeUp(0.1)}>
              <span className={styles.cardLabel}>Reach us directly</span>
              <div className={styles.contactList}>
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className={styles.contactItem}>
                    <span className={styles.contactIcon}>
                      <Icon size={15} />
                    </span>
                    <div className={styles.contactText}>
                      <span className={styles.contactLabel}>{label}</span>
                      {href ? (
                        <a href={href} className={styles.contactValue}>
                          {value}
                        </a>
                      ) : (
                        <span className={styles.contactValue}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Steps */}
          <motion.div className={styles.card} {...fadeUp(0.14)}>
            <span className={styles.cardLabel}>What happens next</span>
            <div className={styles.steps}>
              {steps.map((text, i) => (
                <div key={i} className={styles.step}>
                  <span className={styles.stepNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.stepText}>{text}</span>
                </div>
              ))}
            </div>
            <p className={styles.note}>
              We keep the discussion focused and jargon-free — you'll always know where things stand.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;