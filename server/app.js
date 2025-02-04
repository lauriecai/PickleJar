import "dotenv/config";
import cors from "cors";
import express from "express";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import storage from "./cloudinary/index.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());

app.use(morgan("common"));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const upload = multer({ storage });

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) =>
    console.log(`Unable to connect to server: ${error.message}`)
  );
