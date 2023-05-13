import { useRef, useState } from "react";
import CommentAndReply from "./CommentAndReply";

const Comments = ({ details, type }) => {
  const arrow = useRef();
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="flex flex-col gap-1 my-3" key={details.id}>
      <div className="flex items-center gap-3">
        <img
          src={details.user_avatar}
          alt={details.user_name}
          className="w-8 h-90 rounded-full"
        />
        <p>{details.user_name}</p>
      </div>
      <p className="ml-11">{details.comment}</p>
      <div
        style={{
          display: type === "comment" ? "block" : "none",
        }}
      >
        <p
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            arrow.current.classList.contains("rotate-180")
              ? arrow.current.classList.remove("rotate-180")
              : arrow.current.classList.add("rotate-180");
            setShowReply(!showReply);
          }}
        >
          <span ref={arrow} className="transition-all duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
          <span>Reply</span>
        </p>
        {showReply && <CommentAndReply type="reply" />}
      </div>
    </div>
  );
};

export default Comments;
