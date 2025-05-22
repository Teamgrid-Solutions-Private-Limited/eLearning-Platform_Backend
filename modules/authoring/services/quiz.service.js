const Quiz = require('../models/quiz.model');
const Lesson = require('../models/lesson.model');
const { NotFoundError, AuthorizationError } = require('../../../shared/errors');

class QuizService {
  async createQuiz(data, authorId) {
    const quiz = await Quiz.create({
      ...data,
      author: authorId
    });

    // If quiz is associated with a lesson, update the lesson
    if (data.lesson) {
      await Lesson.findByIdAndUpdate(data.lesson, {
        $push: { quizzes: quiz._id }
      });
    }

    return quiz;
  }

  async getQuizById(quizId) {
    const quiz = await Quiz.findById(quizId)
      .populate('questions')
      .populate('author', 'name email');

    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    return quiz;
  }

  async getQuizzesByLesson(lessonId) {
    return Quiz.find({ lesson: lessonId })
      .populate('questions')
      .populate('author', 'name email')
      .sort('createdAt');
  }

  async updateQuiz(quizId, data, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to update this quiz');
    }

    Object.assign(quiz, data);
    await quiz.save();
    return quiz;
  }

  async deleteQuiz(quizId, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to delete this quiz');
    }

    // Remove quiz reference from lesson
    if (quiz.lesson) {
      await Lesson.findByIdAndUpdate(quiz.lesson, {
        $pull: { quizzes: quizId }
      });
    }

    await quiz.remove();
  }

  async addQuestion(quizId, questionData, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to add questions to this quiz');
    }

    // Add question to quiz
    quiz.questions.push(questionData);
    await quiz.save();

    return quiz;
  }

  async updateQuestion(quizId, questionId, questionData, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to update questions in this quiz');
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      throw new NotFoundError('Question not found');
    }

    Object.assign(question, questionData);
    await quiz.save();

    return quiz;
  }

  async deleteQuestion(quizId, questionId, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to delete questions from this quiz');
    }

    quiz.questions.pull(questionId);
    await quiz.save();

    return quiz;
  }

  async reorderQuestions(quizId, questionIds, authorId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    if (quiz.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to reorder questions in this quiz');
    }

    // Verify all questions belong to the quiz
    const questions = quiz.questions.filter(q => questionIds.includes(q._id.toString()));
    if (questions.length !== questionIds.length) {
      throw new NotFoundError('One or more questions not found or do not belong to this quiz');
    }

    // Reorder questions
    quiz.questions = questionIds.map(id => 
      quiz.questions.find(q => q._id.toString() === id)
    );

    await quiz.save();
    return quiz;
  }

  async getQuizResults(quizId, userId) {
    const quiz = await Quiz.findById(quizId)
      .populate('questions')
      .populate('results.user', 'name email');

    if (!quiz) {
      throw new NotFoundError('Quiz not found');
    }

    // Get user's results
    const userResults = quiz.results.filter(r => r.user._id.toString() === userId);
    
    return {
      quizId,
      totalAttempts: userResults.length,
      results: userResults.map(result => ({
        attemptId: result._id,
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        passed: result.passed,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
        answers: result.answers
      }))
    };
  }
}

module.exports = new QuizService(); 