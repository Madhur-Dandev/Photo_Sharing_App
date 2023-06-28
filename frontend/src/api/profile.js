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

const updateProfilePicture = async (token, data) => {
    try {
        const resp = await fetch(`http://localhost:5000/api/profile/updatePicture?token=${token}`, {
            method: "PATCH",
            credentials: "include",
            body: data
        });
        
        return await resp.json();
    } catch (e) {
        return {success: false, message: "Error to fetch data from server"};
    }
}

const removeProfilePicture = async (token) => {
    const resp = await fetch(`http://localhost:5000/api/profile/removePicture?token=${token}`, {
        method: "PATCH",
        credentials: "include"
    });

    return await resp.json();
}

export {getProfileByUsername, getProfileByToken, updateProfilePicture, removeProfilePicture};