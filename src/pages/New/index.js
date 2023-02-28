import React, { useState, useEffect, useContext } from "react";
import "./new.css";

import Header from "../../components/Header";
import Title from "../../components/Title";

import { toast } from "react-toastify";

import { AuthContext } from "../../contexts/auth";

import { FiPlusCircle } from "react-icons/fi";

import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

export default function New() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(0);

  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const [created, setCreated] = useState();

  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadCustomers() {
      let lista = [];

      await getDocs(collection(db, "customers"))
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nome: doc.data().nomeFantasia,
            });
          });

          if (lista.length === 0) {
            console.log("Nenhuma empresa emcontrada");
            setCustomers([{ id: "1", nomeFantasia: "Freela" }]);
            setLoadCustomers(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomers(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("Algo deu errado!", error);
          setLoadCustomers(false);
          setCustomers([{ id: "1", nomeFantasia: "" }]);
        });
    }
    loadCustomers();

    async function loadId(lista) {
      const docRef = doc(db, "chamados", id);

      await getDoc(docRef)
        .then((snapshot) => {
          setAssunto(snapshot.data().assunto);
          setStatus(snapshot.data().status);
          setComplemento(snapshot.data().complemento);
          setCreated(snapshot.data().created);

          let index = lista.findIndex(
            (item) => item.id === snapshot.data().clienteId
          );
          setCustomerSelected(index);
          setIdCustomer(true);
        })
        .catch((error) => {
          console.log("Erro no Id passado: ", error);
          setIdCustomer(false);
        });
    }
  }, [id]);

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      await setDoc(doc(db, "chamados", id), {
        created: created,
        cliente: customers[customerSelected].nome,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
      })
        .then(() => {
          toast.success("Chamado editado com sucesso!");
          setComplemento("");
          setCustomerSelected(0);
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao cadastrar chamado!");
        });

      return;
    }

    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nome,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      status: status,
      complemento: complemento,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado criado com sucesso!");
        setComplemento("");
        setCustomerSelected(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao cadastrar chamado!");
      });
  }

  //Chamado quando troca o assunto
  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  //Chamado quando troca o status
  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  //Chamado quando troca de cliente
  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input type="text" disabled value="Carregando Clientes..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nome}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>

            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Em Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (Opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
