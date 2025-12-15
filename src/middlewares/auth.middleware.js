const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // email dari payload
    next();
  } catch (err) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak valid atau kadaluarsa",
      data: null,
    });
  }
};
