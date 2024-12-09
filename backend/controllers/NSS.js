const express = require('express');
const app = express();
const { event,volunteer} = require('../Schema');
const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');

const addEvent = async (req, res) => {
    try {
        const {formData}=req.body;
        const info = formData;
        let newEvent = new event({});
        newEvent = await newEvent.save();
        const id = newEvent._id;
        const currentEvent = await event.findOne({ _id: id });
        currentEvent.title=info.title;
        currentEvent.date=info.date;
        currentEvent.location=info.location;
        currentEvent.duration=info.duration;
        currentEvent.description=info.description;

        await currentEvent.save();
        console.log("added data suceesfully");

        res.json({data : true});
    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve reports' });
    }
}
const addvolunteer = async (req, res) => {
    try {
        console.log("hiiii")
        
        const {Volunteer}=req.body;
        console.log(Volunteer)
        const info = Volunteer
        const result = info.duration.slice(9);
        const finalservice=Number(result)
        let newVolunteer = new volunteer({});
        newVolunteer = await newVolunteer.save();
        const id = newVolunteer._id;
        const currentVolunteer = await volunteer.findOne({ _id: id });
        currentVolunteer.service=0;
        currentVolunteer.name=info.name;
        currentVolunteer.rollno=info.role;
        currentVolunteer.service=currentVolunteer.service+finalservice;
        
        if (!currentVolunteer.events) {
            currentVolunteer.events = [];
        }
        const eventObjectId = new mongoose.Types.ObjectId(info.eventid);
        currentVolunteer.events.push(eventObjectId);
        await currentVolunteer.save();

        const currentevent = await event.findOne({ _id: eventObjectId });
        if (!currentevent.volunteers) {
            currentevent.volunteers = [];
        }
        currentevent.volunteers.push(id);
        await currentevent.save();




        console.log("added data successfully");
        res.json({data: true});
    
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve reports' });
    }
}
const getEvents = async (req,res) => {
    const events = await event.find() // TODO: add session oldagehome queryfetch 
    //console.log("ho",events)
    res.json(events);
}
const getVolunteers = async (req, res) => {
    try {
      // Extract event ID from request parameters
      const eventid = req.params.eventid;
      const eventObjectId = new mongoose.Types.ObjectId(eventid);
  
      // Fetch the event document by ID
      const events = await event.findById(eventObjectId);
  
      // Check if the event exists
      
  
      // Retrieve volunteer IDs from the event's `volunteers` field
      const volunteerIds = events.volunteers;
  
      // Fetch detailed information for each volunteer
      const volunteerDetails = await volunteer.find({ _id: { $in: volunteerIds } });
  
      // Respond with the volunteer details as an array
      res.status(200).json(volunteerDetails);
    } catch (error) {
      console.error("Error fetching event volunteers:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { addEvent,addvolunteer,getEvents,getVolunteers }