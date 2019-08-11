const devs = require('../models/devs')

module.exports = {
   async store(request, response){
        const { likedUser } = request.params
        const { user } = request.headers
        console.log(request.io, request.connectedUsers)
        const loggedUser = await devs.findById(user)
        const targetUser = await devs.findById(likedUser)

        if(!targetUser){
            return response.status(400).json({error: 'User do not exists'})
        }
        
        if(targetUser.likes.includes(user)){
            const loggedSocket = request.connectedUsers[user]
            const targetSocket = request.connectedUsers[likedUser]

            if(loggedSocket){
                request.io.to(loggedSocket).emit('match', targetUser)
            }

            if(targetSocket){
                request.io.to(targetSocket).emit('match', loggedUser)
            }
        }
        
        if(!loggedUser.likes.includes(targetUser._id)){
            loggedUser.likes.push(targetUser._id)
            console.log('like inserted')
        }
        else{
            console.log('like already exists')
        }
        await loggedUser.save()
    
        return response.json(loggedUser)
    }
}