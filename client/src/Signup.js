import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import avatarDefault from './avatar_default.svg' // default avatar image

const Signup = () => {

  const [avatarFile, setAvatarFile] = useState() // this will store the actual file (BLOB)
  const [avatarPreview, setAvatarPreview] = useState( avatarDefault )

  const { register, handleSubmit, formState: { errors } } = useForm()
  const history = useHistory()

  const onAvatarChange = (e) => {

    let fileSelected = e.target.files[0]  // grab selected file
    let fileUrl = URL.createObjectURL( fileSelected ) // get me the URL to this blob file
    setAvatarPreview( fileUrl ) // change preview image
    setAvatarFile( fileSelected )
  }

  const onSubmit = async (jsonData) => {
    console.log(jsonData) // => JSON DATA ONLY

    // MIXED data (JSON + Binary file) 
    // => Content-Type: multipart Form Data
    // => Axios: Content-Type: application/json 

    const formData = new FormData() // => send multipart form data ()

    // put AVATAR FILE into form data
    formData.append('avatar', avatarFile)

    // loop over object keys and put JSON data into formData
    for(let key in jsonData) {
      formData.append(key, jsonData[key])
    }

    // signup user in backend
    try {
      let response = await axios.post('http://localhost:5000/users', formData, {
        headers: { 'Content-Type': 'undefined' }
      })
      console.log(response.data) // => signed up user
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
      <form onSubmit={handleSubmit( onSubmit )}>
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
