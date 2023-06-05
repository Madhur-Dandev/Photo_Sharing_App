const login = async (email, pass) => {
    const resp = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({user_id : email, user_password : pass})
    });

    return await resp.json();
}

const signup = async (name, email, pass) => {
    const resp = await fetch("http://localhost:5000/api/auth/signup", {
        method : "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        credentials : "include",
        body : JSON.stringify({user_name : name, user_email : email, user_password : pass})
    });

    return await resp.json();
}

const logout = async () => {
    if(localStorage.getItem("access_token")) {
        const resp = await fetch(`http://localhost:5000/api/auth/logout/${localStorage.getItem("access_token")}`, {
            credentials: "include",
        });
        const data = await resp.json();
        return data;
    }
    return {"success" : false, "message" : "Unauthorized Action"}
}

export {login, signup, logout};