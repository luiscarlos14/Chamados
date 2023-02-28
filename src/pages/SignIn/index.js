import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

import "./login.css";

import logo from "../../assets/logo.png";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { login, loadingAuth } = useContext(AuthContext);

  function redirect() {
    navigate("/", { replace: true });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (email !== "" && password !== "") {
      login(email, password, redirect);
    } else {
      toast.warn("Preencha todos os campos!")
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="***************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>

        <Link to="/register">Criar uma Conta</Link>
      </div>
    </div>
  );
}
