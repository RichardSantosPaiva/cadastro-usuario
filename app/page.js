"use client";

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false); // Para garantir que a renderização ocorra apenas no cliente

  // Chama os dados do servidor após o componente ser montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []); 

  // Função para buscar usuários
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    }
    if (mounted) {
      fetchUsers();
    }
  }, [mounted]);

  // Função para criar novo usuário
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email) return;

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const newUser = await res.json();
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  // Função para deletar usuário
  const handleDelete = async (id) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const deletedUser = await res.json();
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletedUser.id));
  };

  // Condicional para renderizar apenas quando o componente for montado no cliente
  if (!mounted) {
    return <div>Carregando...</div>;  // Exibir um carregando ou placeholder enquanto o componente está sendo montado
  }

  return (
    <div>
      <h1>Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="border p-2 mr-2 text-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mr-2 text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Cadastrar
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button
              onClick={() => handleDelete(user.id)}
              className="bg-red-500 text-white p-1"
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
