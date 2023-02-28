import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";

import { format } from "date-fns";

import { Link } from "react-router-dom";

import { db } from "../../services/firebaseConnection";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import Header from "../../components/Header";
import Title from "../../components/Title";
import Modal from "../../components/Modal";

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados() {
      const listRef = query(
        collection(db, "chamados"),
        orderBy("created", "desc"),
        limit(5)
      );

      await getDocs(listRef)
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((error) => {
          console.log("Algo deu errado!", error);
          setLoadingMore(false);
        });

      setLoading(false);
    }

    loadChamados();
    return () => {};
  }, []);

  async function updateState(snapshot) {
    const isColletionEmpty = snapshot.size === 0;

    if (!isColletionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // pegando ultimo documento buscado;

      setChamados((chamados) => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    const listRef = query(
      collection(db, "chamados"),
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    );

    await getDocs(listRef)
      .then((snapshot) => {
        updateState(snapshot);
      })
      .catch((error) => {});
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal); // Trocando de true pra false
    setDetail(item);
  }

  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>
        </div>

        <div className="container dashboard">
          <span>Buscando chamados...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>
        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr key="">
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              item.status === "Aberto" ? "#5CB85C" : "#999",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button
                          className="action"
                          style={{ backgroundColor: "#3583f6" }}
                          onClick={() => togglePostModal(item)}
                        >
                          <FiSearch size={17} color="#FFF" />
                        </button>

                        <Link
                          className="action"
                          style={{ backgroundColor: "#F6a935" }}
                          to={`/new/${item.id}`}
                        >
                          <FiEdit2 size={17} color="#FFF" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loadingMore && (
              <h3 style={{ textAlign: "center", marginTop: 15 }}>
                Buscando dados...
              </h3>
            )}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
                Buscar mais
              </button>
            )}
          </>
        )}
      </div>

      {showPostModal && <Modal conteudo={detail} close={togglePostModal} />}
    </div>
  );
}
