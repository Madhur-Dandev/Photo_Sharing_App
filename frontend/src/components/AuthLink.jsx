import React from "react";
import { Link } from "react-router-dom";

const AuthLink = ({ path, name }) => {
  return (
    <div className="w-28 sm:w-40 flex">
      <Link to={path} className="auth-link">
        {name}
      </Link>
    </div>
  );
};

export default AuthLink;
