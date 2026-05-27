import { useState } from "react";
import {
  FiCheckCircle,
  FiFileText,
  FiHash,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import styles from "./CertificateVerification.module.css";

const initialCertificateForm = {
  certificateNo: "",
  studentId: "",
};

const initialConfirmationForm = {
  referenceNo: "",
  candidateName: "",
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

const formatValue = (value) => {
  if (value === null || value === undefined) {
    return "Not available";
  }

  if (typeof value === "string") {
    return value.trim() || "Not available";
  }

  return value;
};

const VerificationResult = ({ details, message, status }) => {
  if (status === "success") {
    return (
      <div className={`${styles.resultCard} ${styles.successCard}`}>
        <div className={styles.resultHeader}>
          <FiCheckCircle size={20} aria-hidden="true" />
          <strong>Record found</strong>
        </div>

        <div className={styles.resultGrid}>
          {details.map(({ label, value }) => (
            <div className={styles.detailBlock} key={label}>
              <span className={styles.detailLabel}>{label}</span>
              <span className={styles.detailValue}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className={`${styles.resultCard} ${styles.infoCard}`}>
        <strong>Record not found</strong>
        <p>{message}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`${styles.resultCard} ${styles.errorCard}`}>
        <strong>Verification unavailable</strong>
        <p>{message}</p>
      </div>
    );
  }

  return null;
};

export default function CertificateVerification() {
  const [certificateForm, setCertificateForm] = useState(initialCertificateForm);
  const [certificateStatus, setCertificateStatus] = useState("idle");
  const [certificateMessage, setCertificateMessage] = useState("");
  const [certificate, setCertificate] = useState(null);

  const [confirmationForm, setConfirmationForm] = useState(
    initialConfirmationForm
  );
  const [confirmationStatus, setConfirmationStatus] = useState("idle");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationLetter, setConfirmationLetter] = useState(null);

  const resetCertificateState = () => {
    setCertificateStatus("idle");
    setCertificateMessage("");
    setCertificate(null);
  };

  const resetConfirmationState = () => {
    setConfirmationStatus("idle");
    setConfirmationMessage("");
    setConfirmationLetter(null);
  };

  const handleCertificateChange = (event) => {
    const { name, value } = event.target;

    setCertificateForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (certificateStatus !== "idle") {
      resetCertificateState();
    }
  };

  const handleConfirmationChange = (event) => {
    const { name, value } = event.target;

    setConfirmationForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (confirmationStatus !== "idle") {
      resetConfirmationState();
    }
  };

  const submitVerification = async ({
    endpoint,
    formData,
    resultKey,
    setMessage,
    setResult,
    setStatus,
  }) => {
    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 404) {
          setStatus("not-found");
          setMessage(data.error || "Record not found.");
          return;
        }

        throw new Error(data.error || "Unable to verify right now.");
      }

      setResult(data[resultKey] || null);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Unable to verify right now.");
    }
  };

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();

    if (certificateStatus === "loading") {
      return;
    }

    await submitVerification({
      endpoint: "/api/certificates/verify",
      formData: certificateForm,
      resultKey: "certificate",
      setMessage: setCertificateMessage,
      setResult: setCertificate,
      setStatus: setCertificateStatus,
    });
  };

  const handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    if (confirmationStatus === "loading") {
      return;
    }

    await submitVerification({
      endpoint: "/api/confirmation-letters/verify",
      formData: confirmationForm,
      resultKey: "confirmationLetter",
      setMessage: setConfirmationMessage,
      setResult: setConfirmationLetter,
      setStatus: setConfirmationStatus,
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.kicker}>Verification</span>
          <h2>Verify Skill Lab documents</h2>
          <p>
            Search certificates and confirmation letters issued through Skill
            Lab. Enter the matching details below to verify the student record.
          </p>
        </div>

        <div className={styles.stack}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <span className={styles.panelIcon}>
                  <FiCheckCircle size={18} aria-hidden="true" />
                </span>
                <h3>Certificate Verification</h3>
              </div>
              <p>
                Enter the certificate number and student ID to verify the final
                training certificate.
              </p>
            </div>

            <form className={styles.formCard} onSubmit={handleCertificateSubmit}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label htmlFor="certificateNo">Certificate Number</label>
                  <div className={styles.inputWrap}>
                    <FiHash size={18} aria-hidden="true" />
                    <input
                      id="certificateNo"
                      name="certificateNo"
                      type="text"
                      value={certificateForm.certificateNo}
                      onChange={handleCertificateChange}
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
                      value={certificateForm.studentId}
                      onChange={handleCertificateChange}
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
                disabled={certificateStatus === "loading"}
              >
                {certificateStatus === "loading" ? "Searching..." : "Search"}
                <FiSearch size={18} aria-hidden="true" />
              </button>
            </form>

            <VerificationResult
              status={certificateStatus}
              message={certificateMessage}
              details={
                certificate
                  ? [
                      {
                        label: "Student Name",
                        value: formatValue(certificate.studentName),
                      },
                      {
                        label: "Student ID",
                        value: formatValue(certificate.studentId),
                      },
                      {
                        label: "Certificate No",
                        value: formatValue(certificate.certificateNo),
                      },
                      {
                        label: "Course",
                        value: formatValue(certificate.courseName),
                      },
                      {
                        label: "Course Start",
                        value: formatDate(certificate.courseStartDate),
                      },
                      {
                        label: "Course End",
                        value: formatDate(certificate.courseEndDate),
                      },
                      {
                        label: "Issued On",
                        value: formatDate(certificate.issuedOn),
                      },
                      {
                        label: "Status",
                        value: formatValue(certificate.status),
                      },
                    ]
                  : []
              }
            />
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitleRow}>
                <span className={styles.panelIcon}>
                  <FiFileText size={18} aria-hidden="true" />
                </span>
                <h3>Confirmation Letter Verification</h3>
              </div>
              <p>
                Enter the reference number and candidate name to verify the
                training confirmation letter.
              </p>
            </div>

            <form className={styles.formCard} onSubmit={handleConfirmationSubmit}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label htmlFor="referenceNo">Reference Number</label>
                  <div className={styles.inputWrap}>
                    <FiHash size={18} aria-hidden="true" />
                    <input
                      id="referenceNo"
                      name="referenceNo"
                      type="text"
                      value={confirmationForm.referenceNo}
                      onChange={handleConfirmationChange}
                      placeholder="Enter reference number"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="candidateName">Candidate Name</label>
                  <div className={styles.inputWrap}>
                    <FiUser size={18} aria-hidden="true" />
                    <input
                      id="candidateName"
                      name="candidateName"
                      type="text"
                      value={confirmationForm.candidateName}
                      onChange={handleConfirmationChange}
                      placeholder="Enter candidate name"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={confirmationStatus === "loading"}
              >
                {confirmationStatus === "loading" ? "Searching..." : "Search"}
                <FiSearch size={18} aria-hidden="true" />
              </button>
            </form>

            <VerificationResult
              status={confirmationStatus}
              message={confirmationMessage}
              details={
                confirmationLetter
                  ? [
                      {
                        label: "Candidate Name",
                        value: formatValue(confirmationLetter.candidateName),
                      },
                      {
                        label: "Reference No",
                        value: formatValue(confirmationLetter.referenceNo),
                      },
                      {
                        label: "Program",
                        value: formatValue(confirmationLetter.programName),
                      },
                      {
                        label: "Technology",
                        value: formatValue(confirmationLetter.technology),
                      },
                      {
                        label: "Duration",
                        value: formatValue(confirmationLetter.durationLabel),
                      },
                      {
                        label: "Session",
                        value: formatValue(confirmationLetter.sessionYear),
                      },
                      {
                        label: "Issued On",
                        value: formatDate(confirmationLetter.issuedOn),
                      },
                      {
                        label: "Supervisor",
                        value: formatValue(confirmationLetter.supervisorName),
                      },
                      {
                        label: "Status",
                        value: formatValue(confirmationLetter.status),
                      },
                    ]
                  : []
              }
            />
          </article>
        </div>
      </div>
    </section>
  );
}
