const requiredEnvs = ["PORT", "JWT_SECRET", "JWT_EXPIRES_IN"];

requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ ENV ${key} is missing`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};
