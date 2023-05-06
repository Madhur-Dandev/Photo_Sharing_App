import { useRef } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const password = useRef();

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
        <h1 className="font-bold text-2xl sm:text-4xl">Welcome Back - Login</h1>
        <div className="w-full p-10">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              className="auth-form-elem text-slate-700"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="auth-form-elem text-slate-700"
              ref={password}
            />
            <div className="auth-form-elem flex gap-2">
              <input
                type="checkbox"
                name="showPass"
                id="showPass"
                onChange={(e) => {
                  password.current.type = e.target.checked
                    ? "text"
                    : "password";
                }}
              />
              <label htmlFor="showPass">Show Password</label>
            </div>
            <button className="bg-slate-700 text-xl auth-form-elem">
              Login
            </button>
          </form>
        </div>
        <div className="flex gap-5 bg-slate-900 p-2 rounded-full">
          <div className="w-28 sm:w-40 flex">
            <Link to="/" className="auth-link">
              Register
            </Link>
          </div>
          <div className="w-28 sm:w-40 flex">
            <Link to="/" className="auth-link">
              Forget Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
