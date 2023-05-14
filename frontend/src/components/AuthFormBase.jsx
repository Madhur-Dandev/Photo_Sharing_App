import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgetPassForm from "./ForgetPassForm";
import { Link } from "react-router-dom";

const Auth = () => {
  const { type } = useParams();
  const switchElem = useRef();
  const [switchShow, setSwitchShow] = useState(true);
  const [switchPos, setSwitchPos] = useState("");

  return (
    <div className="flex h-screen relative bg-slate-600">
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
        <div className="w-full p-5 sm:p-10">
          {type === "login" && (
            <LoginForm
              setSwitchPos={setSwitchPos}
              setSwitchShow={setSwitchShow}
            />
          )}
          {type === "signup" && (
            <SignupForm
              setSwitchPos={setSwitchPos}
              setSwitchShow={setSwitchShow}
            />
          )}
          {type === "forgetPass" && (
            <ForgetPassForm setSwitchShow={setSwitchShow} />
          )}
        </div>
        <div className="flex bg-slate-900 rounded-full relative">
          {switchShow && (
            <div
              className={`w-1/2 h-full absolute bg-slate-300 top-0 ${switchPos} rounded-full transition-all duration-200`}
              ref={switchElem}
            ></div>
          )}
          <div className="w-28 sm:w-40 flex z-10">
            <Link to="/auth/login" className="auth-link">
              Login
            </Link>
          </div>
          <div className="w-28 sm:w-40 flex z-10">
            <Link to="/auth/signup" className="auth-link">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
