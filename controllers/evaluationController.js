import EvaluationResult from '../models/EvaluationResult.js';
import { getWritingEvaluation } from '../services/openRouterService.js';
import { getCurrentModel } from '../services/openRouterService.js';

const SCORE_MIN = 0;
const SCORE_MAX = 9;
const LEGACY_SCORE_MAX = 100;

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : SCORE_MIN;
};

const usesLegacyScale = (values = []) => {
  return values.some((value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > SCORE_MAX + 1;
  });
};

const normalizeScore = (value, legacyScale = false) => {
  const numeric = toNumber(value);
  const scaled = legacyScale ? (numeric / LEGACY_SCORE_MAX) * SCORE_MAX : numeric;
  const bounded = Math.min(SCORE_MAX, Math.max(SCORE_MIN, scaled));
  return Number(bounded.toFixed(2));
};

const normalizeEvaluationPayload = (raw = {}) => {
  const useLegacyScale = usesLegacyScale([
    raw.Grammatical ?? raw.grammatical,
    raw.ContextAwareness ?? raw['Context Awareness'] ?? raw.contextAwareness,
    raw.Coherence ?? raw.coherence,
    raw.Cohesion ?? raw.cohesion,
    raw.Clarity ?? raw.clarity,
    raw.Conciseness ?? raw.conciseness,
    raw.Style ?? raw.style,
    raw.Tone ?? raw.tone,
    raw.Spelling ?? raw.spelling,
    raw.Punctuation ?? raw.punctuation,
    raw.Vocabulary ?? raw.vocabulary,
    raw.WordChoice ?? raw['Word Choice'] ?? raw.wordChoice,
    raw.Readability ?? raw.readability,
    raw.Flow ?? raw.flow,
    raw.Formatting ?? raw.formatting,
    raw.Structure ?? raw.structure,
    raw.Consistency ?? raw.consistency,
    raw.Accuracy ?? raw.accuracy,
    raw.Overall ?? raw.overallScore ?? raw.OverallScore
  ]);
  const normalize = (value) => normalizeScore(value, useLegacyScale);
  const overall = normalize(raw.Overall ?? raw.overallScore ?? raw.OverallScore);

  return {
    Grammatical: normalize(raw.Grammatical ?? raw.grammatical),
    ContextAwareness: normalize(raw.ContextAwareness ?? raw['Context Awareness'] ?? raw.contextAwareness),
    Coherence: normalize(raw.Coherence ?? raw.coherence),
    Cohesion: normalize(raw.Cohesion ?? raw.cohesion),
    Clarity: normalize(raw.Clarity ?? raw.clarity),
    Conciseness: normalize(raw.Conciseness ?? raw.conciseness),
    Style: normalize(raw.Style ?? raw.style),
    Tone: normalize(raw.Tone ?? raw.tone),
    Spelling: normalize(raw.Spelling ?? raw.spelling),
    Punctuation: normalize(raw.Punctuation ?? raw.punctuation),
    Vocabulary: normalize(raw.Vocabulary ?? raw.vocabulary),
    WordChoice: normalize(raw.WordChoice ?? raw['Word Choice'] ?? raw.wordChoice),
    Readability: normalize(raw.Readability ?? raw.readability),
    Flow: normalize(raw.Flow ?? raw.flow),
    Formatting: normalize(raw.Formatting ?? raw.formatting),
    Structure: normalize(raw.Structure ?? raw.structure),
    Consistency: normalize(raw.Consistency ?? raw.consistency),
    Accuracy: normalize(raw.Accuracy ?? raw.accuracy),
    Overall: overall,
    overallScore: overall,
    feedback: raw.feedback || '',
    strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
    improvements: Array.isArray(raw.improvements) ? raw.improvements : [],
    improvedVersion: raw.improvedVersion || '',
    rewrittenVersion: raw.rewrittenVersion || ''
  };
};

/**
 * Create and store a new writing evaluation
 */
