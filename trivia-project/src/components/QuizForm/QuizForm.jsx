/* eslint-disable react/prop-types */
import TrueFalseField from "../TrueFalseField/TrueFalseField";
import MultipleField from "../MultipleField/MultipleField";
import { trivia_categories } from "../../utils/categories";
import "./QuestionForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCirclePlus, faSave } from "@fortawesome/free-solid-svg-icons";

const QuizForm = ({
  handleSubmit,
  quizData,
  handleChange,
  setQuestionType,
  setBoolAnswer,
  setMultipleAnswer,
  setCorrectForMultiple,
  addQuestion,
  handleQuestionDelete,
}) => {
  return (
    <div className="container mt-3 mb-5">
      <form className="text-center" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <h3 className="form-label quiz-creator-title">
              Quiz Title
            </h3>
            <input
              type="text"
              className="form-control mb-2"
              name="title"
              value={quizData.title}
              placeholder="Quiz title here"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>
        {quizData.questions.map((questionData, questionIndex) => (
          <div key={questionIndex} className="mt-3 mb-4 rounded p-3 row question-editor-container text-light">
            <h5 className="form-label">Question {questionIndex + 1}</h5>
            <div className="col-md-12 mb-3">
              <input
                type="text"
                className="form-control me-3"
                name="question"
                onChange={(event) => handleChange(event, questionIndex)}
                required
                value={questionData.question}
                placeholder="Write a question here."
              />
            </div>
            <div className="col-md-3 mb-1">
              <label htmlFor="difficulty" className="form-label">
                Difficulty
              </label>
              <select
                onChange={(event) => handleChange(event, questionIndex)}
                value={questionData.difficulty}
                name="difficulty"
                className="form-select mb-1"
                required
              >
                <option value="" disabled>
                  Select a difficulty
                </option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="col-md-3 mb-1">
              <label className="form-label">Select type</label>
              <select
                onChange={(event) => setQuestionType(event, questionIndex)}
                value={questionData.type}
                className="form-select mb-1"
                required
              >
                <option value="" disabled>
                  Select a type
                </option>
                <option value="boolean">True/False</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div className="col-md-6 mb-1">
              <label htmlFor="category" className="form-label">
                Select Category
              </label>
              <select
                name="category"
                onChange={(event) => {
                  handleChange(event, questionIndex);
                }}
                value={questionData.category}
                className="form-select mb-1"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {trivia_categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12 mb-3">
              <div>
                {questionData.type === "boolean" ? (
                  <TrueFalseField
                    questionIndex={questionIndex}
                    questionData={questionData}
                    handleChange={setBoolAnswer}
                  />
                ) : questionData.type === "multiple" ? (
                  <MultipleField
                    questionIndex={questionIndex}
                    questionData={questionData}
                    handleChange={setMultipleAnswer}
                    setCorrectForMultiple={setCorrectForMultiple}
                  />
                ) : (
                  ""
                )}
                {quizData.questions.length > 1 ? (
                  <button
                    onClick={() => handleQuestionDelete(questionIndex)}
                    className="btn btn-sm btn-danger mt-3"
                    type="button"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="mb-5 mt-3 text-center">
          <button
            type="button"
            className="btn btn-info fw-bolder"
            onClick={addQuestion}
          >
            <FontAwesomeIcon icon={faCirclePlus} /> Add more questions
          </button>
        </div>
        <button
          onSubmit={handleSubmit}
          type="submit"
          className="btn btn-outline-info btn-lg"
        >
          <FontAwesomeIcon icon={faSave} /> Save
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
