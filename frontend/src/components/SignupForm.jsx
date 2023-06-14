import React, { useState, useRef, useEffect, useContext } from "react";
import { context } from "../context";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

const SignupForm = ({
  setSwitchPos,
  setSwitchShow,
  triggerPulse,
  removePulse,
}) => {
  const globalVal = useContext(context);
  const navigation = useNavigate();

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    setSwitchPos(window.innerWidth >= 640 ? "left-40" : "left-28");
    setSwitchShow(true);
  }, []);

  const submitSignup = async (e) => {
    e.preventDefault();

    if (name.current.value) {
      if (email.current.value) {
        if (password.current.value) {
          triggerPulse();
          const data = await signup(
            name.current.value,
            email.current.value,
            password.current.value
          );
          if (data.success) {
            navigation("/auth/login");
            removePulse();
          }
          globalVal.triggerAlert(data.message);
          removePulse();
        } else {
          password.current.classList.remove("form-field-empty-warn");
          password.current.classList.add("form-field-empty-warn");
        }
      } else {
        email.current.classList.remove("form-field-empty-warn");
        email.current.classList.add("form-field-empty-warn");
      }
    } else {
      name.current.classList.remove("form-field-empty-warn");
      name.current.classList.add("form-field-empty-warn");
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name"
        className="auth-form-elem text-slate-700"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        ref={name}
        onAnimationEnd={(e) => {
          e.preventDefault();
          e.target.classList.remove("form-field-empty-warn");
        }}
      />
      <input
        type="text"
        name="email"
        id="email"
        placeholder="Email"
        className="auth-form-elem text-slate-700"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        ref={email}
        onAnimationEnd={(e) => {
          e.preventDefault();
          e.target.classList.remove("form-field-empty-warn");
        }}
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        className="auth-form-elem text-slate-700"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
        ref={password}
        onAnimationEnd={(e) => {
          e.preventDefault();
          e.target.classList.remove("form-field-empty-warn");
        }}
      />
      <div className="auth-form-elem flex gap-2">
        <input
          type="checkbox"
          name="showPass"
          id="showPass"
          onChange={(e) => {
            password.current.type = e.target.checked ? "text" : "password";
          }}
        />
        <label htmlFor="showPass">Show Password</label>
      </div>
      <button className="auth-btn" onClick={submitSignup}>
        Signup
      </button>
      {/* <button
        className="auth-btn flex justify-between items-center"
        style={{
          backgroundColor: "WindowText",
        }}
        onClick={(e) => {
          e.preventDefault();
          window.open("http://localhost:5000/api/auth/googleSignup", "_blank");
        }}
      >
        <img src="/images/google-icon.png" alt="google icon" className="w-7" />
        <span className="text-sm sm:text-base">Signup With Google</span>
        <div></div>
      </button> */}
      <GoogleAuth text="Signup With Google" type="signup" />
    </form>
  );
};

export default SignupForm;
