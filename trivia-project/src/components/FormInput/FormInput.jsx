/* eslint-disable react/prop-types */
import "./FormInput.css"

const FormInput = ({ label, ...otherProps }) => {
  return (
    <div className="form-field">
      <label htmlFor={otherProps.id} className="form-label my-2">{label}</label>
      <input id={otherProps.id} className="form-control" {...otherProps} />
    </div>
  );
};

export default FormInput;
