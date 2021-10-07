import React, { useEffect, useState } from 'react';
import avatarDefault from './avatar_default.svg' 
import axios from 'axios'
import { Link } from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

const UserList = () => {

  const [ users, setUsers ] = useState([])
  const [ loading, setLoading ] = useState( true )

  useEffect(() => {

    axios.get('/users')
    .then((response) => {
      console.log('Users received: ', response.data);
      setLoading(false)
      setUsers(response.data)
    })
    .catch(err => {
      console.log("[ERROR]:", err.response && err.response.data)
      setLoading(false)
    })

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
      { loading ? 
          <div className="loading"></div> :
          <div>{jsxUserList}</div>
      }
      <div>
        <Link to="/">Back to Signup</Link>
      </div>
    </div>
  );
};

export default UserList
