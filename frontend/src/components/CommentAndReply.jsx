import { useState } from "react";
import Comments from "./Comments";

const CommentAndReply = ({ type }) => {
  /**
   * This component is to add reply to the comment.
   */

  // These are some dummy comment which will remove in production.
  const COMMENTS = [
    {
      id: 1,
      user_name: "Gaurav Narnaware",
      user_avatar: "https://avatars.githubusercontent.com/u/74124521?v=4",
      comment: "Hi there! This is me.",
    },
    {
      id: 2,
      user_name: "Om Raut",
      user_avatar: "https://avatars.githubusercontent.com/u/85446773?v=4",
      comment:
        "Awesome Photograph. I think I should hire you. Please DM me your contacts.",
    },
    {
      id: 3,
      user_name: "Madhur Dandev",
      user_avatar: "https://avatars.githubusercontent.com/u/123223372?v=4",
      comment:
        "Great I love it. The way you give that message via that tetra pack that's amazing. We must consider buying just paper bottle only.",
    },
  ];

  const [body, setBody] = useState("");
  const [comments, setComments] = useState(COMMENTS);

  return (
    <div className={`mt-3${type === "reply" ? " ml-11" : ""}`}>
      <p
        className="text-center font-bold text-4xl"
        style={{
          display: type === "comment" ? "block" : "none",
        }}
      >
        Comments
      </p>
      <div>
        <div className="flex w-full bg-slate-600 rounded overflow-hidden mt-2">
          <input
            type="text"
            onChange={(e) => setBody(e.target.value)}
            value={body}
            className="text-slate-800 font-bold w-full px-2"
            placeholder={`type ${type === "comment" ? "comment" : "reply"}`}
            aria-placeholder={`type ${
              type === "comment" ? "comment" : "reply"
            }`}
          />
          <button
            onClick={() => {
              /**
               * Adding up dummy comment/reply without server. (This will remove in production phase)
               */
              setComments([
                ...comments,
                {
                  id: 4,
                  user_name: "Madhur Dandev",
                  user_avatar:
                    "https://avatars.githubusercontent.com/u/123223372?v=4",
                  comment: body,
                },
              ]);
            }}
            className="text-center whitespace-nowrap py-1.5 px-4"
          >
            Add {type === "comment" ? "Comment" : "Reply"}
          </button>
        </div>
        <div className="mt-5">
          {comments.map((item) => (
            <Comments details={item} key={item.id} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentAndReply;
