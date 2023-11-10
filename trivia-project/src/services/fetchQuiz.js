import { decodeBase64 } from "../utils/decodeBase64";

export const fetchAllQuizFromDb = async (currentUser) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v2/quiz?uid=${currentUser.uid}`);
    if (response.ok) {
      const quizData = await response.json();
      return quizData;
    } else {
      return { error: true, message: "Quizzes not found." };
    }
  } catch (error) {
    return {
      error: true,
      message: "Cannot load quizzes, the server not responding",
    };
  }
};

export const fethQuizById = async (id, encode, language) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v2/quiz/${id}${encode ? "?encode=true" : ""}`);
    if (response.ok) {
      const quizData = await response.json();
      if (encode) {
        return decodeBase64(quizData.questions, language);
      }
      return quizData;
    } else {
      return { error: true, message: "Quiz not found." };
    }
  } catch (error) {
    return {
      error: true,
      message: "Cannot load the quiz, the server not responding.",
    };
  }
};

export const postQuiz = async (body, currentUser, newQuizTitle) => {
  if (newQuizTitle) {
    const convertedBody = body;
    convertedBody.forEach(item => {
      item.all_answers = [...item.incorrect_answers, item.correct_answer];
      item.selected = 3;
    })
    body = {title: newQuizTitle, questions: convertedBody};
  }
  try {
    body.uid = currentUser.uid;
    const response = await fetch("http://localhost:3000/api/v2/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return { ok: true, message: "Quiz created successfully." };
    } else {
      return {
        message: "Quiz create failed with status code: " + response.status,
      };
    }
  } catch (error) {
    return {
      message: "Quiz create failed, the server not responding.",
    };
  }
};

export const patchQuiz = async (body) => {
  const id = body._id;
  try {
    const response = await fetch(`http://localhost:3000/api/v2/quiz/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return { ok: true, message: "Quiz updated successfully" };
    } else {
      return {
        message: "Quiz update failed with status code: " + response.status,
      };
    }
  } catch (error) {
    return {
      message: "Quiz update failed, the server not responding.",
    };
  }
};

export const deleteQuiz = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v2/quiz/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return { ok: true, message: "Quiz deleted successfully" };
    } else {
      return {
        message: "Cannot delete this quiz. Status code: " + response.status,
      };
    }
  } catch (error) {
    return {
      message: "Quiz delete failed, the server not responding.",
    };
  }
};

export const fetchQuizFromOpenTDB = async (
  selectedCategory,
  selectedDifficulty,
  selectedNumberOfQuestions,
  selectedLanguage
) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?encode=base64&amount=${selectedNumberOfQuestions.value}${
        selectedCategory ? `&category=${selectedCategory.value}` : ""
      }${selectedDifficulty ? `&difficulty=${selectedDifficulty.value}` : ""}`
    );
    if (response.ok) {
      const data = await response.json();
      const questions = decodeBase64(data.results, selectedLanguage);
      return questions;
    } else {
      return { error: true, message: "Quiz loading failed." };
    }
  } catch (error) {
    console.log(error);
    return { error: true, message: "Internal server error." };
  }
};
