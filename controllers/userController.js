import { Op } from 'sequelize';
import User from '../models/User.js';

class UserController {
  
  // Create or update user from Google login data
  static async handleGoogleLogin(req, res) {
    try {
      const googleData = req.body; // Your Google login data
      console.log('googleData:', googleData);
      const clientIP = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent');

      const userData = {
        google_sub: googleData.sub,
        email: googleData.email,
        name: googleData.name,
        profile_picture: googleData.picture,
        login_provider: 'google',
        last_login_at: new Date(),
        login_ip: clientIP,
        user_agent: userAgent
      };

      const whereClause = {
        [Op.or]: [
          { google_sub: googleData.sub },
          { email: googleData.email }
        ]
      };

      console.log('whereClause:', JSON.stringify(whereClause, null, 2));

      // Try to find existing user by google_sub or email
      let user = await User.findOne({ where: whereClause });

      if (user) {
        // Update existing user
        await user.update({
          last_login_at: new Date(),
          login_ip: clientIP,
          user_agent: userAgent,
          name: googleData.name, // Update name in case it changed
          profile_picture: googleData.picture // Update picture in case it changed
        });
        
        console.log('User updated:', user.user_id);
      } else {
        // Create new user
        user = await User.create(userData);
        console.log('New user created:', user.user_id);
      }

      res.status(200).json({
        success: true,
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          profile_picture: user.profile_picture
        }
      });

    } catch (error) {
      console.error('Error handling Google login:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process user login'
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;
      
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['google_sub', 'login_ip', 'user_agent'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  // Get user by email
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['google_sub', 'login_ip', 'user_agent'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Error fetching user by email:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user'
      });
    }
  }

  // Update user profile
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated via this endpoint
      const { user_id, google_sub, created_at, ...allowedUpdates } = updateData;

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update(allowedUpdates);

      res.status(200).json({
        success: true,
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          profile_picture: user.profile_picture
        }
      });

    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  }

  // Deactivate user
  static async deactivateUser(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({ is_active: false });

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully'
      });

    } catch (error) {
      console.error('Error deactivating user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate user'
      });
    }
  }
}

export default UserController;