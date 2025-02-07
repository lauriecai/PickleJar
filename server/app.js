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
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

import { createPost } from "./controllers/posts.js";
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

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

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

    /* SEED DATA */
    await User.insertMany(users);
    await Post.insertMany(posts);

    // await User.deleteMany();
    // await Post.deleteMany();
  })
  .catch((error) =>
    console.log(`Unable to connect to server: ${error.message}`)
  );
