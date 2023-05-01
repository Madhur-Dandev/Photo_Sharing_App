import { useEffect, useContext } from "react";
import { context } from "../context";

function About() {
  const globalVal = useContext(context);

  useEffect(() => {
    globalVal.setBallPos(3);
  }, []);

  return <div>About</div>;
}

export default About;
