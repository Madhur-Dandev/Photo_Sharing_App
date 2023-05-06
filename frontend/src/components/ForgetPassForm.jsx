import React, { useRef, useState } from "react";

const ForgetPassForm = () => {
  const email = useRef();
  const [userEmail, setUserEmail] = useState();

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
      <button className="bg-slate-700 text-xl auth-form-elem">Send Link</button>
    </form>
  );
};

export default ForgetPassForm;
