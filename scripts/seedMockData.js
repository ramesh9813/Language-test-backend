import db from '../config/db.js';
import User from '../models/User.js';
import EvaluationResult from '../models/EvaluationResult.js';
import { v4 as uuidv4 } from 'uuid';

const SCORE_MIN = 0;
const SCORE_MAX = 9;

const clampScore = (value) => Number(Math.min(SCORE_MAX, Math.max(SCORE_MIN, value)).toFixed(2));

const seedData = async () => {
  try {
    await db.sync(); // Ensure tables are created

    // 1. Find or create a dummy user
    let user = await User.findOne({ where: { email: 'dummy-user@example.com' } });

    if (!user) {
      console.log('Creating a new dummy user.');
      user = await User.create({
        user_id: uuidv4(),
        google_sub: `dummy-google-sub-${Date.now()}`,
        email: 'dummy-user@example.com',
        name: 'Dummy User',
        profile_picture: 'https://i.pravatar.cc/150?u=dummy-user@example.com',
      });
    } else {
        console.log('Found existing dummy user.');
    }

    console.log(`Seeding data for user: ${user.email}`);

    // 2. Clear any existing mock data for this user to avoid duplicates
    await EvaluationResult.destroy({ where: { userId: user.user_id, aiService: 'local-seed' } });
    console.log('Cleared old mock data for the user.');

    // 3. Generate 30 days of mock data
    const records = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const baseScore = 4.2 + (29 - i) * 0.12; // Starts at ~4.2 and increases
      const score = clampScore(baseScore + Math.random() * 0.5); // Add jitter, cap at 9

      const record = {
        userId: user.user_id,
        testDateTime: date,
        overallScore: score,
        grammaticalScore: clampScore(score - 0.5),
        contextAwarenessScore: clampScore(score + 0.2),
        coherenceScore: clampScore(score - 0.2),
        cohesionScore: clampScore(score + 0.1),
        clarityScore: clampScore(score + 0.3),
        concisenessScore: clampScore(score - 0.1),
        styleScore: clampScore(score),
        toneScore: clampScore(score + 0.1),
        spellingScore: clampScore(score + 0.4),
        punctuationScore: clampScore(score + 0.3),
        vocabularyScore: clampScore(score - 0.2),
        wordChoiceScore: clampScore(score - 0.1),
        readabilityScore: clampScore(score + 0.2),
        flowScore: clampScore(score + 0.1),
        formattingScore: clampScore(8.2),
        structureScore: clampScore(8.0),
        consistencyScore: clampScore(score),
        accuracyScore: clampScore(score - 0.3),
        feedback: 'This is mock feedback.',
        strengths: JSON.stringify(['Good topic coverage']),
        improvements: JSON.stringify(['Work on sentence structure']),
        improvedVersion: 'This is the mock improved version.',
        rewrittenVersion: 'This is the mock rewritten version.',
        originalText: 'This was the original text for the mock evaluation.',
        aiModel: 'mock-model-v1',
        aiService: 'local-seed',
      };

      records.push(record);
    }

    // 4. Insert records into the database
    await EvaluationResult.bulkCreate(records);

    console.log(`Successfully inserted ${records.length} mock evaluation records.`);

  } catch (error) {
    console.error('Failed to seed mock data:', error);
  } finally {
    await db.close();
  }
};

seedData();
