/* eslint-disable react/prop-types */

const questionSample = [0, 1];

const TrueFalseField = ({ questionIndex, questionData, handleChange }) => {
  return (
    <div className="mt-2 d-flex justify-content-center">
      {questionSample.map((index) => (
        <div key={index} className="mx-3">
          <input
            onChange={() =>
              handleChange(
                questionIndex,
                index === 0 ? "True" : "False",
                index === 0 ? "False" : "True"
              )
            }
            checked={
              (index === 0 && questionData.correct_answer === "True") ||
              (index === 1 && questionData.correct_answer === "False")
            }
            className="form-check-input"
            type="radio"
            name={`tradio${questionIndex}`}
            required
          />
          <label
            className="form-check-label mx-1"
            htmlFor={`tradio${questionIndex}`}
          >
            {index === 0 ? "True" : "False"}
          </label>
        </div>
      ))}
    </div>
  );
};

export default TrueFalseField;
