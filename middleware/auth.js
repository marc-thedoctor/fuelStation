const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send({ message: 'Acesso negado' });

  try {
    const verified = jwt.verify(token, config.secret);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: 'Token inválido' });
  }
};
