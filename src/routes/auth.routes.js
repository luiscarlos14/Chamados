import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

export default function AuthRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />}  />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    </>
  );
}
