require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const membershipRoutes = require("./routes/index.routes");
const db = require("./config/db");

const app = express();

/**
 * Test Database Connection (on startup)
 */
(async () => {
  try {
    const result = await db.query("SELECT now()");
    console.log("✅ Database connected at:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
})();

/**
 * Global Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Static Files (Profile Image)
 */
app.use("/uploads", express.static("uploads"));

/**
 * Routes
 */
app.use("/", membershipRoutes);

/**
 * Swagger Documentation
 */
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "API Contract SIMS PPOB",
  })
);

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    status: err.code || 99,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

module.exports = app;
