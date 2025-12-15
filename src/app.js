require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const membershipRoutes = require("./routes/routes");

const app = express();

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
