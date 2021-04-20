import React, { useEffect, useState } from 'react';
import avatarDefault from './avatar_default.svg' 
import axios from 'axios'

const UserList = () => {

  const [ users, setUsers ] = useState([])

  useEffect(() => {

    axios.get('http://localhost:5000/users')
    .then((response) => {
      console.log('Users received: ', response.data);
      setUsers(response.data)
    })
    .catch(err => console.log("[ERROR]:", err.response && err.response.data))

  }, [])

  const jsxUserList = users.map(user => (
    <div key={user._id} className="user-card">      
      <img src={user.avatar_url || avatarDefault} />
      <span>{user.nick}</span>
    </div>
  ))

  return (
    <div>
      <h1>User List</h1>
      <div>{jsxUserList}</div>
    </div>
  );
};

export default UserList
