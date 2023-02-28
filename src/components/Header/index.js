import React, {useContext} from 'react';
import './header.css';
import avatar from '../../assets/avatar.png';

import {AuthContext} from '../../contexts/auth';

import {Link} from 'react-router-dom';
import {FiHome, FiUser, FiSettings} from 'react-icons/fi';

export default function Header() {

const {user} = useContext(AuthContext);

 return (
   <div className='sidebar'>    
      <div>
        <img src={user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto do usuário" />
      </div>

      <Link to="/dashboard">
        <FiHome color='#fff' size={24} />
        Chamados
      </Link>

      <Link to="/customers">
        <FiUser color='#fff' size={24} />
        Clientes
      </Link>

      <Link to="/profile">
        <FiSettings color='#fff' size={24} />
        Configurações
      </Link>
   </div>
 );
}