import React , { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import '../pages/main.css'
import dislike from '../assets/dislike.svg'
import api from '../services/api'
import itsamatch from '../assets/itsamatch.png'

export default function Main({ match }){
    let [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/users', {
                headers: {
                    user: match.params.id,
                }
            })
            setUsers(response.data)
        }
        loadUsers();
    }, [match.params.id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {  user: match.params.id }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [match.params.id])

    async function handleLike(id){
        await api.post(`/user/${id}/likes`, null, { headers: { user : match.params.id}})

        setUsers(users.filter(user => user._id != id))
    }

    async function handleDislike(id){
        await api.post(`/user/${id}/dislikes`, null, { headers: { user : match.params.id}})
        setUsers(users.filter(user => user._id != id))
    }
    
    return (
        <div className="mainContainer">
            <Link to ='/'>
                <img src={logo} alt="Tindev"/>
            </Link>
                {users.length > 0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                <img src ={user.avatar} alt={user.name}  style={{width: 100 + '%'}} />
                                <footer>
                                    <strong>
                                        {user.name}
                                    </strong>
                                    <p>
                                        {user.bio}
                                    </p>
                                </footer>
                                <div className = "buttons">
                                    <button type = "button" onClick={ () => handleLike(user._id)}>
                                        <img src = {like} alt = "Like"/>
                                    </button>
                                    <button type = "button" onClick={ () => handleDislike(user._id)}>
                                        <img src = {dislike} alt = "Dislike"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ): (
                    <div className="empty">that is all :(</div>
                )}

                { matchDev && (
                    <div className="matchContainer">
                        <img src={itsamatch} alt=""/>
                        <img className="avatar" src={matchDev.avatar} alt=""/>
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        <button type="button" onClick={() => setMatchDev(null)}>CLOSE</button>
                    </div>
                )}
        </div>
    )
}