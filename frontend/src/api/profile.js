const getProfileByUsername = async (username) => {
    const resp = await fetch(`http://localhost:5000/api/profile/${username}`);

    return await resp.json();
};

const getProfileByToken = async (token) => {
    const resp = await fetch(
        `http://localhost:5000/api/profile/token?token=${token}`,
        {
            credentials: "include",
        }
    );

    return await resp.json();
};

const updateProfileInfo = async (token, data) => {
    try{
        const resp = await fetch(`http://localhost:5000/api/profile/updateProfile?token=${token}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        return await resp.json();
    } catch(e) {
        console.log(e);
        return {success: false, message: "Error connecting to server"};
    }
}

const updateProfilePicture = async (token, data) => {
    try {
        const resp = await fetch(
            `http://localhost:5000/api/profile/updatePicture?token=${token}`,
            {
                method: "PATCH",
                credentials: "include",
                body: data,
            }
        );

        return await resp.json();
    } catch (e) {
        console.log(e);
        return { success: false, message: "Error to fetch data from server" };
    }
};

const removeProfilePicture = async (token) => {
    try {
        const resp = await fetch(
            `http://localhost:5000/api/profile/removePicture?token=${token}`,
            {
                method: "PATCH",
                credentials: "include",
            }
        );

        return await resp.json();
    } catch (e) {
        return { success: false, message: "Error while requesting to server!" };
    }
};

export {
    getProfileByUsername,
    getProfileByToken,
    updateProfileInfo,
    updateProfilePicture,
    removeProfilePicture,
};
