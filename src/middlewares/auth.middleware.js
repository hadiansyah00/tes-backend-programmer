const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Tidak ada Authorization header
  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });
  }

  // Format harus: Bearer <token>
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      status: 401,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan payload ke request
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });
  }
};
