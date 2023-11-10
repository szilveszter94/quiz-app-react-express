import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCirclePlus,
  faPenToSquare,
  faHouse,
  faCircleInfo,
  faList12,
  faListCheck
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { signOutUser } from "../../utils/firebase/firebase.utils";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);
  const handleLogout = () => {
    signOutUser();
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-0">
      <div className="container-fluid">
        <Link className="navbar-brand ms-3 me-4" to="/">
          Quizzler!
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link ms-4 fs-4" to="/">
                Home <FontAwesomeIcon icon={faHouse} />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link ms-4 fs-4" to="/about">
                About <FontAwesomeIcon icon={faCircleInfo} />
              </Link>
            </li>
            {currentUser ? (
              <>
                <li className="nav-item ms-4">
                  <Link className="nav-link fs-4" to="/quizlist/view">
                    Your Quizzes <FontAwesomeIcon icon={faListCheck} />
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <Link className="nav-link fs-4" to="/leaderboard">
                   Leaderboard <FontAwesomeIcon icon={faList12} />
                  </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {currentUser ? (
              <>
                <li className="nav-item ms-4">
                  <Link className="nav-link fs-4" to="/quiz/create/new">
                    Create <FontAwesomeIcon icon={faCirclePlus} />
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <Link className="nav-link fs-4" to="/quizlist/edit">
                    Edit <FontAwesomeIcon icon={faPenToSquare} />
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <div className="dropdown mt-2 mx-2 fs-4">
                    <span
                      className="dropdown user-icon"
                      data-bs-toggle="dropdown"
                    >
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <div className="dropdown-menu dropdown-menu-dark dropdown-menu-right dropdown-menu-end">
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                      <a
                        className="dropdown-item"
                        onClick={() => handleLogout()}
                        href="#"
                      >
                        Sign Out
                      </a>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li className="nav-item ms-4">
                <Link className="nav-link" to="/authentication">
                  <FontAwesomeIcon icon={faUser} /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
