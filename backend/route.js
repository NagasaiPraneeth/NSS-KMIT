const router = require('express').Router();

const {addEvent,addvolunteer,getEvents,getVolunteers}=require('./controllers/NSS')
 router.post('/addEvent',addEvent)
 router.get('/getEvents',getEvents)
 router.get('/getVolunteers/:eventid',getVolunteers)
 router.post('/addvolunteer',addvolunteer)

module.exports = router