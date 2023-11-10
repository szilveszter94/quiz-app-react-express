/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Navbar from "../../components/Navbar/Navbar";
import SignUp from "../../components/SignUp/SignUp";
import Footer from "../../components/Footer/Footer";
import SignIn from "../../components/SignIn/SignIn";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";


const Authentication = () => {
  const {currentUser} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser){
      navigate("/");
    }
  }, [currentUser])

  return (
    <div className="main">
      <Navbar />
      <div className="content">
        <div className="container">
        <div className="row text-center my-5">
          <div className="col-md-6">
            <div className="mx-5">
              <SignIn />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mx-5">
              <SignUp />
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Authentication;
