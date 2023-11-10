/* eslint-disable react/prop-types */
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

const Forbidden = ({message}) => {
  return (
    <div className="main">
      <Navbar />
      <div className="text-center my-5 content">
        <h4>{message ? message : "404 Page not found"}</h4>
        <p>Return to the homepage</p>
      <Link to="/">
        <button className="btn btn-lg btn-outline-info">Home</button>
      </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Forbidden;
