import React, { useRef, useState, useEffect, useContext } from "react";
import { changePassword } from "../api/auth";
import { context } from "../context";

const ForgetPassForm = ({ setSwitchShow }) => {
  const globalVal = useContext(context);
  const email = useRef();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setSwitchShow(false);
  }, []);

  const handleActivity = async (e) => {
    e.preventDefault();
    const data = await changePassword(userEmail);

    globalVal.triggerAlert(data.message);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleActivity}>
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
      <button className="bg-slate-700 text-xl auth-form-elem">Send Link</button>
    </form>
  );
};

export default ForgetPassForm;
