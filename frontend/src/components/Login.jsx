const Login = () => {
  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-11/12 h-screen">
        <img
          src="/images/login.jpg"
          alt="login banner image"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-5">
        <h1 className="font-bold text-4xl">Welcome Back - Login</h1>
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
              className="auth-form-elem"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="auth-form-elem"
            />
            <button className="bg-slate-700 text-xl font-bold auth-form-elem">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
