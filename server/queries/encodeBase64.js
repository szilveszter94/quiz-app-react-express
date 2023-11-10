const encodeBase64 = (quiz) => {
  for (let element of quiz) {
    element.category = btoa(element.category);
    element.type = btoa(element.type);
    element.difficulty = btoa(element.difficulty);
    element.question = btoa(element.question);
    element.correct_answer = btoa(element.correct_answer);
    element.selected = btoa(element.selected);
    element.incorrect_answers = element.incorrect_answers.map((item) =>
      btoa(item)
    );
  }
};

export default encodeBase64;
