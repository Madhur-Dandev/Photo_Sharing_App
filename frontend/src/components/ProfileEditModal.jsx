import { useEffect, useContext, useState, useRef } from "react";
import { context } from "../context";
import { updateProfileInfo } from "../api/profile";
import Loading from "./Loading";

const ProfileEditModal = ({
    setOpenImageOpt,
    setShowEditorModal,
    imageUrl,
    userInfo,
    setUserInfo,
}) => {
    const globalVal = useContext(context);

    const [userName, setUserName] = useState(userInfo.user_name);
    const [nameDisp, setNameDisp] = useState(userInfo.name);
    const [bio, setBio] = useState(userInfo.user_bio || "");
    const [isLoading, setIsLoading] = useState(false);

    const nameField = useRef();
    const usernameField = useRef();
    const bioField = useRef();

    const handleUpdateProfle = async () => {
        if (!/^[\w ]{5,25}$/g.test(nameDisp)) {
            nameField.current.style.outline = "2px solid salmon";
            return globalVal.triggerAlert("Invalid Name");
        }
        if (!/^[\w\.]{6,20}$/g.test(userName)) {
            usernameField.current.style.outline = "2px solid salmon";
            return globalVal.triggerAlert("Invalid Username");
        }
        if (bio.length > 125) {
            bioField.current.style.outline = "2px solid salmon";
            return globalVal.triggerAlert(
                "Length of character in bio exceeded!"
            );
        }
        setIsLoading(true);

        const data = await updateProfileInfo(
            localStorage.getItem("access_token"),
            { name: nameDisp, user_name: userName, bio }
        );

        console.log(data);

        globalVal.triggerAlert(data.message);

        if (data.message) {
            setIsLoading(false);
            globalVal.triggerAlert(data.message);
        }

        if (data.success) {
            setUserInfo({
                ...userInfo,
                user_name: userName,
                name: nameDisp,
                user_bio: bio,
            });
            setShowEditorModal(false);
        }
    };

    useEffect(() => {
        globalVal.disableScroll();

        return () => {
            setOpenImageOpt(false);
            globalVal.enableScroll();
        };
    }, []);

    return (
        <div
            className="w-screen h-screen bg-stone-800 bg-opacity-60 grid place-items-center fixed top-0 left-0 z-10 animate-fadeIn"
            data-type="parent"
            onClick={(e) => {
                if (e.target.dataset.type === "parent")
                    setShowEditorModal(false);
            }}
        >
            <div
                className="flex flex-col justify-center items-center gap-3 w-425 bg-stone-900 px-11 py-6 relative"
                data-type="child"
            >
                {isLoading && <Loading />}
                <div className="w-28 h-28 rounded-full overflow-hidden mb-2">
                    <img
                        src={imageUrl || "/images/default_profile.jpeg"}
                        alt="Profile Image"
                        className="w-full h-full object-cover"
                        onClick={() => setOpenImageOpt(true)}
                    />
                </div>
                <input
                    type="text"
                    className="w-full h-full px-5 py-1 text-zinc-800 resize-none text-lg border-none rounded-md focus:outline-none"
                    name="username"
                    id="username"
                    value={userName}
                    onInput={(e) => setUserName(e.target.value)}
                    ref={usernameField}
                />
                <input
                    type="text"
                    className="w-full h-full px-5 py-1 text-zinc-800 resize-none text-lg border-none rounded-md focus:outline-none"
                    name="name"
                    id="name"
                    value={nameDisp}
                    onInput={(e) => setNameDisp(e.target.value)}
                    ref={nameField}
                />
                <textarea
                    name="bio"
                    className="w-full h-full px-5 py-1 text-zinc-800 resize-none text-lg border-none rounded-md focus:outline-none"
                    id="bio"
                    cols="30"
                    rows="6"
                    maxLength="125"
                    value={bio}
                    onInput={(e) => setBio(e.target.value)}
                    ref={bioField}
                ></textarea>
                <button
                    className="w-full h-full px-5 py-1 resize-none text-lg border-none rounded-md focus:outline-none bg-slate-200 text-zinc-800 cursor-pointer font-extrabold transition-all duration-200 hover:bg-zinc-800 hover:text-slate-200"
                    onClick={handleUpdateProfle}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default ProfileEditModal;
