// Simple test to verify user creation works
import User from '../models/User.js';
import db from '../config/db.js';

const testUserCreation = async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected');

    // Sync the User model
    await User.sync({ force: false });
    console.log('✅ User model synced');

    // Test creating a user with Google data
    const googleData = {
      google_sub: '107952488886218942471',
      email: 'aarkaysingh9813@gmail.com',
      name: 'game world',
      profile_picture: 'https://lh3.googleusercontent.com/a/ACg8ocLoSWMzxV8b2fZxqnZ2unhkqtmp3IXn2JoVY26urgcKj3OdS5E=s96-c',
      login_provider: 'google'
    };

    // Check if user already exists
    let user = await User.findOne({
      where: { google_sub: googleData.google_sub }
    });

    if (user) {
      console.log('✅ User already exists:', user.user_id);
      // Update last login
      await user.update({ last_login_at: new Date() });
      console.log('✅ User login updated');
    } else {
      // Create new user
      user = await User.create(googleData);
      console.log('✅ New user created:', user.user_id);
    }

    console.log('User data:', {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await db.close();
  }
};

testUserCreation();