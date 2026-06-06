import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  console.log(`Login attempt: ${email} as ${role}`);

  // Simple mock authentication
  if (email && password) {
    res.status(200).json({
      message: 'Login successful',
      user: { email, role },
      token: 'mock-jwt-token-parkoptima'
    });
  } else {
    res.status(400).json({ message: 'Email and password are required' });
  }
});

app.listen(PORT, () => console.log(`🚀 ParkOptima Auth Server running on http://localhost:${PORT}`));