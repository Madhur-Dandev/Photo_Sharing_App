import React, { useRef, useState, useEffect, useContext } from "react";
import { context } from "../context";
import { Link } from "react-router-dom";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = ({
  setSwitchPos,
  setSwitchShow,
  triggerPulse,
  removePulse,
}) => {
  const globalVal = useContext(context);
  const navigation = useNavigate();

  const password = useRef();
  const email = useRef();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    setSwitchPos("left-0");
    setSwitchShow(true);
  }, []);

  const loginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login");
    triggerPulse();
    if (email.current.value) {
      if (password.current.value) {
        const data = await login(email.current.value, password.current.value);
        if (data.success) {
          navigation("/");
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("username", data.username);
          removePulse();
        }
        globalVal.triggerAlert(data.message);
      } else {
        password.current.classList.remove("form-field-empty-warn");
        password.current.classList.add("form-field-empty-warn");
      }
    } else {
      email.current.classList.remove("form-field-empty-warn");
      email.current.classList.add("form-field-empty-warn");
    }
  };

  return (
    <form className="flex flex-col gap-5">
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
      <button className="auth-btn" onClick={loginSubmit}>
        Login
      </button>
      <button
        className="auth-btn flex justify-between items-center"
        style={{
          backgroundColor: "WindowText",
        }}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <img src="/images/google-icon.png" alt="google icon" className="w-7" />
        <span className="text-sm sm:text-base">Login With Google</span>
        <div></div>
      </button>
      <Link
        to="/auth/forgetPass"
        className="auth-form-elem cursor-pointer text-end"
      >
        Forget Password?
      </Link>
    </form>
  );
};

export default LoginForm;
