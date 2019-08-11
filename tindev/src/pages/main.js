import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';
import like from '../assets/like.png';
import logo from '../assets/logo.png';
import api from "../services/api";

export default function Main( {navigation} ){
    const id = navigation.getParam('user')
    let [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/users', {
                headers: {
                    user: id,
                }
            })
            setUsers(response.data)
        }
        loadUsers();
    }, [id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {  user: id }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [id])


    async function handleLike(){
        const [ user, ...rest ] = users

        await api.post(`/user/${user._id}/likes`, null, { headers: { user : id}})

        setUsers(rest)
    }

    async function handleDislike(){
        const [ user, ...rest ] = users

        await api.post(`/user/${user._id}/dislikes`, null, { headers: { user : id}})
        setUsers(rest)
    }

    async function handleLogout(){
        await AsyncStorage.clear()
        navigation.navigate('Login')
    }

    return (
    <SafeAreaView style = {styles.container}>
        <TouchableOpacity onPress={handleLogout}>
         <Image style = {styles.logo} source={logo}/>
        </TouchableOpacity>
        <View style={styles.cardsContainer}>
                { users.length === 0
                    ? !matchDev && <Text style={styles.empty}>That is all :(</Text>
                :
                users.map((user, index) => (
                 !matchDev &&
                     ( <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                        <Image   style = {styles.avatar} source={{uri: user.avatar}}/>
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                        </View>
                     </View>
                     ))
                )
                }

            
        </View>
        {users.length > 0 && !matchDev && (
            <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDislike} style = {[styles.button, styles.bx]}>
                <Image source={dislike}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style = {[styles.button, styles.bc]}>
                <Image source={like}/>
            </TouchableOpacity>
             </View>)}

            {  matchDev && (
                <View style={[styles.matchContainer, {zIndex: 100}]}>
                    <Image style = {styles.matchImage} source={itsamatch}/>
                    <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}}/>
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(false)}>
                        <Text style={styles.closeMatch}>CLOSE</Text>
                    </TouchableOpacity>
    
                </View>
            )}
    </SafeAreaView>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 600,
    },

    empty: {
        alignSelf: 'center',
        color: "#999",
        fontSize: 24,
        fontWeight: 'bold',
    },

    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 1,
    }, 

    avatar: {
        flex: 1, 
        height: 300,
    },

    footer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },

    logo: {
        margin: 15,
    },
    
    buttonsContainer : {
        flexDirection: 'row',
        marginBottom: 20,
    },

    button: {
        height: 50,
        width: 80,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        color: "#333",
        borderRadius: 25,
        alignItems: 'center',
        elevation: 2,
        borderColor: "#ddd",
    },

    bx:{
        marginRight: 40,
    },

    bc:{
        marginLeft: 40,
    },

    matchContainer: {
        position: 'absolute',
        zIndex: 5000,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent:'center',
        alignItems: "center"
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: "#FFF",
        marginVertical: 30,
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: "#fff",

    },


    matchBio: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: "center",
        paddingHorizontal: 30,
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: "center",
        fontWeight: 'bold'
    },
})