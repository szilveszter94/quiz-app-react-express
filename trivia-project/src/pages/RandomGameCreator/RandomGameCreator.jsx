/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import Select from "react-select";
import { trivia_categories } from "../../utils/categories";
import { ActualQuizContext } from "../../contexts/quizContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./RandomGameCreator.css";
import { fetchQuizFromOpenTDB } from "../../services/fetchQuiz";
import { UserContext } from "../../contexts/userContext";
import Loading from "../../components/Loading/Loading";
import PlayButton from "../../components/PlayButton/PlayButton";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect";

const QuestionsOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
];

const DifficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const CategoryOptions = trivia_categories.map((category) => ({
  value: category.id,
  label: category.name,
}));

const RandomGameCreator = () => {
  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] =
    useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [validate, setValidate] = useState(false);
  const { setActualQuiz } = useContext(ActualQuizContext);
  const navigate = useNavigate();
  const { currentUser, loading } = useContext(UserContext);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const fetchQuestions = async (event, ranked) => {
    const language = selectedLanguage ? selectedLanguage.value : false;
    if (selectedNumberOfQuestions) {
      const data = await fetchQuizFromOpenTDB(
        selectedCategory,
        selectedDifficulty,
        selectedNumberOfQuestions,
        language
      );
      if (!data.error) {
        setActualQuiz(data);
        if (ranked) {
          navigate("/quickplay?gametype=online&gamemode=ranked");
        } else {
          navigate("/quickplay?gametype=online");
        }
      } else {
        alert(data.message);
      }
    } else {
      setValidate(true);
    }
  };

  const handleSelect = (selectedOption) => {
    setSelectedNumberOfQuestions(selectedOption);
    setValidate(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="main">
      <Navbar />
      <div className="py-5 content">
        <div className="text-center text-light mb-4 game-setup-input-field-title">
          <h1>Game Setup</h1>
        </div>
        <div className="p-3 container setup-input-field-container text-light">
          <div className="text-center">
            {validate ? (
              <h4 className="text-danger mt-1">
                Please select the number of questions.
              </h4>
            ) : (
              ""
            )}
          </div>
          <span className="game-setup-input-field-subtitle">
            Number of questions<sup>*</sup>
            <Select
              options={QuestionsOptions}
              onChange={(selectedOption) => handleSelect(selectedOption)}
              value={selectedNumberOfQuestions}
              className="mt-2 mb-4 text-dark"
            />
          </span>
          <div className="row">
            <div className="col-md-6">
              <span className="game-setup-input-field-subtitle">
                Difficulty (Optional)
                <Select
                  options={DifficultyOptions}
                  onChange={(selectedOption) =>
                    setSelectedDifficulty(selectedOption)
                  }
                  value={selectedDifficulty}
                  className="mt-2 text-dark"
                />
              </span>
            </div>
            <div className="col-md-6">
              <span className="game-setup-input-field-subtitle">
                Language (Optional)
                <LanguageSelect
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              </span>
            </div>
          </div>
          <br />
          <span className="game-setup-input-field-subtitle">
            Categories (Optional)
            <Select
              options={CategoryOptions}
              onChange={(selectedOption) => setSelectedCategory(selectedOption)}
              value={selectedCategory}
              className="mt-2 text-dark"
            />
          </span>
          <br />
          <div className="text-center">
            <div className="row my-3">
              <div
                className={
                  currentUser
                    ? "col-md-6 align-items-center"
                    : "col-md-12 align-items-center"
                }
                onClick={(event) =>
                  fetchQuestions(event, currentUser ? true : false)
                }
              >
                <PlayButton color="primary">
                  {currentUser ? "Ranked Play" : "Practice"}
                </PlayButton>
              </div>
              {currentUser ? (
                <div className="col-md-6">
                  <div onClick={fetchQuestions}>
                    <PlayButton color="secondary">Practice</PlayButton>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RandomGameCreator;
