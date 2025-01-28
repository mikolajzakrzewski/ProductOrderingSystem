const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../config/database');

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '1h';
const SALT_ROUNDS = 10; 

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

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'Password cannot be empty' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'KLIENT',
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};