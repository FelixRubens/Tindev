const express = require('express')
const userController = require('./controllers/userController')
const likeController = require('./controllers/likeController')
const dislikeController = require('./controllers/dislikeController')
const routes = express.Router()

routes.post('/users', userController.store)
routes.get('/users', userController.index)

routes.post('/user/:likedUser/likes', likeController.store)
routes.post('/user/:dislikedUser/dislikes', dislikeController.store)

module.exports = routes