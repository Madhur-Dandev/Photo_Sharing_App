import React, { useRef, useState } from "react";

const LoginForm = () => {
  const password = useRef();
  const email = useRef();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();

  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
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
      <button className="bg-slate-700 text-xl auth-form-elem">Login</button>
    </form>
  );
};

export default LoginForm;