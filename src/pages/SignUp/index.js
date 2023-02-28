import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function redirect() {
    navigate("/", { replace: true });
  }

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if (name !== "" && email !== "" && password !== "") {
      signUp(email, password, name, redirect);
    } else {
      alert("preencha todos os campos");
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Criar Conta</h1>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Carregando..." : "Cadastrar"}
          </button>
        </form>

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}