export const createEvaluation = async (req, res) => {
  try {
    const { 
      message, 
      userId, 
      testLevel, 
      deviceType, 
      languageUsed,
      contentId,
      timeTaken,
      averageSpeed 
    } = req.body;

    // Get AI evaluation
    const evaluationResult = await getWritingEvaluation(message);
    
    if (!evaluationResult.success && !evaluationResult.rawResponse) {
      throw new Error('Failed to get AI evaluation');
    }

    // Get current model info
    const modelInfo = getCurrentModel();

    // Prepare data for database storage
    const evaluationData = {
      userId: userId || null,
      originalText: message,
      testLevel: testLevel?.toUpperCase(),
      deviceType: deviceType?.toUpperCase(),
      languageUsed: languageUsed || 'EN',
      contentId: contentId,
      timeTaken: timeTaken ? parseInt(timeTaken) : null,
      averageSpeed: averageSpeed ? parseFloat(averageSpeed) : null,
      aiModel: modelInfo.current,
      aiService: 'OpenRouter',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      sessionId: req.sessionID
    };
    let normalizedEvaluation = null;

    // Extract and map individual scores from AI response
    if (evaluationResult.success && evaluationResult.data) {
      normalizedEvaluation = normalizeEvaluationPayload(evaluationResult.data);

      // Map each individual parameter separately - no combining
      evaluationData.grammaticalScore = normalizedEvaluation.Grammatical;
      evaluationData.contextAwarenessScore = normalizedEvaluation.ContextAwareness;
      evaluationData.coherenceScore = normalizedEvaluation.Coherence;
      evaluationData.cohesionScore = normalizedEvaluation.Cohesion;
      evaluationData.clarityScore = normalizedEvaluation.Clarity;
      evaluationData.concisenessScore = normalizedEvaluation.Conciseness;
      evaluationData.styleScore = normalizedEvaluation.Style;
      evaluationData.toneScore = normalizedEvaluation.Tone;
      evaluationData.spellingScore = normalizedEvaluation.Spelling;
      evaluationData.punctuationScore = normalizedEvaluation.Punctuation;
      evaluationData.vocabularyScore = normalizedEvaluation.Vocabulary;
      evaluationData.wordChoiceScore = normalizedEvaluation.WordChoice;
      evaluationData.readabilityScore = normalizedEvaluation.Readability;
      evaluationData.flowScore = normalizedEvaluation.Flow;
      evaluationData.formattingScore = normalizedEvaluation.Formatting;
      evaluationData.structureScore = normalizedEvaluation.Structure;
      evaluationData.consistencyScore = normalizedEvaluation.Consistency;
      evaluationData.accuracyScore = normalizedEvaluation.Accuracy;
      evaluationData.overallScore = normalizedEvaluation.Overall;

      // Store additional AI response data
      evaluationData.feedback = normalizedEvaluation.feedback;
      evaluationData.strengths = normalizedEvaluation.strengths;
      evaluationData.improvements = normalizedEvaluation.improvements;
      evaluationData.improvedVersion = normalizedEvaluation.improvedVersion;
      evaluationData.rewrittenVersion = normalizedEvaluation.rewrittenVersion;
    } else {
      // Handle raw response - set default scores for all individual parameters
      evaluationData.grammaticalScore = 0;
      evaluationData.contextAwarenessScore = 0;
      evaluationData.coherenceScore = 0;
      evaluationData.cohesionScore = 0;
      evaluationData.clarityScore = 0;
      evaluationData.concisenessScore = 0;
      evaluationData.styleScore = 0;
      evaluationData.toneScore = 0;
      evaluationData.spellingScore = 0;
      evaluationData.punctuationScore = 0;
      evaluationData.vocabularyScore = 0;
      evaluationData.wordChoiceScore = 0;
      evaluationData.readabilityScore = 0;
      evaluationData.flowScore = 0;
      evaluationData.formattingScore = 0;
      evaluationData.structureScore = 0;
      evaluationData.consistencyScore = 0;
      evaluationData.accuracyScore = 0;
      evaluationData.overallScore = 0;
      evaluationData.feedback = 'Raw AI response - could not parse structured evaluation';
      evaluationData.strengths = [];
      evaluationData.improvements = [];
    }

    // Save to database
    console.log('Saving evaluation data:', JSON.stringify(evaluationData, null, 2));
    try {
      const savedEvaluation = await EvaluationResult.create(evaluationData);
      // Return response
      res.status(201).json({
        message: 'Evaluation created and stored successfully',
        evaluationId: savedEvaluation.id,
        evaluation: normalizedEvaluation,
        rawResponse: !evaluationResult.success ? evaluationResult.rawResponse : null,
        originalText: message,
        model: modelInfo.current,
        service: 'OpenRouter',
        testCount: savedEvaluation.testCount,
        timestamp: savedEvaluation.testDateTime
      });
    } catch (dbError) {
      console.error('❌ Database save error:', dbError);
      res.status(500).json({
        error: 'Failed to save evaluation to database',
        details: dbError.message || dbError.toString()
      });
    }

  } catch (error) {
    console.error('❌ Evaluation creation error:', error);
    
    // Handle specific error types
    if (error.type === 'API_KEY_ERROR') {
      return res.status(401).json({
        error: 'Invalid API key',
        details: 'Please check your OPENROUTER_API_KEY environment variable'
      });
    }

    if (error.type === 'API_OVERLOADED') {
      // Still try to save with fallback data
      try {
        const fallbackData = {
          userId: req.body.userId || null,
          originalText: req.body.message,
          overallScore: 0,
          // Set all individual parameters to 0 for fallback
          grammaticalScore: 0,
          contextAwarenessScore: 0,
          coherenceScore: 0,
          cohesionScore: 0,
          clarityScore: 0,
          concisenessScore: 0,
          styleScore: 0,
          toneScore: 0,
          spellingScore: 0,
          punctuationScore: 0,
          vocabularyScore: 0,
          wordChoiceScore: 0,
          readabilityScore: 0,
          flowScore: 0,
          formattingScore: 0,
          structureScore: 0,
          consistencyScore: 0,
          accuracyScore: 0,
          feedback: 'API temporarily overloaded - evaluation not completed',
          strengths: [],
          improvements: [],
          testLevel: req.body.testLevel?.toUpperCase(),
          deviceType: req.body.deviceType?.toUpperCase(),
          languageUsed: req.body.languageUsed || 'EN',
          aiModel: getCurrentModel().current,
          aiService: 'OpenRouter (Fallback)',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        };

        const savedEvaluation = await EvaluationResult.create(fallbackData);
        
        return res.status(200).json({
          message: 'Evaluation saved with fallback data',
          evaluationId: savedEvaluation.id,
          evaluation: error.fallbackData,
          note: 'API temporarily overloaded - sample evaluation provided',
          timestamp: savedEvaluation.testDateTime
        });
      } catch (dbError) {
        console.error('❌ Database error during fallback:', dbError);
      }
    }

    res.status(500).json({
      error: 'Failed to create evaluation',
      details: error.message || error.toString()
    });
  }
};

/**
 * Get evaluation by ID
 */
export const getEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evaluation = await EvaluationResult.findByPk(id);
    
    if (!evaluation) {
      return res.status(404).json({
        error: 'Evaluation not found'
      });
    }

    res.json({
      evaluation: evaluation,
      scoreSummary: evaluation.getScoreSummary()
    });

  } catch (error) {
    console.error('❌ Get evaluation error:', error);
    res.status(500).json({
      error: 'Failed to retrieve evaluation',
      details: error.message
    });
  }
};

/**
 * Get user's evaluation history
 */
export const getUserEvaluations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'testDateTime', 
      sortOrder = 'DESC',
      testLevel,
      languageUsed 
    } = req.query;

    const whereClause = { userId };
    
    if (testLevel) {
      whereClause.testLevel = testLevel.toUpperCase();
    }
    
    if (languageUsed) {
      whereClause.languageUsed = languageUsed.toUpperCase();
    }

    const offset = (page - 1) * limit;

    const { rows: evaluations, count } = await EvaluationResult.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: offset,
      attributes: { 
        exclude: ['improvedVersion', 'rewrittenVersion', 'originalText', 'userAgent'] 
      }
    });

    // Calculate statistics
    const avgScores = await EvaluationResult.getAverageScores(userId);

    res.json({
      evaluations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      },
      statistics: avgScores[0] || {},
      totalTests: count
    });

  } catch (error) {
    console.error('❌ Get user evaluations error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user evaluations',
      details: error.message
    });
  }
};

/**
 * Get evaluation analytics/statistics
 */
export const getEvaluationStats = async (req, res) => {
  try {
    const { timeframe = 30, userId } = req.query;

    // Get average scores
    const avgScores = await EvaluationResult.getAverageScores(userId, parseInt(timeframe));

    // Get score distribution
    const scoreDistribution = await EvaluationResult.findAll({
      where: {
        ...(userId && { userId }),
        testDateTime: {
          [EvaluationResult.sequelize.Op.gte]: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [EvaluationResult.sequelize.fn('COUNT', 
          EvaluationResult.sequelize.literal('CASE WHEN overall_score >= 8 THEN 1 END')), 'excellent'],
        [EvaluationResult.sequelize.fn('COUNT', 
          EvaluationResult.sequelize.literal('CASE WHEN overall_score >= 6 AND overall_score < 8 THEN 1 END')), 'good'],
        [EvaluationResult.sequelize.fn('COUNT', 
          EvaluationResult.sequelize.literal('CASE WHEN overall_score >= 4 AND overall_score < 6 THEN 1 END')), 'average'],
        [EvaluationResult.sequelize.fn('COUNT', 
          EvaluationResult.sequelize.literal('CASE WHEN overall_score < 4 THEN 1 END')), 'needsImprovement']
      ],
      raw: true
    });

    // Get test level distribution
    const levelDistribution = await EvaluationResult.findAll({
      where: {
        ...(userId && { userId }),
        testDateTime: {
          [EvaluationResult.sequelize.Op.gte]: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        'testLevel',
        [EvaluationResult.sequelize.fn('COUNT', EvaluationResult.sequelize.col('id')), 'count'],
        [EvaluationResult.sequelize.fn('AVG', EvaluationResult.sequelize.col('overall_score')), 'avgScore']
      ],
      group: ['testLevel'],
      raw: true
    });

    res.json({
      timeframe: parseInt(timeframe),
      averageScores: avgScores[0] || {},
      scoreDistribution: scoreDistribution[0] || {},
      levelDistribution
    });

  } catch (error) {
    console.error('❌ Get evaluation stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve evaluation statistics',
      details: error.message
    });
  }
};

/**
 * Delete evaluation (soft delete if paranoid is enabled)
 */
export const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evaluation = await EvaluationResult.findByPk(id);
    
    if (!evaluation) {
      return res.status(404).json({
        error: 'Evaluation not found'
      });
    }

    await evaluation.destroy();

    res.json({
      message: 'Evaluation deleted successfully',
      evaluationId: id
    });

  } catch (error) {
    console.error('❌ Delete evaluation error:', error);
    res.status(500).json({
      error: 'Failed to delete evaluation',
      details: error.message
    });
  }
};
