import React, { useState, useContext } from "react";
import "./profile.css";
import avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { db, storagePhotos } from "../../services/firebaseConnection";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { AuthContext } from "../../contexts/auth";

import { FiSettings, FiUpload } from "react-icons/fi";

import Header from "../../components/Header";
import Title from "../../components/Title";

export default function Profile() {
  const { user, logoff, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  const navigate = useNavigate();
  function redirect() {
    navigate("/", { replace: true });
  }

  function handleFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        toast.warn("Envie uma imagem PNG ou JPEG");
        setAvatarUrl(null);
        return null;
      }
    }
  }

  async function handleUpload() {
    const currentUid = user.uid;

    const storageRef = ref(
      storagePhotos,
      `images/${currentUid}/${imageAvatar.name}`
    );

    uploadBytes(storageRef, imageAvatar).then(async (snapshot) => {
      await getDownloadURL(
        ref(storagePhotos, `images/${currentUid}/${imageAvatar.name}`)
      )
        .then(async (url) => {
          let urlFoto = url;

          await setDoc(doc(db, "users", user.uid), {
            nome: nome,
            avatarUrl: urlFoto,
          })
            .then(() => {
              let data = {
                ...user,
                nome: nome,
                avatarUrl: urlFoto,
              };
              setUser(data);
              storageUser(data);
              toast.success("Perfil Atualizado!");
            })
            .catch((error) => {
              console.log(error);
              toast.error("Ops... Algo errado aconteceu!");
            });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  async function handleSave(e) {
    e.preventDefault();

    if (imageAvatar === null && nome !== "") {
      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        avatarUrl: avatarUrl,
      })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: avatarUrl,
          };
          setUser(data);
          storageUser(data);
          toast.success("Perfil Atualizado!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Ops... Algo errado aconteceu!");
        });
    } else if (nome !== "" && imageAvatar !== null) {
      handleUpload();
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Meu Perfil">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSave}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#fff" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />{" "}
              <br />
              {avatarUrl === null ? (
                <img
                  src={avatar}
                  alt="imagem avatar"
                  width="250"
                  height="250"
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="imagem avatar"
                  width="250"
                  height="250"
                />
              )}
            </label>

            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />

            <button type="submit">Salvar</button>
          </form>
        </div>

        <div className="container">
          <button onClick={() => logoff(redirect)} className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
