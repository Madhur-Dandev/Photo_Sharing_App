import React from "react";
import { useContext, useEffect } from "react";
import { context } from "../context";
import HomeHero from "./HomeHero";
import Categories from "./Categories";

function Home() {
  /**
   * Home page.
   * This component contains only two other components for this time.
   */
  const globalVal = useContext(context); // global values.

  useEffect(() => {
    /**
     * sets navigation icon ball position to 1 and shows the ball.
     */
    globalVal.setBallPos(1);
    globalVal.setShowBall(true);
  }, []);

  return (
    <div>
      <HomeHero />
      <Categories />
    </div>
  );
}

export default Home;
