/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import "./QuickPlay.css";
import { ActualQuizContext } from "../../contexts/quizContext";
import Forbidden from "../../components/Forbidden/Forbidden";
import { questionCategories } from "../../utils/categories";
import { Link } from "react-router-dom";
import { editUserProfile } from "../../utils/firebase/firebase.utils";
import { UserContext } from "../../contexts/userContext";
import { useLocation, useNavigate } from "react-router-dom";
import { postQuiz } from "../../services/fetchQuiz";

const timeOut = 20;

const QuickPlay = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeOut);
  const [feedback, setFeedback] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const { actualQuiz } = useContext(ActualQuizContext);
  const [percentage, setPercentage] = useState(false);
  const { currentUser } = useContext(UserContext);
  const [gameType, setGameType] = useState("");
  const [gameMode, setGameMode] = useState("")
  const [onSave, setOnSave] = useState(false);
  const [title, setTitle] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  const navigate = useNavigate();



  //timer countdown
  useEffect(() => {
    const timer = setInterval(async () => {
      if (timeLeft > 0 && !isAnswerSelected) {
        setTimeLeft(timeLeft - 1);
        if (currentQuestionIndex === actualQuiz.length - 1 && timeLeft === 1) {
          setPercentage(((score * 100) / actualQuiz.length).toFixed(0));
          setIsGameOver(true);
          if (currentUser && gameMode === "ranked") {
            await editUserProfile(currentUser, "quizzes_completed");
          }
        }
      } else {
        clearInterval(timer);
        if (!isAnswerSelected) {
          const currentDifficulty = actualQuiz[currentQuestionIndex].difficulty
          const rankPoints = currentDifficulty === "hard" ? 8 : currentDifficulty === "medium" ? 5 : 1
          if (currentUser && gameMode === "ranked") {
            await editUserProfile(currentUser, "false_answers", rankPoints);
          }
          setTimeout(() => {
            handleTimeout();
          }, 2000);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswerSelected]);

  useEffect(() => {
    const increaseQuizzesPlayed = async () => {
      const currentGameMode = searchParams.get("gamemode")
      if (currentUser && currentGameMode === "ranked") {
        await editUserProfile(currentUser, "quizzes_played");
      }
      setGameMode(currentGameMode);
      setGameType(searchParams.get("gametype"));
    };
    increaseQuizzesPlayed();
  }, []);

  //moves to next question if timer hits 0 and resets everytyhing
  const handleTimeout = () => {
    if (currentQuestionIndex < actualQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerSelected(false);
      setTimeLeft(timeOut);
      setFeedback("");
      setShuffledAnswers(
        shuffleAnswers(
          actualQuiz[currentQuestionIndex + 1].correct_answer,
          actualQuiz[currentQuestionIndex + 1].incorrect_answers
        )
      );
    }
  };

  //fisher-yates algorithm for mixing answers
  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }

    return allAnswers;
  };

  const saveOnlineQuiz = async (event) => {
    event.preventDefault();
    const response = await postQuiz(actualQuiz, currentUser, title);
    if (response.ok) {
      alert(response.message);
      navigate("/");
    } else {
      alert(response.message);
    }
  }

  const showForm = () => {
    setOnSave(true);
  }

  // Answers conditions if correct or not/////scoring/////reset timer every next question
  const handleAnswerClick = async (answer) => {
    const index = shuffledAnswers.findIndex(
      (question) => question === actualQuiz[currentQuestionIndex].correct_answer
    );
    const correct = answer === actualQuiz[currentQuestionIndex].correct_answer;
    const currentScore = correct ? score + 1 : score;
    const currentDifficulty = actualQuiz[currentQuestionIndex].difficulty

    if (correct) {
      setScore(currentScore);
      if (currentUser && gameMode === "ranked") {
      const rankPoints = currentDifficulty === "hard" ? 10 : currentDifficulty === "medium" ? 7 : 3
        await editUserProfile(currentUser, "good_answers", rankPoints);  
      }
    } else {
      if (currentUser && gameMode === "ranked") {
        const rankPoints = currentDifficulty === "hard" ? 8 : currentDifficulty === "medium" ? 5 : 1
        await editUserProfile(currentUser, "false_answers", rankPoints);
      }
    }
    setFeedback(index);
    setIsAnswerSelected(true);

    if (currentQuestionIndex < actualQuiz.length - 1) {
      setTimeout(() => {
        handleTimeout();
      }, 2000);
    } else {
      setPercentage(((currentScore * 100) / actualQuiz.length).toFixed(0));
      setIsGameOver(true);
      if (currentUser && gameMode === "ranked") {
        await editUserProfile(currentUser, "quizzes_completed");
      }

    }
  };

  useEffect(() => {
    //mixing the order of answers when new question loaded
    if (actualQuiz.length > 0) {
      setShuffledAnswers(
        shuffleAnswers(
          actualQuiz[currentQuestionIndex].correct_answer,
          actualQuiz[currentQuestionIndex].incorrect_answers
        )
      );
    }
  }, [actualQuiz, currentQuestionIndex]);

  return (
    <>
      {actualQuiz ? (
        <div className="main pt-5">
          <div className="text-center content mt-4">
            <div className="container">
              <div className="timer-score mb-4">
                <div>
                  {isGameOver ? (
                    <h1 className="text-info">You've Finished The Quiz!</h1>
                  ) : timeLeft === 0 ? (
                    <h1 className="text-danger">Time Out!</h1>
                  ) : (
                    <div>
                      <h1
                        className={timeLeft < 6 ? "hurry-up text-danger" : ""}
                      >
                        Time Left: {timeLeft} seconds
                      </h1>
                    </div>
                  )}
                </div>
                <h2
                  className={
                    percentage === false
                      ? ""
                      : percentage < 40
                        ? "text-danger"
                        : percentage < 80
                          ? "text-warning"
                          : "text-success"
                  }
                >
                  {isGameOver
                    ? `Your Final Score Is: ${percentage}% (${score} / ${actualQuiz.length})`
                    : `Score: ${score} / ${actualQuiz.length}`}
                </h2>
              </div>
              {actualQuiz.length > 0 ? (
                <div className="question-container p-5">
                  <div className="question-text-container px-2 py-4">
                    <h3>
                      {actualQuiz[currentQuestionIndex].question}
                    </h3>
                  </div>
                  <div className="answers py-3 row">
                    {shuffledAnswers.map((answer, index) => (
                      <div className="col-md-6" key={index}>
                        <h3
                          onClick={() => handleAnswerClick(answer)}
                          className={`${isAnswerSelected || timeLeft === 0 ? "disabled" : ""
                            } btn answer-button p-2 my-2 ${index % 2 === 0 ? "ms-5" : "me-5"
                            } ${feedback === index ||
                              (timeLeft === 0 &&
                                answer ===
                                actualQuiz[currentQuestionIndex].correct_answer)
                              ? "correct-answer"
                              : feedback === ""
                                ? ""
                                : "incorrect-answer"
                            }`}
                        >
                          <span>{`${questionCategories[index]}:`}</span>
                          <span style={{ flex: 1 }}>{answer}</span>
                        </h3>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <h1 className="mt-5 text-center">Loading...</h1>
              )}
            </div>
            <h2 className="mt-1">
              Question {currentQuestionIndex + 1} / {actualQuiz.length}
            </h2>
            <div className="d-flex justify-content-center">
              <div className="my-4  mx-4">
                {isGameOver ? (
                  <>
                    <h2 className="lead mt-1">Go back to the Menu</h2>
                    <Link to="/">
                      <button className="btn btn-success mb-1">Menu</button>
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </div>
              {isGameOver && gameType === "online" ? (
                <div className="my-4 mx-4">
                  {onSave ? "" : <h2 className="lead mt-1">Do you want to save this game?</h2>}
                  {onSave ? <div className="row"><form onSubmit={(event) => saveOnlineQuiz(event)}>
                    <label className="form-label lead" htmlFor="title">Quiz title</label>
                    <input required value={title} onChange={(event) => setTitle(event.target.value)} className="form-control mb-3" type="text" name="title" id="title" />
                    <button type="submit" className="btn btn-success mb-5">Save</button>
                  </form></div> : ""}
                  {onSave ? "" : <button onClick={showForm} className="btn btn-success mb-5">Yes</button>}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        <Forbidden message={"Failed to load resources."} />
      )}
    </>
  );
};

export default QuickPlay;
