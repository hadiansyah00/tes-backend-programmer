const service = require("../services/auth.service");

exports.register = async (req, res) =>
  res.json(await service.register(req.body));

exports.login = async (req, res) => res.json(await service.login(req.body));

exports.profile = async (req, res) => res.json(await service.profile(req.user));
