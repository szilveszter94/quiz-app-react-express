/* eslint-disable no-unused-vars */
import {
  emailPasswordSignIn,
  signInWithCustomPopup
} from "../../utils/firebase/firebase.utils";
import FormInput from "../FormInput/FormInput";
import { useState } from "react";
import "./SignIn.css";
import googleLogo from "../../assets/google-icon.svg";
import facebookLogo from "../../assets/facebook-icon.svg";
import githubLogo from "../../assets/github-icon.svg";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);

  const logGoogleUser = async () => {
    const response = await signInWithCustomPopup("google");
    if (!response.ok) {
      alert(response.message)
    }
  };

  const logFacebookUser = async () => {
    const response = await signInWithCustomPopup("facebook");
    if (!response.ok) {
      alert(response.message)
    }
  };

  const logGithubUser = async () => {
    const response = await signInWithCustomPopup("github");
    if (!response.ok) {
      alert(response.message)
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      await emailPasswordSignIn(formFields);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-login-credentials":
          alert("Incorrect email or password");
          break;
        default:
          console.log("Login failed", error);
      }
    }
  };

  return (
    <>
      <h1 className="sign-in-title mb-4">Sign in page</h1>
      <div className="container">
        <div className="row">
          <button
            className="mt-4 mb-2 btn btn-outline-info col-md-12"
            onClick={() => logGoogleUser()}
          >
            <img className="google-sign-in-icon" src={googleLogo} alt="logo" />
            <span className="ms-2 mt-3 fs-5">Sign In With Google</span>
          </button>
          <button
            className="mb-2 btn btn-outline-info col-md-12"
            onClick={() => logFacebookUser()}
          >
            <img
              className="facebook-sign-in-icon mb-1"
              src={facebookLogo}
              alt="logo"
            />
            <span className="ms-2 mt-3 fs-5">Sign In With Facebook</span>
          </button>
          <button
            className="mb-3 btn btn-outline-info col-md-12"
            onClick={() => logGithubUser()}
          >
            <img className="github-sign-in-icon" src={githubLogo} alt="logo" />
            <span className="ms-2 mt-3 fs-5">Sign In With Github</span>
          </button>
        </div>
      </div>
      <form className="sign-in-form p-4" onSubmit={handleSubmit}>
        <p className="sign-in-subtitle">Sign in with email and password</p>
        <FormInput
          label="Email"
          type="email"
          name="email"
          id="signinemail"
          required
          onChange={handleChange}
          value={formFields.email}
        />
        <FormInput
          label="Password"
          minLength={8}
          type="password"
          name="password"
          id="signinpassword"
          required
          onChange={handleChange}
          value={formFields.password}
        />
        <button className="btn mt-4 btn-lg btn-outline-info" type="submit">
          Sign In
        </button>
      </form>
    </>
  );
};

export default SignIn;
