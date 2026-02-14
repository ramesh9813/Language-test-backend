import sequelize from '../config/db.js';
import User from '../models/User.js';
import EvaluationResult from '../models/EvaluationResult.js';

const initDatabase = async () => {
  try {
    console.log('Connecting to database...');
    
    // Test connection by authenticating
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log('Synchronizing models...');
    
    // Sync all models
    await sequelize.sync({ 
      force: true, // Set to true to drop and recreate tables
    });

    console.log('✅ Database synchronized successfully');
    console.log('✅ All tables are ready');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run initialization
initDatabase();
