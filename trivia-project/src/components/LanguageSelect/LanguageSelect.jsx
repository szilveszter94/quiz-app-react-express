/* eslint-disable react/prop-types */
import Select from "react-select";
import { languageOptions } from "../../utils/languages";
import "./LanguageSelect.css";

const LanguageSelect = ({selectedLanguage, setSelectedLanguage}) => {
  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="text-start">
      <img className="flag-img mx-1 my-1 language-options" src={data.flag} alt={label} />
      <span className="language-options">{label}</span>
    </div>
  );

  return (
    <Select
      options={languageOptions}
      components={{
        Option: CustomOption,
      }}
      onChange={(selectedOption) => setSelectedLanguage(selectedOption)}
      value={selectedLanguage}
      className="mt-2 text-dark"
    />
  );
};

export default LanguageSelect;
