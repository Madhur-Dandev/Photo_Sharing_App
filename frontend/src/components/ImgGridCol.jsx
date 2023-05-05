import React from "react";
import RecommImg from "./RecommImg";

const ImgGridCol = ({ items }) => {
  return (
    // section to display column in search and gallery
    <div className="grid gap-4 h-max">
      {/* looping through image */}
      {items.map((img) => (
        <RecommImg img={img} key={img.id} />
      ))}
    </div>
  );
};

export default ImgGridCol;
