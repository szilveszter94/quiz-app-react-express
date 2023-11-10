/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { postQuiz, patchQuiz } from "../../services/fetchQuiz";
import QuizForm from "../../components/QuizForm/QuizForm";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { fethQuizById } from "../../services/fetchQuiz";
import Loading from "../../components/Loading/Loading";
import { UserContext } from "../../contexts/userContext";

const questionStructure = {
  question: "",
  type: "",
  category: "",
  difficulty: "",
  all_answers: [],
  selected: false,
  incorrect_answers: [],
  correct_answer: "",
};

const QuizCreator = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    questions: [questionStructure],
  });
  const [loading, setLoading] = useState(true);
  const {currentUser} = useContext(UserContext)
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizData = async () => {
      if (id !== "new") {
        const response = await fethQuizById(id);
        if (!response.error) {
          setQuizData(response);
        } else {
          alert(response.message);
        }
      } else {
        setQuizData({
          title: "",
          questions: [questionStructure],
        });
      }
    };
    loadQuizData();
    setLoading(false);
  }, [id]);

  const handleChange = (event, questionIndex) => {
    const { name, value } = event.target;
    if (name === "title") {
      setQuizData({ ...quizData, [name]: value });
    } else if (name === "question") {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        question: value,
      };
      setQuizData({ ...quizData, questions: updatedQuestions });
    } else if (name === "difficulty" || name === "category") {
      const updatedQuestions = quizData.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            [name]: value,
          };
        }
        return question;
      });
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, questionStructure],
    });
  };

  const handleQuestionDelete = (questionIndex) => {
    const updatedQuestions = [...quizData.questions].filter(
      (item, index) => index !== questionIndex
    );
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const setCorrectForMultiple = (questionIndex, correctAnswerIndex) => {
    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedAnswers = [...question.all_answers];
        const correctAnswer = updatedAnswers.splice(correctAnswerIndex, 1);
        return {
          ...question,
          incorrect_answers: updatedAnswers,
          correct_answer: correctAnswer[0],
          selected: correctAnswerIndex,
        };
      }
      return question;
    });
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const setBoolAnswer = (questionIndex, answer, incorrectAnswer) => {
    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        return {
          ...question,
          incorrect_answers: [incorrectAnswer],
          correct_answer: answer,
          selected: true,
        };
      }
      return question;
    });
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const setMultipleAnswer = (questionIndex, event, answerIndex) => {
    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        const updatedAnswers = [...question.all_answers];
        const selected = question.selected;
        updatedAnswers[answerIndex] = event.target.value;
        if (selected || selected === 0) {
          const tempArray = [...updatedAnswers];
          const correctAnswer = tempArray.splice(selected, 1);
          return {
            ...question,
            all_answers: updatedAnswers,
            incorrect_answers: tempArray,
            correct_answer: correctAnswer[0],
          };
        }
        return {
          ...question,
          all_answers: updatedAnswers,
        };
      }
      return question;
    });
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const setQuestionType = (event, questionIndex) => {
    const newType = event.target.value;
    const updatedQuestions = quizData.questions.map((question, index) => {
      if (index === questionIndex) {
        let allAnswers;
        if (newType === "bool") {
          allAnswers = ["", ""];
        } else {
          allAnswers = ["", "", "", ""];
        }
        return {
          ...question,
          type: newType,
          all_answers: allAnswers,
          correct_answer: "",
        };
      }
      return question;
    });

    // Update the state with the updated questions array
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id !== "new") {
      const response = await patchQuiz(quizData);
      if (response.ok) {
        alert(response.message);
        navigate("/");
      } else {
        alert(response.message);
      }
    } else {
      const response = await postQuiz(quizData, currentUser);
      if (response.ok) {
        alert(response.message);
        navigate("/");
      } else {
        alert(response.message);
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="main">
          <Navbar />
          <div className="content quiz-creator-content">
            <QuizForm
              handleSubmit={handleSubmit}
              quizData={quizData}
              handleChange={handleChange}
              setQuestionType={setQuestionType}
              setBoolAnswer={setBoolAnswer}
              setMultipleAnswer={setMultipleAnswer}
              setCorrectForMultiple={setCorrectForMultiple}
              addQuestion={addQuestion}
              handleQuestionDelete={handleQuestionDelete}
            />
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default QuizCreator;
