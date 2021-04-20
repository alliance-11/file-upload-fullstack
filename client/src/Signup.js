import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import avatarDefault from './avatar_default.svg' // default avatar image

const Signup = () => {

  const [avatarFile, setAvatarFile] = useState()
  const [avatarPreview, setAvatarPreview] = useState( avatarDefault )

  const { register, handleSubmit, formState: { errors } } = useForm()
  const history = useHistory()

  const onAvatarChange = (e) => {
    console.log("Avatar Image Changed...")
  }

  const onSubmit = (data) => {
    console.log(data)
  };

  return (
    <div id="frmSignup">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit( onSubmit )}>
        <div>
          {/* AVATAR PREVIEW SHOULD GO HERE:.. */}
        </div>
        <div>
          <input {...register('nick', { required: 'Required' })} placeholder="Nickname..." />
        </div>
        <div>
          <input {...register('email', { required: 'Required' })} placeholder="Email..." type="email" />
        </div>
        <div>
          <input {...register('password', { required: 'Required!!'})} placeholder="Password..." type="password" />
        </div>
        <div>
          <input id="avatar"  type="file" onChange={onAvatarChange} />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup
