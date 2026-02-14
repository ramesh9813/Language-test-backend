import { Op } from 'sequelize';
import { getWritingEvaluation as getOpenRouterEvaluation } from '../services/openRouterService.js';
import EvaluationResult from '../models/EvaluationResult.js';

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

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const normalizeEvaluation = (raw = {}) => {
  const useLegacyScale = usesLegacyScale([
    raw.Grammatical ?? raw.grammatical,
    raw.ContextAwareness ?? raw.contextAwareness ?? raw['Context Awareness'],
    raw.Coherence ?? raw.coherence,
    raw.Cohesion ?? raw.cohesion,
    raw.Clarity ?? raw.clarity,
    raw.Conciseness ?? raw.conciseness,
    raw.Style ?? raw.style,
    raw.Tone ?? raw.tone,
    raw.Spelling ?? raw.spelling,
    raw.Punctuation ?? raw.punctuation,
    raw.Vocabulary ?? raw.vocabulary,
    raw.WordChoice ?? raw.wordChoice ?? raw['Word Choice'],
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
    ContextAwareness: normalize(raw.ContextAwareness ?? raw.contextAwareness ?? raw['Context Awareness']),
    Coherence: normalize(raw.Coherence ?? raw.coherence),
    Cohesion: normalize(raw.Cohesion ?? raw.cohesion),
    Clarity: normalize(raw.Clarity ?? raw.clarity),
    Conciseness: normalize(raw.Conciseness ?? raw.conciseness),
    Style: normalize(raw.Style ?? raw.style),
    Tone: normalize(raw.Tone ?? raw.tone),
    Spelling: normalize(raw.Spelling ?? raw.spelling),
    Punctuation: normalize(raw.Punctuation ?? raw.punctuation),
    Vocabulary: normalize(raw.Vocabulary ?? raw.vocabulary),
    WordChoice: normalize(raw.WordChoice ?? raw.wordChoice ?? raw['Word Choice']),
    Readability: normalize(raw.Readability ?? raw.readability),
    Flow: normalize(raw.Flow ?? raw.flow),
    Formatting: normalize(raw.Formatting ?? raw.formatting),
    Structure: normalize(raw.Structure ?? raw.structure),
    Consistency: normalize(raw.Consistency ?? raw.consistency),
    Accuracy: normalize(raw.Accuracy ?? raw.accuracy),
    Overall: overall,
    overallScore: overall,
    feedback: raw.feedback || '',
    strengths: toArray(raw.strengths),
    improvements: toArray(raw.improvements),
    improvedVersion: raw.improvedVersion || '',
    rewrittenVersion: raw.rewrittenVersion || ''
  };
};

const mapEvaluationRecordToPayload = (record) => {
  const evaluation = normalizeEvaluation({
    Grammatical: record.grammaticalScore,
    ContextAwareness: record.contextAwarenessScore,
    Coherence: record.coherenceScore,
    Cohesion: record.cohesionScore,
    Clarity: record.clarityScore,
    Conciseness: record.concisenessScore,
    Style: record.styleScore,
    Tone: record.toneScore,
    Spelling: record.spellingScore,
    Punctuation: record.punctuationScore,
    Vocabulary: record.vocabularyScore,
    WordChoice: record.wordChoiceScore,
    Readability: record.readabilityScore,
    Flow: record.flowScore,
    Formatting: record.formattingScore,
    Structure: record.structureScore,
    Consistency: record.consistencyScore,
    Accuracy: record.accuracyScore,
    Overall: record.overallScore,
    feedback: record.feedback,
    strengths: record.strengths,
    improvements: record.improvements,
    improvedVersion: record.improvedVersion,
    rewrittenVersion: record.rewrittenVersion
  });

  return {
    id: record.id,
    originalText: record.originalText || '',
    timestamp: record.testDateTime || record.createdAt,
    model: record.aiModel || 'unknown',
    service: record.aiService || 'OpenRouter',
    evaluation
  };
};

const saveEvaluationToDatabase = async ({ message, userId, evaluation, model, service }) => {
  return EvaluationResult.create({
    userId: userId || null,
    testDateTime: new Date(),
    originalText: message,
    aiModel: model || 'unknown',
    aiService: service || 'OpenRouter',
    grammaticalScore: evaluation.Grammatical,
    contextAwarenessScore: evaluation.ContextAwareness,
    coherenceScore: evaluation.Coherence,
    cohesionScore: evaluation.Cohesion,
    clarityScore: evaluation.Clarity,
    concisenessScore: evaluation.Conciseness,
    styleScore: evaluation.Style,
    toneScore: evaluation.Tone,
    spellingScore: evaluation.Spelling,
    punctuationScore: evaluation.Punctuation,
    vocabularyScore: evaluation.Vocabulary,
    wordChoiceScore: evaluation.WordChoice,
    readabilityScore: evaluation.Readability,
    flowScore: evaluation.Flow,
    formattingScore: evaluation.Formatting,
    structureScore: evaluation.Structure,
    consistencyScore: evaluation.Consistency,
    accuracyScore: evaluation.Accuracy,
    overallScore: evaluation.Overall,
    feedback: evaluation.feedback,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    improvedVersion: evaluation.improvedVersion,
    rewrittenVersion: evaluation.rewrittenVersion
  });
};

export const evaluateWriting = async (req, res) => {
  try {
    const { message, userId } = req.body;
    const evaluationResult = await getOpenRouterEvaluation(message);

    if (evaluationResult.success) {
      const evaluation = normalizeEvaluation(evaluationResult.data);
      let savedEvaluation = null;

      try {
        savedEvaluation = await saveEvaluationToDatabase({
          message,
          userId,
          evaluation,
          model: evaluationResult.model,
          service: 'OpenRouter'
        });
      } catch (dbError) {
        console.error('Failed to save evaluation to database:', dbError.message);
      }

      return res.status(200).json({
        message: 'Writing evaluation completed',
        evaluation,
        originalText: message,
        model: evaluationResult.model || 'unknown',
        service: 'OpenRouter',
        evaluationId: savedEvaluation?.id || null,
        timestamp: savedEvaluation?.testDateTime || new Date().toISOString()
      });
    }

    return res.status(200).json({
      message: 'Writing evaluation completed (raw response)',
      rawResponse: evaluationResult.rawResponse,
      originalText: message,
      model: evaluationResult.model || 'unknown',
      service: 'OpenRouter',
      timestamp: new Date().toISOString(),
      note: 'AI response was not in valid JSON format'
    });
  } catch (error) {
    console.error('Writing evaluation error:', error);

    if (error.type === 'API_KEY_ERROR') {
      return res.status(401).json({
        error: 'Invalid API key',
        details: 'Please check your OPENROUTER_API_KEY environment variable',
        service: 'OpenRouter'
      });
    }

    if (error.type === 'API_OVERLOADED') {
      return res.status(200).json({
        message: 'Writing evaluation completed (fallback mode)',
        evaluation: normalizeEvaluation(error.fallbackData),
        originalText: req.body.message,
        service: 'OpenRouter',
        timestamp: new Date().toISOString(),
        note: 'OpenRouter API temporarily overloaded - sample evaluation provided'
      });
    }

    if (error.type === 'API_TIMEOUT') {
      return res.status(200).json({
        message: 'Writing evaluation completed (timeout fallback)',
        evaluation: normalizeEvaluation({
          feedback: 'Evaluation timed out. Please try again with a shorter text.',
          improvements: ['Retry evaluation to get full analysis']
        }),
        originalText: req.body.message,
        model: 'timeout-fallback',
        service: 'OpenRouter',
        timestamp: new Date().toISOString(),
        note: `Request timed out before AI response (${error.message})`
      });
    }

    if (error.type === 'QUOTA_EXCEEDED') {
      return res.status(429).json({
        error: 'API quota exceeded',
        details: 'Please try again later'
      });
    }

    return res.status(500).json({
      error: 'Failed to get response from AI service',
      details: error.message || error.toString(),
      service: 'OpenRouter'
    });
  }
};

export const getTodayEvaluations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const rows = await EvaluationResult.findAll({
      where: {
        userId,
        testDateTime: {
          [Op.between]: [startOfToday, endOfToday]
        }
      },
      order: [['testDateTime', 'ASC']]
    });

    const evaluations = rows.map(mapEvaluationRecordToPayload);

    return res.status(200).json({
      date: startOfToday.toISOString().slice(0, 10),
      total: evaluations.length,
      evaluations
    });
  } catch (error) {
    console.error('Failed to fetch today evaluations:', error);
    return res.status(500).json({
      error: 'Failed to fetch today evaluations',
      details: error.message || error.toString()
    });
  }
};

export const getHistoryEvaluations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const queryOptions = {
      where: {
        userId,
      },
      order: [["testDateTime", "ASC"]],
    };

    if (startDate && endDate) {
      queryOptions.where.testDateTime = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const rows = await EvaluationResult.findAll(queryOptions);

    // Map database records to the format expected by the dashboard
    // The dashboard expects: { date: "YYYY-MM-DD", Overall: 7.6, Grammatical: 7.2, ... }
    const chartData = rows.map((record) => {
      const date = new Date(record.testDateTime || record.createdAt).toISOString().split('T')[0];
      const useLegacyScale = usesLegacyScale([
        record.grammaticalScore,
        record.contextAwarenessScore,
        record.coherenceScore,
        record.cohesionScore,
        record.clarityScore,
        record.concisenessScore,
        record.styleScore,
        record.toneScore,
        record.spellingScore,
        record.punctuationScore,
        record.vocabularyScore,
        record.wordChoiceScore,
        record.readabilityScore,
        record.flowScore,
        record.formattingScore,
        record.structureScore,
        record.consistencyScore,
        record.accuracyScore,
        record.overallScore
      ]);
      const normalize = (value) => normalizeScore(value, useLegacyScale);
      
      return {
        date,
        Grammatical: normalize(record.grammaticalScore),
        ContextAwareness: normalize(record.contextAwarenessScore),
        Coherence: normalize(record.coherenceScore),
        Cohesion: normalize(record.cohesionScore),
        Clarity: normalize(record.clarityScore),
        Conciseness: normalize(record.concisenessScore),
        Style: normalize(record.styleScore),
        Tone: normalize(record.toneScore),
        Spelling: normalize(record.spellingScore),
        Punctuation: normalize(record.punctuationScore),
        Vocabulary: normalize(record.vocabularyScore),
        WordChoice: normalize(record.wordChoiceScore),
        Readability: normalize(record.readabilityScore),
        Flow: normalize(record.flowScore),
        Formatting: normalize(record.formattingScore),
        Structure: normalize(record.structureScore),
        Consistency: normalize(record.consistencyScore),
        Accuracy: normalize(record.accuracyScore),
        Overall: normalize(record.overallScore),
      };
    });

    return res.status(200).json(chartData);
  } catch (error) {
    console.error("Failed to fetch history evaluations:", error);
    return res.status(500).json({
      error: "Failed to fetch history evaluations",
      details: error.message || error.toString(),
    });
  }
};
