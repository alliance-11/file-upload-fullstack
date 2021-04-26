import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import avatarDefault from './avatar_default.svg' // default avatar image

const Signup = () => {

  const [avatarPreview, setAvatarPreview] = useState( avatarDefault )

  const { register, handleSubmit, formState: { errors } } = useForm()
  const history = useHistory()

  const onAvatarChange = (e) => {

    let fileSelected = e.target.files[0]  // grab selected file

    if(!fileSelected) return

    let fileReader = new FileReader()
    fileReader.readAsDataURL( fileSelected ) // concert to base64 encoded string
    // wait until file is fully loaded / converted to base64
    fileReader.onloadend = (ev) => {
      console.log( fileReader.result )
      // load base64 into preview img tag
      setAvatarPreview( fileReader.result )
    }
  }

  const onSubmit = async (jsonData) => {

    // merge avatar file with data
    jsonData.avatar = avatarPreview

    console.log(jsonData)

    // signup user in backend
    try {
      let response = await axios.post('http://localhost:5000/users', jsonData)
      console.log("Response: ", response.data) // => signed up user
      history.push('/users')  
    }
    // handle error
    catch(errAxios) {
      console.log(errAxios.response && errAxios.response.data)
    }
  };

  return (
    <div id="frmSignup">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit( onSubmit )} autoComplete="off" >
        {/* AVATAR PREVIEW */}
        <div>
          <label htmlFor="avatar">
            <img src={ avatarPreview } />
          </label>
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
          <input accept="image/*" type="file" id="avatar" name="avatar" onChange={onAvatarChange} /> 
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup
