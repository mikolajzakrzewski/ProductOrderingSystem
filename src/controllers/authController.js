const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../config/database');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '1h'; // Ważność tokenu

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, SECRET_KEY, { ignoreExpiration: true });

    const newToken = jwt.sign(
      { id: payload.id, role: payload.role },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
