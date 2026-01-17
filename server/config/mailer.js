import dotenv from "dotenv";
dotenv.config();  
import nodemailer from "nodemailer";

console.log("MAIL_USER =", process.env.MAIL_USER);
console.log("MAIL_PASS =", process.env.MAIL_PASS ? "✔ present" : "❌ missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ Mail server error:", err);
  } else {
    console.log("✅ Mail server ready");
  }
});

export default transporter;
