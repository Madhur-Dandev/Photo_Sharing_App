const login = async (payload, google = false, g_id) => {
  const resp = await fetch(
    `http://localhost:5000/api/auth/login${
      google ? `?google=true&g_id=${g_id}` : ""
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  return await resp.json();
};

const signup = async (name, email, pass) => {
  const resp = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      user_name: name,
      user_email: email,
      user_password: pass,
    }),
  });

  return await resp.json();
};

const logout = async () => {
  if (localStorage.getItem("access_token")) {
    const resp = await fetch(
      `http://localhost:5000/api/auth/logout/${localStorage.getItem(
        "access_token"
      )}`,
      {
        credentials: "include",
      }
    );
    const data = await resp.json();
    return data;
  }
  return { success: false, message: "Unauthorized Action" };
};

const changePassword = async (email) => {
  const resp = await fetch(
    "http://localhost:5000/api/auth/request_pass_change",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: email }),
    }
  );

  const data = await resp.json();
  return data;
};

const handleGoogleLogin = (callback) => {
  window.google.accounts.id.initialize({
    client_id:
      "145775279537-saikh4s08qossg5g45ngpqti7r0idhoo.apps.googleusercontent.com",
    callback: callback,
  });
  google.accounts.id.prompt();
};

export { login, signup, logout, changePassword, handleGoogleLogin };
