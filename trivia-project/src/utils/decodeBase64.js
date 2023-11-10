import { decodeHTML } from "./decodeHTML";
import { translateText } from "../services/translate";

export const decodeBase64 = async (quiz, language) => {
  for (let element of quiz) {
    element.category = decodeHTML(atob(element.category));
    element.type = decodeHTML(atob(element.type));
    element.difficulty = decodeHTML(atob(element.difficulty));
    element.question = decodeHTML(atob(element.question));
    element.correct_answer = decodeHTML(atob(element.correct_answer));
    element.incorrect_answers = element.incorrect_answers.map((item) =>
      decodeHTML(atob(item))
    );
    element.selected
      ? (element.selected = decodeHTML(atob(element.selected)))
      : "";
  }
  if (language) {
    const response = await translateText(quiz, language);
    if (response.ok) {
      return response.data;
    } else {
      return quiz;
    }
  }
  return quiz;
};
