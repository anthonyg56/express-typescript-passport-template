import express from 'express'
import passport from 'passport'
import { checkAuth } from '../controllers/auth_controller'

import User, { IUser } from '../models/user'

const UserRouter = express.Router()

// Find a user
UserRouter.get('/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id).exec()

  if (!user) {
    return res.status(400).json({ errors: "No user found" })
  }

  return res.status(200).json({ message: "Found user", user })
})

// Update user password by id
UserRouter.put('/:id/update/password', checkAuth, async (req, res, next) => {
  const { params, body } = req

  const user = await User.findById(params.id)

  if (!user) {
    return res.status(400).json({ errors: "No user found" })
  }

  user.password = body.password
  user.save()

  return res.status(200).json({ message: "user password updated", user })
})

export default UserRouter
