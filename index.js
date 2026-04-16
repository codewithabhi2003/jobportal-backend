import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import bookmarkRoute from "./routes/bookmark.route.js";

dotenv.config();

const app = express();

/* ✅ CONNECT DATABASE (SKIP IN CI / TEST) */
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

/* ✅ MIDDLEWARE */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://jobportal-frontend-ten.vercel.app",
    ],
    credentials: true,
  })
);

/* ✅ ROUTES */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/bookmark", bookmarkRoute);

/* ✅ TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ✅ EXPORT FOR VERCEL */
export default app;

/* ✅ START SERVER (ONLY IN DEV/PROD, NOT CI) */
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}