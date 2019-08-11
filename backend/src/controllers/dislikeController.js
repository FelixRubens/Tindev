const devs = require('../models/devs')

module.exports = {
   async store(request, response){
        const { dislikedUser } = request.params
        const { user } = request.headers

        const loggedUser = await devs.findById(user)
        const targetUser = await devs.findById(dislikedUser)

        if(!targetUser){
            return response.status(400).json({error: 'User do not exists'})
        }
        
        if(!loggedUser.dislikes.includes(targetUser._id)){
            loggedUser.dislikes.push(targetUser._id)
            console.log('dislike inserted')
        }
        else{
            console.log('dislike already exists')
        }

        await loggedUser.save()
    
        return response.json(loggedUser)
    }
}