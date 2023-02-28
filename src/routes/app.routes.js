import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import New from "../pages/New";
import Error from "../pages/Error";

export default function AuthRoutes() {

  return (
    <>
      <Routes>
        <Route index path="/" element={<Dashboard />}/>
        <Route index path="/dashboard" element={<Dashboard />}/>
        <Route index path="/profile" element={<Profile />}/>
        <Route index path="/customers" element={<Customers />}/>
        <Route index path="/new" element={<New />}/>
        <Route index path="/new/:id" element={<New />}/>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
