import { useEffect, useContext } from "react";
import { context } from "../context";

const Gallery = () => {
  const globalVal = useContext(context);

  useEffect(() => {
    globalVal.setBallPos(2);
  }, []);

  return <div>Gallery</div>;
};

export default Gallery;
