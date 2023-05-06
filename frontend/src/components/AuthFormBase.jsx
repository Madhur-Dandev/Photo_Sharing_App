import React from "react";
import { useParams } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthLink from "./AuthLink";
import ForgetPassForm from "./ForgetPassForm";

const AuthFormBase = () => {
  const { type } = useParams();

  return (
    <div className="flex h-screen relative">
      {/* <div className="hidden md:block w-11/12 h-screen"> */}
      <div className="absolute md:relative top-0 left-0 w-full blur-md md:blur-0 md:block md:w-11/12 h-screen">
        <img
          src="/images/login.jpg"
          alt="login banner image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-5 form-section z-20">
        <h1 className="font-bold text-2xl sm:text-4xl">
          {type == "login" ? "Welcome Back! - Login" : "New? - Signup"}
        </h1>
        <div className="w-full p-10">
          {type === "login" && <LoginForm />}
          {type === "signup" && <SignupForm />}
          {type === "forgetPass" && <ForgetPassForm />}
        </div>
        <div className="flex gap-5 bg-slate-900 p-2 rounded-full">
          {type === "login" && (
            <>
              <AuthLink path="/auth/signup" name="Signup" />
              <AuthLink path="/auth/forgetPass" name="Forget Password" />
            </>
          )}
          {type === "signup" && <AuthLink path="/auth/login" name="Login" />}
          {type === "forgetPass" && (
            <>
              <AuthLink path="/auth/login" name="Login" />
              <AuthLink path="/auth/signup" name="Signup" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFormBase;
