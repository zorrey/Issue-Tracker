const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let idTest = '';
let idTest2 = '';
let idTest3 = '';
suite('Functional Tests', function() {  
  
  suite('Three Tests for Post request', function(done) {   //})
    //#1
    test('Create an issue with every field: POST request', function(done){
       chai
        .request(server)
        .post('/api/issues/someproject')
        .send({
            issue_title: 'title', 
            issue_text: 'test all fields filled in',
            created_by: 'test - all fields',
            assigned_to: 'chai',
            status_text: 'in progress'
        }).end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'title')
          assert.equal(res.body.issue_text, 'test all fields filled in')
          assert.equal(res.body.created_by, 'test - all fields')
          assert.equal(res.body.assigned_to, 'chai')
          assert.equal(res.body.status_text,'in progress')
          idTest1 = res.body._id;
          console.log("idTest" , idTest1)
          done();
        })
      
    })
    //#2
    test('Create an issue with required fields: POST request', function(done){
       chai
        .request(server)
        .post('/api/issues/someproject')
        .send({
            issue_title: 'title', 
            issue_text: 'required fields filled in',
            created_by: 'test - required fields'
        }).end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'title')
          assert.equal(res.body.issue_text, 'required fields filled in')
          assert.equal(res.body.created_by, 'test - required fields')
          assert.equal(res.body.assigned_to, '')
          assert.equal(res.body.status_text,'')
          idTest2 = res.body._id
          done();
        })      
    });
    //#3 - Create an issue with missing required fields: POST request
    test('Create an issue with missing required fields: POST request', function(done){
       chai
        .request(server)
        .post('/api/issues/someproject')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          console.log(res.body)
          assert.equal(res.body.error, "required field(s) missing")
          idTest3 = res.body._id
          done();
        })      
    });  
    
  }) //end check post requests

  suite('Three Tests on GET requests', function() {
    
      //#4 - View issues on a project: GET request to /api/issues/{project}
    test('View issues - no filter: GET request', function(done){
       chai
        .request(server)
        .get('/api/issues/someproject')
        //.query({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json');
              console.log("get all issues res.body: ----> ",res.body[0]);
               console.log("idTest1" , idTest1)
          assert.isArray(res.body, 'get all issues returns array')
    /*  issue_title, issue_text, created_by, assigned_to, status_text,
            open  , _id   , created_on, updated_on */
               
        res.body.forEach(issue => {
          assert.property(issue, 'issue_title');
          assert.property(issue, 'issue_text');
          assert.property(issue, 'created_by');
          assert.property(issue, 'assigned_to');
          assert.property(issue, 'status_text');
          assert.property(issue, 'open');
          assert.property(issue, '_id');
          assert.property(issue, 'created_on');
          assert.property(issue, 'updated_on');
        })
                  
      /*    testBody = res.body.filter(el=> el._id==idTest);
          if(Object.keys(testBody).length === 0) console.log("error - no issue#1 from post method ", err) 
          assert.equal(testBody.issue_title, 'title');
          assert.equal(testBody._id, idTest);          
          assert.equal(testBody.issue_text, 'test all fields filled in');        */
          done();
        })      
    });     //end test #4
    
      //# 5 - View issues on a project with one filter
    test('One filter: GET request', function(done){
       chai
        .request(server)
        .get('/api/issues/someproject')
        .query({created_by: 'test - all fields'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json');
              console.log("get with one filter: ----> ",res.body);        
          assert.isArray(res.body, 'returns array with filtered issues')
          
    res.body.forEach(issue => {
          assert.equal(issue.created_by, 'test - all fields');
           })
         done();
        })      
    });     //end test #5
    
      //# 6 - View issues on a project with multiple filters
    test('Multiple filters: GET request', function(done){
       chai
        .request(server)
        .get('/api/issues/someproject')
        .query({created_by: 'test - all fields', issue_title: 'title'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.type, 'application/json');
              console.log("get with many filters: ----> ",res.body);       
          assert.isArray(res.body, 'returns array with filtered issues')
          
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'test - all fields');
          assert.equal(issue.issue_title, 'title');
           })
         done();
        })      
    });     //end test #6
    
   
    
  })        //end test GET suite

   suite('Five Tests on PUT requests', function(done) {
     
      //# 7 - Update one field on an issue: PUT request to /api/issues/{project}
        test('Update one field on an issue: PUT request', function(done){
         chai
          .request(server)
          .put('/api/issues/someproject')
          .send({_id:idTest1, 
                 issue_title: 'newtitle'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, idTest1);        
           done();
          })      
        });     //end test #7
      //# 8 - Update multiple fields on an issue: PUT request
        test('Update multiple field on an issue: PUT request', function(done){
         chai
          .request(server)
          .put('/api/issues/someproject')
          .send({_id:idTest2, 
                issue_title: 'newtitle',
                created_by: "Put2",
                issue_text: 'Put test 2 update'                 
                })
          .end(function(err, res){
            //console.log('idtest2', idTest2)
            //console.log('res.body---', res.body)
            
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, idTest2);         
           done();
          })      
        });     //end test #8
     
      //# 9 - Update an issue with missing _id: PUT request
        test('Update an issue with missing _id: PUT request', function(done){
         chai
          .request(server)
          .put('/api/issues/someproject')
          .send({
                issue_title: 'newtitle'             
                })
          .end(function(err, res){            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");     
           done();
          })      
        });     //end test #9
     
      //# 10 - Update an issue with no fields to update: PUT request
        test('Update an issue with no fields to update: PUT request', function(done){
         chai
          .request(server)
          .put('/api/issues/someproject')
          .send({
                _id: idTest2             
                })
          .end(function(err, res){    
            console.log('idtest2', idTest2)
            console.log('res.body---', res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent"); 
            assert.equal(res.body._id, idTest2); 
           done();
          })      
        });     //end test #10
      //# 11 - Update an issue with an invalid _id: PUT request
        test('Update an issue with an invalid _id: PUT request', function(done){
         chai
          .request(server)
          .put('/api/issues/someproject')
          .send({
                _id: 'soooinvalid',
                issue_title: 'newtitle'
                })
          .end(function(err, res){    
            console.log('res.body---', res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update'); 
           done();
          })      
        });     //end test #11
     
   }) //end PUT suite
   suite('Three Tests for Delete request', function(done) {
    
     //# 12 - Delete an issue: DELETE request to /api/issues/{project}
        test('Delete an issue: DELETE request', function(done){
         chai
          .request(server)
          .delete('/api/issues/someproject')
          .send({
                _id: idTest1
                })
          .end(function(err, res){    
            console.log('res.body---', res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted'); 
           done();
          })      
        });     //end test #12
     //# 13 - Delete an issue with an invalid _id: DELETE request
        test('Delete an issue with an invalid _id: DELETE request', function(done){
         chai
          .request(server)
          .delete('/api/issues/someproject')
          .send({
                _id: 'soooinvalid123'
                })
          .end(function(err, res){    
            console.log('res.body---', res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not delete'); 
           done();
          })      
        });     //end test #13
     //# 14 - Delete an issue with missing _id: DELETE request
        test('Delete an issue with missing _id: DELETE request', function(done){
         chai
          .request(server)
          .delete('/api/issues/someproject')
          .send({})
          .end(function(err, res){    
            console.log('res.body---', res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id'); 
           done();
          })      
        });     //end test #14
   })
  
});
