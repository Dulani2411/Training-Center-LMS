import express from "express";
import cors from "cors";
import courseRoutes from "./routes/courseRoutes"; 
import studentRoutes from "./routes/studentRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import materialRoutes from "./routes/materialRoutes";
import markRoutes from "./routes/markRoutes";
import { connectDB } from "./config/db"; 

import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Connect to MSSQL
connectDB();

// ✅ Routes
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/marks", markRoutes);

export default app;
