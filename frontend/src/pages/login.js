import React, { useState } from 'react'
import './login.css'
import logo from '../assets/logo.svg'
import api from '../services/api'


export default function Login({ history }){
    const [username, setUsername] = useState('')

    async function handleSubmit(e){
        e.preventDefault();
         const response = await api.post('/users', {
             username,
        })
        
        const { _id} = response.data

        history.push(`/user/${_id}`)
    }

    return(
            <div className ="loginContainer">	
                <form onSubmit= {handleSubmit}>
                    <img src = {logo} alt = "tindev"></img>
                    <input placeholder="Digite Seu Usuário no Github"
                    value={username}
                    onChange={e => {
                        return setUsername(e.target.value)
                    }}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>

    )
}