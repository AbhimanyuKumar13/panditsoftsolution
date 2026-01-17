import Contact from "../models/Contact.model.js";
import transporter from "../config/mailer.js";

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const EMAIL_USER = process.env.MAIL_USER;
  const EMAIL_RECEIVER = process.env.MAIL_RECEIVER;

  console.log(EMAIL_USER);
  console.log(EMAIL_RECEIVER);

  try {
    // Save to DB
    await Contact.create({ name, email, message });

    // Send email
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_RECEIVER,
      subject: "New Contact Enquiry",
      html: `
    <h3>New Enquiry</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Message:</b><br/>${message}</p>
  `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
