'use strict';
const mongoose = require('mongoose');
const Issue = require('../collections').Issue;
const Project = require('../collections').Project;
const bodyParser = require("body-parser");

module.exports = function (app) {

  app.route('/api/issues/:project')  
    .get(function (req, res){
                   //console.log(req.query);
                   /*  console.log(req.query, "<------req.query ",req.params,"----params-body----", req.body); */
    const { issue_title, 
            issue_text,
            created_by,
            assigned_to,
            status_text,
            open  ,
            _id   ,
            created_on,
            updated_on    }  = req.query;
     // let created_on = new Date(req.query.created_on)
     
      let queryObj = req.query;
      
      //console.log("open param: ", open, " issue_title:   ", issue_title)
    let project = req.params.project; 
    Project.findOne({projectname: project},
             (err, data)  => {
       if(err || !data) {
        console.log("no data / err: ", err, { issue_title, 
            issue_text,
            created_by,
            assigned_to,
            status_text,
            open    ,
            "queryObj":   queryObj   });
        res.json([])
            }
             else {               
              if(Object.keys(queryObj).length != 0){
                  console.log("queryObj = true--->", queryObj)
                  for (let [key, value] of Object.entries(queryObj)) { 
                
                     data.issueLogs = data.issueLogs.filter(el => {  
  console.log("el[key]--+ key ",typeof el[key].toString(), el[key].toString(), " value-->", typeof value, value)
                       console.log(el[key].toString()==value)
             if(el[key])  {  
                if(key == "created_on"|| key == "updated_on")                              return el[key].toString() === new Date(value).toString();
                else return el[key].toString() === value;
                         }
             else return el
                   })               
                  }       
              //console.log("project data.logs-------", data.issueLogs);
              res.json(data.issueLogs)
          /*     res.json(data.issueLogs.map(item =>{
              return  {
                   "assigned_to": item["assigned_to"],
                    "status_text":  item["status_text"],
                    "open": item["open"], 
                    "_id" : item["_id"],
                    "issue_title":  item["issue_title"],
                    "issue_text":  item["issue_text"],    
                    "created_by":  item["created_by"],
                    "created_on": item["created_on"],
                    "updated_on":  item["updated_on"]
                }
              })); */
                  }   else {
                  //console.log("else data-----", data);
                  //console.log("else data.issueLogs-----", data.issueLogs);
                  
                  res.json(data.issueLogs)
                }
           }         
         })
    })
    .post(function (req, res){
      //console.log("params----",req.params)
      //console.log("body----",req.body)
      let project = req.params.project;
      const {issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text} = req.body;
      
      if(!issue_title || !issue_text || !created_by){
        res.send({error: "required field(s) missing"});
      } else  {
        const newIssue = new Issue ({
        issue_title: issue_title || "",
        issue_text: issue_text|| "",
        created_on: new Date().toUTCString() ,
        updated_on: new Date().toUTCString(),
        created_by: created_by || "",
        assigned_to: assigned_to||"",
        open: true,
        status_text: status_text||""
      });
                  //console.log("newIssue--------", newIssue)
      
      Project.findOne({projectname: project}, (err, data) => {
                  // console.log("err1: ", err);
                  // console.log("fetched Data: ", data);
        if(!data) {
          console.log("err2: ", err);
          const newProject = new Project({ projectname: project , issueLogs: newIssue});
          newProject.save((err, savedProject) => { 
                 // console.log('err3----',err)
                 // console.log("savedProject", savedProject); 
          res.json( newIssue );
             });
            } else {
           Project.findOneAndUpdate(
                 {projectname: project},
                 {$push: {issueLogs: newIssue}},
                 {new:true},
                 (err, newdata) => {
           // console.log("updated data-----",newdata)
            if(err || !newdata) 
             res.json({"error----": err})
            else{
            //  console.log("newdata----", newdata)
              res.json( newIssue );
            }
        })     
       }
      })
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
                      // console.log("params--->", req.params);
                      // console.log("body--->", req.body);
      const {issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            _id,
            open         } = req.body;
      let reqBody = req.body;
                    //console.log("reqBody", reqBody)
   
      for (let [key, value] of Object.entries(reqBody)) {
          if(value == ""|| key == '_id') delete reqBody[key];        
      }
                     // console.log("reqBody", reqBody);
      if(!_id) {
        console.log("error: missing _id", _id)
        return res.json({error:"missing _id"});
      }
      if(Object.keys(reqBody).length < 1) {
        console.log("error: no update field(s) sent", _id)
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }     
      
      Project.findOne({projectname: project}, (err, projectdata) => {
        if(err || !projectdata) {
          console.log("err || !projectdata", err);
          return res.json({ error: 'could not update', '_id': _id });
        }
       
     if((projectdata.issueLogs
         .filter(el => el._id.toString() == _id) ).length<1)
       return res.json({error: 'could not update', '_id': _id });
      projectdata.issueLogs.filter(el => el._id.toString() == _id)
                  .map(item => {
                    for (let [key, value] of Object.entries(reqBody)) {    
                      if(key != "_id") {
                       item[key] = value;            
                       }
                      }
                  if(!reqBody.hasOwnProperty('open')) item['open'] = true;
                  item['updated_on'] = new Date().toUTCString();          
                  })
       // console.log("projectdata----", projectdata);
        
     /*   projectdata.issueLogs.map(el => { 
          if(el._id.toString() == _id){ 
          for (let [key, value] of Object.entries(reqBody)) {           
          if(key != "_id") {
           el[key] = value;            
          }
          }
            if(!reqBody.hasOwnProperty('open')) el['open'] = true;
            el['updated_on'] = new Date().toUTCString();
          }          
          }); */
             
         projectdata.save((err, data) => {
          // console.log("data saved----", data)
         if(err || !data) {
           console.log("error: 'could not update', '_id': _id")
           return res.json({ error: 'could not update', '_id': _id });
         }
         else {
           console.log('successfully updated');
           return res.json({result: 'successfully updated', '_id': _id });
         }
       })
      })     
    })    //end api.put
    
    .delete(function (req, res){
      let project = req.params.project;  
      const { _id } = req.body;
       if(!_id) {
        console.log("error: missing _id", _id)
        return res.json({error:"missing _id"});
      }
      Project.findOne({projectname: project}, (err, projectdata) => {
        if(err || !projectdata) {
          console.log("err || !projectdata", err);
          return res.json({ error: 'could not delete', '_id': _id });
        }
       
     if((projectdata.issueLogs
         .filter(el => el._id.toString() == _id) ).length < 1)
      return res.json({ error: 'could not delete', '_id': _id });
     
      projectdata.issueLogs.pull({'_id': _id})  ;
        
      projectdata.save((err, data) => {
          // console.log("data saved----", data)
         if(err || !data) {
           console.log("error: 'could not delete', '_id': _id")
           return res.json({ error: 'could not delete', '_id': _id });
         }
         else {
           console.log('successfully del');
           return res.json({ result: 'successfully deleted', '_id': _id });
         }
       })
      }) 
    });

    //clear the database from previous tests
  app.get("/api/remove", function(req, res){
  let regex = /^fcc-project|test*/; 
  Project.deleteMany({projectname: regex}, (err, data)=>{
  if(err) console.error(err);
   else {   
  res.json("deleted" + data);}
      }); 
  })
};
