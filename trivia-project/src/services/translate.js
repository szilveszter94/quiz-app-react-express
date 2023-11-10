export const translateText = async (quiz, language) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v2/quiz/translate?lan=${language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      }
    );
    if (response.ok) {
      const json = await response.json();
      return { ok: true, data: json };
    } else {
      return { message: "Quiz translate failed" };
    }
  } catch (error) {
    return {
      message: "Quiz translate failed, the server not responding.",
    };
  }
};
