'use strict';

const express     = require('express');
const mongoose = require('mongoose');
require('./dbConnect');

const {Schema} = mongoose;
const IssueCollection = new Schema({
    "issue_title": {type: String, required: true},
    "issue_text": {type: String, required: true},
    "created_on": Date,
    "updated_on": Date,
    "created_by": {type: String, required: true},
    "assigned_to": {type: String},
    "open": Boolean,
    "status_text": String
});
const ProjectCollection = new Schema({
    name:{type:String, required:true},
    issues: {IssueCollection}
});

const Issue = mongoose.model("Issue", IssueCollection);
const Project = mongoose.model("Project", ProjectCollection);

exports.Issue = Issue;
exports.Project = Project;




