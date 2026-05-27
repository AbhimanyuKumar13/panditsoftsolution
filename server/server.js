import dotenv from "dotenv";
dotenv.config();    

import express from "express";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contact.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import confirmationLetterRoutes from "./routes/confirmationLetter.routes.js";
import syncCertificateSeeds from "./data/syncCertificateSeeds.js";
import syncConfirmationLetterSeeds from "./data/syncConfirmationLetterSeeds.js";
 
import cors from "cors";   

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/confirmation-letters", confirmationLetterRoutes);

app.get("/", (req, res) => {
  res.send("PanditSoftSolution API running");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await syncCertificateSeeds();
    await syncConfirmationLetterSeeds();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
