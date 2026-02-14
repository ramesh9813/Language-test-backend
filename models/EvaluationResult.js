import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const EvaluationResult = db.define('EvaluationResult', {
  // Primary Key
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },

  // Foreign Key - Links to user or test taker
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Allow anonymous tests
    references: {
      model: 'users', // Assumes you have a Users table
      key: 'user_id'
    },
    comment: 'Links to the user who took the test'
  },

  // Test Metadata
  testDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Timestamp when the test was taken'
  },

  testCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Sequential test number for this user'
  },

  averageSpeed: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Words per minute or typing speed'
  },

  timeTaken: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total duration of the test in seconds'
  },

  contentId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Reference to the passage or content evaluated'
  },

  // Individual Evaluation Scores (0-9) - Each parameter stored separately
  grammaticalScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Grammar evaluation score'
  },

  contextAwarenessScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Context awareness evaluation score'
  },

  coherenceScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Coherence evaluation score (separate from cohesion)'
  },

  cohesionScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Cohesion evaluation score (separate from coherence)'
  },

  clarityScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Clarity evaluation score (separate from conciseness)'
  },

  concisenessScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Conciseness evaluation score (separate from clarity)'
  },

  styleScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Style evaluation score (separate from tone)'
  },

  toneScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Tone evaluation score (separate from style)'
  },

  spellingScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Spelling evaluation score (separate from punctuation)'
  },

  punctuationScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Punctuation evaluation score (separate from spelling)'
  },

  vocabularyScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Vocabulary evaluation score (separate from word choice)'
  },

  wordChoiceScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Word choice evaluation score (separate from vocabulary)'
  },

  readabilityScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Readability evaluation score (separate from flow)'
  },

  flowScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Flow evaluation score (separate from readability)'
  },

  formattingScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Formatting evaluation score (separate from structure)'
  },

  structureScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Structure evaluation score (separate from formatting)'
  },

  consistencyScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Consistency evaluation score (separate from accuracy)'
  },

  accuracyScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Accuracy evaluation score (separate from consistency)'
  },

  overallScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: { min: 0, max: 9 },
    comment: 'Overall evaluation score'
  },

  // AI Response Data
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI feedback about the writing'
  },

  strengths: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of identified strengths'
  },

  improvements: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of suggested improvements'
  },

  improvedVersion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI-corrected version of the text'
  },

  rewrittenVersion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI-rewritten version of the text'
  },

  originalText: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Original text that was evaluated'
  },

  // Optional Metadata Fields
  testLevel: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    allowNull: true,
    comment: 'Difficulty level of the test'
  },

  deviceType: {
    type: DataTypes.ENUM('DESKTOP', 'MOBILE', 'TABLET', 'OTHER'),
    allowNull: true,
    comment: 'Device used for the test'
  },

  languageUsed: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: 'EN',
    comment: 'Language code (e.g., EN, JP, FR)'
  },

  // AI Model Information
  aiModel: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'AI model used for evaluation'
  },

  aiService: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'AI service provider (OpenRouter, Gemini, etc.)'
  },

  // Additional Metadata
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'IP address of the test taker (for analytics)'
  },

  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Browser user agent (for device detection)'
  },

  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Session identifier for tracking'
  }
}, {
  // Model options
  tableName: 'evaluation_results',
  timestamps: true, // Adds createdAt and updatedAt
  underscored: true, // Use snake_case for column names
  paranoid: false, // Set to true if you want soft deletes
  
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['test_date_time']
    },
    {
      fields: ['overall_score']
    },
    {
      fields: ['test_level']
    },
    {
      fields: ['language_used']
    },
    {
      fields: ['user_id', 'test_date_time']
    }
  ],

  // Hooks
  hooks: {
    beforeCreate: async (evaluation, options) => {
      // Auto-calculate test count for user
      if (evaluation.userId) {
        const count = await EvaluationResult.count({
          where: { userId: evaluation.userId }
        });
        evaluation.testCount = count + 1;
      }
    }
  }
});

// Class methods
EvaluationResult.getAverageScores = async function(userId, timeframe = 30) {
  const whereClause = {
    testDateTime: {
      [db.Sequelize.Op.gte]: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
    }
  };
  
  if (userId) {
    whereClause.userId = userId;
  }

  return await this.findAll({
    where: whereClause,
    attributes: [
      [db.Sequelize.fn('AVG', db.Sequelize.col('overall_score')), 'avgOverallScore'],
      [db.Sequelize.fn('AVG', db.Sequelize.col('grammatical_score')), 'avgGrammaticalScore'],
      [db.Sequelize.fn('AVG', db.Sequelize.col('clarity_score')), 'avgClarityScore'],
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'totalTests']
    ],
    raw: true
  });
};

// Instance methods
EvaluationResult.prototype.getScoreSummary = function() {
  return {
    overall: this.overallScore,
    writing: {
      grammatical: this.grammaticalScore,
      clarity: this.clarityScore,
      coherence: this.coherenceScore,
      style: this.styleScore,
      vocabulary: this.vocabularyScore
    },
    technical: {
      spelling: this.spellingScore,
      punctuation: this.punctuationScore,
      formatting: this.formattingScore,
      structure: this.structureScore
    }
  };
};

export default EvaluationResult;

