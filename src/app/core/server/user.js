const express = require('express')
const db = require('./db')
const userRouter = express.Router();
const bcrypt = require('bcrypt')

const { hashSync, genSaltSync, compareSync } = require('bcrypt')



module.exports = userRouter


userRouter.get('/getrankings', async (req, res) =>{
    const rankings = await db.getRankings()

    res.json(rankings)
})

userRouter.post('/setrankings', async (req, res) =>{
    const setAllRankings = await db.setRankings(req)

    res.json(setAllRankings)
})

userRouter.post('/sendDataToServer', async (req, res) => {
    const sendresult = await db.sendDataToServer(req)

    //sql2 = ''
})

userRouter.get('/geteater/:playerid', async (req, res) =>{
    const eaterResult = await db.getEater(req)

    res.send(eaterResult)
})


userRouter.get('/autoLogin', async (req, res) => {
    const token = req.cookies.token

    const user = await db.checkToken(token)
    user.password = null
    
    const lessonData = await db.getLessonData(user.id)

    res.send([user, lessonData])
})

userRouter.put('/changeUserInfo', async (req, res) => {
    const response = await db.changeUserData(req);
    res.cookie('token', response, {httpOnly: true, secure: false, sameSite: 'strict', 
    expires: new Date(Date.now() + 30 * 60 * 1000)})
})