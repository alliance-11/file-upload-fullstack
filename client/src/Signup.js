import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import avatarDefault from './avatar_default.svg' // default avatar image

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

const Signup = () => {

  const [avatarPreview, setAvatarPreview] = useState( )
  const [error, setError] = useState()

  const { register, handleSubmit, formState: { errors } } = useForm()
  const history = useHistory()

  const onAvatarChange = (e) => {

    let fileSelected = e.target.files[0]  // grab selected file

    if(!fileSelected) return

    let fileReader = new FileReader()
    fileReader.readAsDataURL( fileSelected ) // concert to base64 encoded string
    // wait until file is fully loaded / converted to base64
    fileReader.onloadend = (ev) => {
      console.log("Base64 encoded file: ", fileReader.result.substring(0, 40) )
      // load base64 into preview img tag
      setAvatarPreview( fileReader.result )
    }
  }

  const onSubmit = async (jsonData) => {

    // merge avatar file with data
    jsonData.avatar = avatarPreview

    console.log("User to send: ", jsonData)

    // signup user in backend
    try {
      let response = await axios.post('/users', jsonData)
      console.log("User API: ", response.data) // => signed up user
      history.push('/users')  
    }
    // handle error
    catch(errAxios) {
      console.log( errAxios.response?.data.error )
      setError( errAxios.response?.data.error )
    }
  };

  return (
    <div id="frmSignup">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit( onSubmit )} autoComplete="off" >
        {/* AVATAR PREVIEW */}
        <div className="avatar-container">
          <label htmlFor="avatar">
            <img className="avatar-preview" src={ avatarPreview || avatarDefault } />
          </label>
        </div>
        <div className="input">
          <input {...register('nick', { required: 'Required' })} placeholder="Nickname..." />
        </div>
        <div className="input">
          <input {...register('email', { required: 'Required' })} placeholder="Email..." type="email" />
        </div>
        <div className="input">
          <input {...register('password', { required: 'Required!!'})} placeholder="Password..." type="password" />
        </div>
        <div>
          <input accept="image/*" type="file" 
            id="avatar" 
            name="avatar" 
            onChange={ onAvatarChange } /> 
        </div>
        <button type="submit">Signup</button>
        { error && <div className="error">{ error }</div> }
      </form>
    </div>
  );
};

export default Signup
