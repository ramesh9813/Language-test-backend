import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const User = db.define('User', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  google_sub: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Google user ID (sub)'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  login_provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'google'
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'en'
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false, // We're handling timestamps manually
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['google_sub']
    },
    {
      fields: ['is_active']
    }
  ]
});

export default User;