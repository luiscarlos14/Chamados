import React, { useContext } from "react";
import { AuthContext } from "../contexts/auth";

import App from "./app.routes";
import Auth from "./auth.routes";

export default function Index() {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return signed ? <App /> : <Auth />;
}
