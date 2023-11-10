/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useContext } from "react";
import { ActualQuizContext } from "../../contexts/quizContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteQuiz,
  fetchAllQuizFromDb,
  fethQuizById,
} from "../../services/fetchQuiz";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./QuizList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../contexts/userContext";
import LanguageSelect from "../../components/LanguageSelect/LanguageSelect";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const { setActualQuiz } = useContext(ActualQuizContext);
  const { currentUser } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAllQuizFromDb(currentUser);
      if (!response.error) {
        setQuizzes(response);
      } else {
        alert(response.message);
      }
    };
    fetchData();
  }, []);

  const handleAutoPlay = async (id) => {
    const encode = true;
    const language = selectedLanguage ? selectedLanguage.value : false;
    const response = await fethQuizById(id, encode, language);
    if (!response.error) {
      setActualQuiz(response);
      navigate("/quickplay?gametype=local");
    } else {
      alert(response.message);
    }
  };

  const handleEdit = (quizObj) => {
    navigate(`/quiz/edit/${quizObj._id}`);
  };

  const handleDelete = async (quizObj) => {
    const id = quizObj._id;
    const response = await deleteQuiz(id);
    if (response.ok) {
      alert(response.message);
      const updatedQuizArray = [...quizzes].filter((quiz) => quiz._id !== id);
      setQuizzes(updatedQuizArray);
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <div className="content container text-center">
        <div className="row mt-5 text-center">
          <div className="col-md-4"></div>
          <h2 className="display-4 quiz-list-title col-md-4">Your quizzes</h2>
          {params.type === "edit" ? (
            ""
          ) : (
            <div className="col-md-4">
              <div className="mx-5">
                <span className="game-setup-input-field-subtitle">
                  Language (Optional)
                  <LanguageSelect
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
        {quizzes.length ? (
          <div className="row m-5">
            {quizzes.map((quizObj) => (
              <div className="col-md-3" key={quizObj._id}>
                <div className="p-3 text-center quiz-item-container mb-4">
                  <h4>{quizObj.title}</h4>
                  <p className="quiz-list-questions-text">
                    {quizObj.questionsLength} questions
                  </p>
                  {params.type === "edit" ? (
                    <div>
                      <button
                        className="btn btn-sm btn-info mx-2"
                        onClick={() => handleEdit(quizObj)}
                      >
                        Edit <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(quizObj)}
                        className="btn btn-sm btn-danger mx-2"
                      >
                        Delete <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="btn btn-success play-button mb-2"
                        onClick={() => handleAutoPlay(quizObj._id)}
                      >
                        Practice
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h4 className="mt-5">
            No quizzes yet, you can create quizzes in quiz creator
          </h4>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuizList;
