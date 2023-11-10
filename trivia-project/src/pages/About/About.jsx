/* eslint-disable react/no-unescaped-entities */
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./About.css";
import rank1 from "../../assets/ranks/rank1.png";
import rank2 from "../../assets/ranks/rank2.png";
import rank3 from "../../assets/ranks/rank3.png";
import rank4 from "../../assets/ranks/rank4.png";
import rank5 from "../../assets/ranks/rank5.png";
import rank6 from "../../assets/ranks/rank6.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfinity } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="main">
      <Navbar />
      <div className="container my-5 content">
        <h1 className="about-title mb-4">About Quizzler</h1>
        <p>
          Quizzler is your go-to platform for testing your knowledge with fun
          and challenging quizzes, featuring a competitive ranked mode.
        </p>
        <h2 className="mt-4">How it Works</h2>
        <p>
          Quizzler offers a wide range of quizzes on various topics. You can
          select a category, initiate a random quiz, and answer questions to
          assess your knowledge.
        </p>

        <h2 className="mt-4">Try a Random Quiz</h2>
        <p>
          To get started, click on the "Practice" button on the homepage. You
          will be directed to a random quiz where you can answer questions and
          decide whether you enjoy it or not.
        </p>

        <h2 className="mt-4">Register and Create Quizzes</h2>
        <p>
          If you enjoy it and wish to create your own quizzes or participate in
          a competitive environment, you can register for an account to unlock
          additional features. With an account, you can create, edit, and share
          your quizzes with your friends or strive to achieve higher ranks in
          the competitive ladder.
        </p>
        <p className="mt-4">
          Join Quizzler today and embark on an exciting journey through the
          world of quizzes!
        </p>
        <hr />
        <div className="container text-center">
          <h1 className="about-title mb-5 fs-3">Rank System</h1>
          <div className="row mt-3">
            <div className="col-md-2">
              <h6 className="rank-text">Beginner</h6>
              <img src={rank1} alt="Beginner" className="rank-image mb-1" />
              <h6 className="rank-text">0 - 1050</h6>
            </div>
            <div className="col-md-2">
              <h6 className="rank-text">Great</h6>
              <img src={rank2} alt="Great" className="rank-image mb-1" />
              <h6 className="rank-text">1051 - 1130</h6>
            </div>
            <div className="col-md-2">
              <h6 className="rank-text">Expert</h6>
              <img src={rank3} alt="Expert" className="rank-image mb-1" />
              <h6 className="rank-text">1131 - 1240</h6>
            </div>
            <div className="col-md-2">
              <h6 className="rank-text">Veteran</h6>
              <img src={rank4} alt="Veteran" className="rank-image mb-1" />
              <h6 className="rank-text">1241 - 1380</h6>
            </div>
            <div className="col-md-2">
              <h6 className="rank-text">Ultra</h6>
              <img src={rank5} alt="Ultra" className="rank-image mb-1" />
              <h6 className="rank-text">1381 - 1500</h6>
            </div>
            <div className="col-md-2">
              <h6 className="rank-text">Master</h6>
              <img src={rank6} alt="Master" className="rank-image mb-1" />
              <h6 className="rank-text">
                1501 - <FontAwesomeIcon icon={faInfinity} />
              </h6>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="container text-center">
        <h1 className="about-title mb-5 fs-3">Point System</h1>
      </div>
      <div className="container mb-3">
        <table className="table text-center table-dark point-system-container">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Correct</th>
              <th scope="col">Incorrect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Easy</th>
             <td><span className="text-success">+3 points </span></td>
              <td><span className="text-danger">-1 points </span></td>
            </tr>
            <tr>
              <th scope="row">Medium</th>
              <td><span className="text-success">+7 points </span></td>
              <td><span className="text-danger">-5 points </span></td>
            </tr>
            <tr>
              <th scope="row">Hard</th>
              <td><span className="text-success">+10 points </span></td>
              <td><span className="text-danger">-8 points </span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default About;
