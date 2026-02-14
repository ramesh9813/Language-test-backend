import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // upsert user
    const [user] = await User.upsert({
      google_sub: payload.sub,
      email: payload.email,
      name: payload.name,
      profile_picture: payload.picture,
      last_login_at: new Date(),
      login_ip: req.ip,
      user_agent: req.get('User-Agent'),
    }, { returning: true });

    // sign your own JWT
    const appToken = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: appToken, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

export default router;