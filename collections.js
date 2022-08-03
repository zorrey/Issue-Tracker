const express     = require('express');
const mongoose = require('mongoose');
require('./dbConnect');

const { Schema } = mongoose;

const IssueSchema = new Schema({
    "assigned_to": {type: String},
    "status_text": String,
    "open": Boolean,  
    "issue_title": {type: String, required: true},
    "issue_text": {type: String, required: true},    
    "created_by": {type: String, required: true},
    "created_on": Date,
    "updated_on": Date
});
const ProjectSchema = new Schema({
    projectname:{type:String, required:true},
    issueLogs: [ IssueSchema ]
});

const Issue = mongoose.model("Issue", IssueSchema);
const Project = mongoose.model("Project", ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;




