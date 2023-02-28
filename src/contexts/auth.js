import { useState, createContext, useEffect } from "react";
import { db, auth } from "../services/firebaseConnection";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import {toast} from 'react-toastify';


export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem("SistemaUser");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  async function login(email, password, redirect) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        const docRef = doc(db, "users", uid);
        await getDoc(docRef).then((snap) => {
         
          const userProfile = {
            uid: uid,
            nome: snap.data().nome,
            email: value.user.email,
            avatarUrl: snap.data().avatarUrl,
          };

          setUser(userProfile);
          storageUser(userProfile);
          setLoadingAuth(false);

          toast.success("Bem Vindo a Plataforma!")
        });
        redirect();
      })
      .catch(() => {
        toast.error("Erro ao tentar fazer o login!");
        setLoadingAuth(false);
      });
  }

  async function signUp(email, password, nome, redirect) {
    setLoadingAuth(true);

    const auth = getAuth();

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "users", uid), {
          nome: nome,
          avatarUrl: null,
        }).then(() => {
          let data = {
            uid: uid,
            nome: nome,
            email: value.user.email,
            avatarUrl: null,
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Bem Vindo a Plataforma!")
        });
        redirect();
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error("Algo deu errado...");

      });
  }

  async function logoff(redirect) {
    await signOut(auth);
    localStorage.removeItem("SistemaUser");
    setUser(null);

    redirect()
  }

  function storageUser(data) {
    localStorage.setItem("SistemaUser", JSON.stringify(data));
  }


  return (
    <AuthContext.Provider
      value={{ 
        signed: !!user, 
        user, 
        loading, 
        signUp, 
        login, 
        logoff, 
        loadingAuth, 
        setUser,
        storageUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
