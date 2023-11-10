import mongoose from "mongoose";
import Question from "./question.model.js";

const quizSchema = new mongoose.Schema({
  title: {type: String, default: "Anonym quiz"},
  uid: {type: String, required: true },
  created_at: {type: Date, default: Date.now},
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
});

quizSchema.statics.deleteQuizAndQuestions = async function (quizId) {
  try {
    const quizToDelete = await this.findById(quizId).populate('questions').exec();
    if (!quizToDelete) {
      throw new Error('Quiz not found');
    }

    // Delete each associated question
    for (const questionId of quizToDelete.questions) {
      await Question.findByIdAndDelete(questionId);
    }

    // Delete the quiz
    await this.deleteOne({ _id: quizId });
    return true;
  } catch (error) {
    throw error;
  }
};

export default mongoose.model('Quiz', quizSchema);