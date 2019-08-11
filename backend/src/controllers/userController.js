const axios = require('axios')
const devs = require('../models/devs')


module.exports = {

    async index(request, response){

        function shuffle(array) {
            let m = array.length, t, i;
            while (m) {
              i = Math.floor(Math.random() * m--);
              t = array[m];
              array[m] = array[i];
              array[i] = t;
            }
            return array;
          }

        const { user } = request.headers
        const loggedUser = await devs.findById(user)
        const usersSeen = loggedUser.likes.concat(loggedUser.dislikes)
        let users = await devs.find()
        users = shuffle(users)
        function callback(usuario){
            return usuario._id != user && !usersSeen.includes(usuario._id)
        }
        users = users.filter(callback)
        users = shuffle(users)
        return response.json(users)
    },  

    async store(request, response){

        const { username } = request.body

        const userExists = await devs.findOne({ user: username })

        if(userExists){
            return response.json(userExists)
        }
        
        const axiosResponse = await axios.get('https://api.github.com/users/'+username)
            
        const {bio, avatar_url: avatar, name} = axiosResponse.data

        const dev = await devs.create({
            name: name || username,
            user: username,
            bio: bio || '.',
            avatar
        })
       
        return response.json(dev)
    }
}