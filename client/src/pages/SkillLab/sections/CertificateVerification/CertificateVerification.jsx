import { useState } from "react";
import { FiCheckCircle, FiHash, FiSearch, FiUser } from "react-icons/fi";
import styles from "./CertificateVerification.module.css";

const initialForm = {
  certificateNo: "",
  studentId: "",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const buildApiUrl = (pathname) => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
  return apiBaseUrl ? `${apiBaseUrl}${pathname}` : pathname;
};

const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? "Not available"
    : dateFormatter.format(parsedDate);
};

export default function CertificateVerification() {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [certificate, setCertificate] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
      setCertificate(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setMessage("");
    setCertificate(null);

    try {
      const response = await fetch(buildApiUrl("/api/certificates/verify"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setStatus("not-found");
          setMessage(data.error || "Record not found.");
          return;
        }

        throw new Error(data.error || "Unable to verify right now.");
      }

      setCertificate(data.certificate);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Unable to verify right now.");
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.kicker}>Verification</span>
          <h2>Verify student training details</h2>
          <p>
            Enter the certificate number and student ID. If the record exists
            in the database, the student details will be shown below.
          </p>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label htmlFor="certificateNo">Certificate Number</label>
              <div className={styles.inputWrap}>
                <FiHash size={18} aria-hidden="true" />
                <input
                  id="certificateNo"
                  name="certificateNo"
                  type="text"
                  value={formData.certificateNo}
                  onChange={handleChange}
                  placeholder="Enter certificate number"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="studentId">Student ID</label>
              <div className={styles.inputWrap}>
                <FiUser size={18} aria-hidden="true" />
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Searching..." : "Search"}
            <FiSearch size={18} aria-hidden="true" />
          </button>
        </form>

        {status === "success" && certificate && (
          <div className={`${styles.resultCard} ${styles.successCard}`}>
            <div className={styles.resultHeader}>
              <FiCheckCircle size={20} aria-hidden="true" />
              <strong>Record found</strong>
            </div>

            <div className={styles.resultGrid}>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Student Name</span>
                <span className={styles.detailValue}>{certificate.studentName}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Student ID</span>
                <span className={styles.detailValue}>{certificate.studentId}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Certificate No</span>
                <span className={styles.detailValue}>
                  {certificate.certificateNo}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Course</span>
                <span className={styles.detailValue}>{certificate.courseName}</span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Course Start</span>
                <span className={styles.detailValue}>
                  {formatDate(certificate.courseStartDate)}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Course End</span>
                <span className={styles.detailValue}>
                  {formatDate(certificate.courseEndDate)}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Issued On</span>
                <span className={styles.detailValue}>
                  {formatDate(certificate.issuedOn)}
                </span>
              </div>

              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{certificate.status}</span>
              </div>
            </div>
          </div>
        )}

        {status === "not-found" && (
          <div className={`${styles.resultCard} ${styles.infoCard}`}>
            <strong>Record not found</strong>
            <p>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className={`${styles.resultCard} ${styles.errorCard}`}>
            <strong>Verification unavailable</strong>
            <p>{message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
