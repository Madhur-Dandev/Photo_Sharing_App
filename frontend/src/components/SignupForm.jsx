import React, { useState, useRef, useEffect } from "react";

const SignupForm = ({ setSwitchPos, setSwitchShow }) => {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();

  useEffect(() => {
    setSwitchPos(window.innerWidth >= 640 ? "left-40" : "left-28");
    setSwitchShow(true);
  }, []);

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
      <button className="auth-btn">Signup</button>
      <button
        className="auth-btn flex justify-between items-center"
        style={{
          backgroundColor: "WindowText",
        }}
      >
        <img src="/images/google-icon.png" alt="google icon" className="w-7" />
        <span className="text-sm sm:text-base">Signup With Google</span>
        <div></div>
      </button>
    </form>
  );
};

export default SignupForm;
