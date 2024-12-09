const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')


eventSchema= new mongoose.Schema({
    title:String,
    date : Date,
    location : String,
    duration : Number,
    description : String,
    volunteers : Array, 
});

volunteerSchema= new mongoose.Schema({
  name:String,
  rollno:String,
  service : Number,
  events : Array,
});


const event=mongoose.model('event',eventSchema)
const volunteer = mongoose.model('volunteer',volunteerSchema)

module.exports = {event,volunteer}