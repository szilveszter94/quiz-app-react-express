import express from "express";
import Question from "../db/question.model.js";
import Quiz from "../db/quiz.model.js";
import encodeBase64 from "../queries/encodeBase64.js";
import translateText from "../queries/translate.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const uid = req.query.uid;
  try {
    const quizzes = await Quiz.find({
      $or: [{ uid: uid }, { uid: "testUser" }],
    });
    if (quizzes) {
      const reducedData = quizzes.map((quiz) => {
        return {
          _id: quiz._id,
          title: quiz.title,
          questionsLength: quiz.questions.length,
        };
      });
      res.json(reducedData);
    } else {
      res.status(404).json({ message: "Quizzies not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const encode = req.query.encode;
  const quizId = req.params.id;
  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (quiz) {
      if (encode) {
        encodeBase64(quiz.questions)
      }
      res.json(quiz);
    } else {
      res.status(404).json({ message: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  const questions = body.questions;
  try {
    const createdQuestions = await Question.create(questions);
    console.log("Questions created.");
    const questionIds = createdQuestions.map((question) => question._id);

    const quiz = await Quiz.create({
      title: body.title,
      questions: questionIds,
      uid: body.uid,
    });
    if (quiz) {
      res.status(201).json({ message: "Quiz created.", ok: true });
    } else {
      res.status(404).json({ message: "Quiz not created." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.post("/translate", async (req, res) => {
  const quiz = req.body;
  const targetLanguage = decodeURIComponent(req.query.lan);
  try {
    const response = await translateText(quiz, targetLanguage);
    if (response.ok) {
      res.json(response.data);
    } else {
      res.status(404).json({ message: "Quiz not translated." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to translate" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const questions = body.questions;
  try {
    const existingQuiz = await Quiz.findById(id);
    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const removedQuestions = existingQuiz.questions.filter((quizToRemove) => {
      const quizNotRemoved = questions.find(
        (question) => question._id === quizToRemove.toString()
      );
      if (quizNotRemoved) {
        return false;
      } else {
        return true;
      }
    });
    // Delete each question, which is deleted
    await Promise.all(
      removedQuestions.map(async (removedQuestion) => {
        await Question.findByIdAndDelete(removedQuestion);
      })
    );

    // Update each question individually
    const updatedQuestions = await Promise.all(
      questions.map(async (question) => {
        if (!question._id) {
          // If it doesn't have an _id, create a new question
          const newQuestion = await Question.create(question);
          question._id = newQuestion._id; // Update the _id in the question object
        }
        const updatedQuestion = await Question.findByIdAndUpdate(
          question._id,
          { $set: question },
          { new: true }
        );
        return updatedQuestion;
      })
    );
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title: body.title,
        questions: updatedQuestions.map((question) => question._id),
      },
      { new: true }
    );
    if (updatedQuiz) {
      res.status(200).json({ message: "Quiz updated.", ok: true });
    } else {
      res.status(404).json({ message: "Quiz not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedQuiz = await Quiz.deleteQuizAndQuestions(id);
    if (deletedQuiz) {
      res.status(200).json({ message: "Quiz deleted." });
    } else {
      res.status(404).json({ message: "Quiz not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

export default router;
