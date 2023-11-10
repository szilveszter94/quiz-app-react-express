/* eslint-disable react/prop-types */
const questionSample = [0, 1, 2, 3];

const MultipleField = ({
  questionIndex,
  handleChange,
  setCorrectForMultiple,
  questionData,
}) => {
  return (
    <div className="row">
      {questionSample.map((index) => (
        <div key={index} className="col-md-6">
          <label className="form-check-label mt-3" htmlFor={`answer${index}`}>
            {`Answer ${index + 1}`}
          </label>
          <div className="d-flex">
            <input
              className="form-check-input mx-2 mt-2"
              type="radio"
              checked={questionData.selected === index}
              name={`radio${questionIndex}`}
              required
              onChange={() => setCorrectForMultiple(questionIndex, index)}
            />
            <input
              onChange={(event) => handleChange(questionIndex, event, index)}
              className="form-control"
              type="text"
              name={`answer${index}`}
              required
              value={questionData.all_answers[index]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleField;
