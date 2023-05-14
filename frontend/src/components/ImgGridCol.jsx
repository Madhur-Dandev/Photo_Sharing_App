import React from "react";
import ColImg from "./ColImg";

const ImgGridCol = ({ items, showUserInfo }) => {
  /**
   * This component is use to represent single column for image grid.
   * This component uses <ColImg /> tag to display each image in a column.
   */
  return (
    // section to display column in search and gallery
    <div className="grid gap-4 h-max">
      {/* looping through image */}
      {items.map((img) => (
        <ColImg img={img} key={img.id} showUserInfo={showUserInfo} />
      ))}
    </div>
  );
};

export default ImgGridCol;
