import { useEffect, useContext, useState } from "react";
import { context } from "../context";

const ProfileEditModal = ({
    setOpenImageOpt,
    setShowEditorModal,
    imageUrl,
    username,
    name,
    userbio,
}) => {
    const globalVal = useContext(context);

    const [userName, setUserName] = useState(username);
    const [nameDisp, setNameDisp] = useState(name);
    const [bio, setBio] = useState(userbio);

    useEffect(() => {
        globalVal.disableScroll();

        return () => {
            setOpenImageOpt(false);
            globalVal.enableScroll();
        };
    }, []);

    return (
        <div
            className="w-screen h-screen bg-stone-800 bg-opacity-60 grid place-items-center absolute top-0 left-0 z-10 animate-fadeIn"
            data-type="parent"
            onClick={(e) => {
                if (e.target.dataset.type === "parent")
                    setShowEditorModal(false);
            }}
        >
            <div
                className="flex flex-col justify-center items-center gap-3 w-425 bg-stone-900 px-11 py-6"
                data-type="child"
            >
                <div className="w-28 h-28 rounded-full overflow-hidden mb-2">
                    <img
                        src={imageUrl}
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
                />
                <input
                    type="text"
                    className="w-full h-full px-5 py-1 text-zinc-800 resize-none text-lg border-none rounded-md focus:outline-none"
                    name="name"
                    id="name"
                    value={nameDisp}
                    onInput={(e) => setNameDisp(e.target.value)}
                />
                <textarea
                    name="bio"
                    className="w-full h-full px-5 py-1 text-zinc-800 resize-none text-lg border-none rounded-md focus:outline-none"
                    id="bio"
                    cols="30"
                    rows="6"
                    value={bio}
                    onInput={(e) => setBio(e.target.value)}
                ></textarea>
                <button className="w-full h-full px-5 py-1 resize-none text-lg border-none rounded-md focus:outline-none bg-slate-200 text-zinc-800 cursor-pointer font-extrabold transition-all duration-200 hover:bg-zinc-800 hover:text-slate-200">
                    Update
                </button>
            </div>
        </div>
    );
};

export default ProfileEditModal;
