const getProfileByUsername = async (username) => {
    const resp = await fetch(`http://localhost:5000/api/profile/${username}`);
    
    return await resp.json();
}

const getProfileByToken = async (token) => {
    const resp = await fetch(`http://localhost:5000/api/profile/token?token=${token}`, {
        credentials: "include"
    });
    
    return await resp.json();
}

const removeProfilePicture = async (token) => {
    const resp = await fetch(`http://localhost:5000/api/profile/removePicture?token=${token}`, {
        method: "PATCH",
        credentials: "include"
    });

    return await resp.json();
}

export {getProfileByUsername, getProfileByToken, removeProfilePicture};