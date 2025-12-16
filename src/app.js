require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const membershipRoutes = require("./routes/index.routes");
const db = require("./config/db");

const app = express();

/**
 * =====================================================
 * 🔐 CORS CONFIG (PRODUCTION SAFE)
 * =====================================================
 */
const allowedOrigins = [
  "https://tes-backend-programmer.railway.app", // Swagger & frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser clients (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/**
 * =====================================================
 * 🔌 Database Connection Check (Startup)
 * =====================================================
 */
(async () => {
  try {
    const result = await db.query("SELECT now()");
    console.log("✅ Database connected at:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
})();

/**
 * =====================================================
 * 🌐 Global Middlewares
 * =====================================================
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

/**
 * =====================================================
 * 📂 Static Files
 * =====================================================
 */
app.use("/uploads", express.static("uploads"));

/**
 * =====================================================
 * 🧪 Health Check
 * =====================================================
 */
app.get("/", (req, res) => {
  res.json({
    status: 0,
    message: "API running",
    env: process.env.NODE_ENV || "development",
  });
});

/**
 * =====================================================
 * 🚏 API Routes
 * =====================================================
 */
app.use("/", membershipRoutes);

/**
 * =====================================================
 * 📘 Swagger Documentation
 * =====================================================
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "API Contract SIMS PPOB",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

/**
 * =====================================================
 * ❌ 404 Handler
 * =====================================================
 */
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

/**
 * =====================================================
 * 🚨 Global Error Handler
 * =====================================================
 */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    status: err.code || 99,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

module.exports = app;
