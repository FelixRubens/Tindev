import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity,  Image, TextInput } from 'react-native'
import logo from '../assets/logo.png'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

export default function Login({ navigation }){
    const [user, setUser] = useState('')
    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if(user) {
                navigation.navigate('Main', { user })
            }
        })
    }, [])
    
   async function handleLogin(){
        const response = await api.post('/users', {username: user})

        const { _id } = response.data
        await AsyncStorage.setItem('user', _id)
        navigation.navigate('Main', { user : _id })
    }

    return (
    <KeyboardAvoidingView
        behavior='padding'
        enabled={Platform.OS === 'ios'}    
        style = {styles.container}
    >
        <Image source={logo} />

        <TextInput 
            autoCapitalize='none'
            autoCorrect={false}
            placeholder="Digite seu Usuário no Github"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={setUser}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style = {styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    } ,

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    }
})