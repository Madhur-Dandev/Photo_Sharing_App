import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { login } from "../api/auth";
import { context } from "../context";

const AuthHandler = ({ text, type }) => {
  const globalVal = useContext(context);
  const navigation = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      let message = "";
      if (type === "login") {
        const resp = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const userData = await resp.json();
        console.log(userData);
        console.log(type);

        const data = await login(
          {
            user_id: userData.email,
          },
          true,
          userData.id
        );
        message = data.message;
        if (data.success) {
          navigation("/");
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("username", data.username);
        }
      } else {
        const resp = await fetch(
          "http://localhost:5000/api/auth/google_signup",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: tokenResponse.access_token }),
          }
        );
        const data = await resp.json();
        console.log(data);
        message = data.message;
      }
      globalVal.triggerAlert(message);
    },
    onFailure: (error) => {
      console.log(error);
    },
  });

  return (
    <button
      className="auth-btn flex justify-between items-center"
      style={{
        backgroundColor: "WindowText",
      }}
      onClick={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <img src="/images/google-icon.png" alt="google icon" className="w-7" />
      <span className="text-sm sm:text-base">{text}</span>
      <div></div>
    </button>
  );
};

const GoogleAuth = ({ text = "Login With Google", type = "login" }) => {
  return (
    <GoogleOAuthProvider clientId="145775279537-saikh4s08qossg5g45ngpqti7r0idhoo.apps.googleusercontent.com">
      <AuthHandler text={text} type={type} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
