import { Translate } from "@google-cloud/translate/build/src/v2/index.js";
import dotenv from "dotenv";

dotenv.config();

const translateText = async (quiz, targetLanguage) => {
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const translate = new Translate({
    credentials: credentials,
    projectId: credentials.project_id,
  });
  try {
    const questions = quiz.map(async (element) => {
      const response = await translate.translate(
        element.question,
        targetLanguage
      );
      if (response) {
        return response[0];
      }
      return null;
    });

    const correctAnswers = quiz.map(async (element) => {
      const response = await translate.translate(
        element.correct_answer,
        targetLanguage
      );
      if (response) {
        return response[0];
      }
      return null;
    });

    const incorrectAnswers = quiz.map(async (element) => {
      const response = await translate.translate(
        element.incorrect_answers,
        targetLanguage
      );
      if (response) {
        return response[0];
      }
      return null;
    });

    const translatedQuestions = await Promise.all(questions);
    const translatedCorrectAnswers = await Promise.all(correctAnswers);
    const translatedIncorrectAnswers = await Promise.all(incorrectAnswers);

    quiz.forEach((item, index) => {
      quiz[index].question = translatedQuestions[index];
      quiz[index].correct_answer = translatedCorrectAnswers[index];
      quiz[index].incorrect_answers = translatedIncorrectAnswers[index];
    });

    return { ok: true, data: quiz };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default translateText;
