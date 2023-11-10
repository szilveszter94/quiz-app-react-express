import Navbar from "../../components/Navbar/Navbar";
import "./HomePage.css";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import Loading from "../../components/Loading/Loading";
import PlayButton from "../../components/PlayButton/PlayButton";

const HomePage = () => {
  const { currentUser, loading } = useContext(UserContext);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="main">
      <Navbar />
      <div className="content">
        <div className="container home">
          <div className="row mt-5">
            <div className="col-12 text-center home">
              <h1 className="home-page-title mb-3">Welcome to Quizzler!</h1>
              <p className="home-page-subtitle mb-5">
                Test your knowledge with our fun quizzes. Choose a category and
                start playing now!
              </p>
              <div className="play-button-container mb-5">
                <Link to="/initrandomgame">
                  <PlayButton color="primary" >{currentUser ? "Play" : "Practice"}</PlayButton>
                </Link>
              </div>
              <p className="home-page-subtitle">
                If you want to create quizzes and more, you can register for an
                account.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
