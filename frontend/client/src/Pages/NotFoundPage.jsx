import React from "react";
import Cookies from "js-cookie";

import CountdownRedirect from "../Components/CountdownRedirect/CountdownRedirect";

export default function NotFoundPage() {
  const authenticationToken = Cookies.get("authentication_token")
  return (
    <div className="notFoundPageContainer">
      {authenticationToken ?  <CountdownRedirect whereRedirect='/films' /> : <CountdownRedirect whereRedirect='/login' />}
    </div>
  );
};