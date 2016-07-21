var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var jwt = require('jwt-simple');
var middleware = require('./middleware');
var TestCase = mongoose.model('TestCase');

module.exports = function(app, passport) {

  //Get the cases
  app.get('/api/testCase', middleware.ensureAuthenticated, function(req, res) {
    TestCase.find({}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            res.send(ts);
          }else{
            return res.status(500).send({ message: 'Cases not found' });
          };
        }
    });
  });

  //Get the cases
  app.get('/api/testCase/:id', middleware.ensureAuthenticated, function(req, res) {
    TestCase.findOne({_id: req.params.id},function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            res.send(ts);
          }else{
            return res.status(500).send({ message: 'Case not found' });
          };
        }
    });
  });

  //add a new test case
  app.put('/api/testCase', middleware.ensureAuthenticated, function(req, res) {
      var newTC = new TestCase({
        name: req.body.newTC.name,
        description: req.body.newTC.description,
        preconditions: req.body.newTC.preconditions,
        isHappyPath: req.body.newTC.isHappyPath,
        isErrorPath: req.body.newTC.isErrorPath,
        priority: req.body.newTC.priority,
        status: req.body.newTC.status,
        steps: req.body.newTC.steps,
        keywords: req.body.newTC.keywords,
        parent: req.body.newTC.parent
      });
      newTC.save(function(err, result) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
      });
      return res.send(newTC);
  });


  //update a field
  app.post('/api/testCase/field/:id', middleware.ensureAuthenticated, function(req, res) {
    TestCase.findOne({_id: req.params.id}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (!ts) {
            return res.status(500).send({ message: "Case test doesn't exists" });
          }else{
            ts[req.body.field] = req.body.newValue;
            TestCase.findOneAndUpdate({_id:req.params.id}, ts, {upsert:true}, function(err, doc){
                if (err) res.status(500).send({ message: err.message });
                return res.send("succesfully saved");
            });
          };
        }
    });
  });

  //update all field
  app.post('/api/testCase/:id', middleware.ensureAuthenticated, function(req, res) {
    TestCase.findOne({_id: req.params.id}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (!ts) {
            return res.status(500).send({ message: "Case test doesn't exists" });
          }else{
            
            //TODO for each field, if  req.body.testProject.XXX is undefined, not replace!!
            ts.name = req.body.name;
            ts.description = req.body.description;
            ts.isHappyPath = req.body.isHappyPath;
            ts.isErrorPath = req.body.isErrorPath;
            ts.priority = req.body.priority;
            ts.status = req.body.status;
            ts.keywords = req.body.keywords;

            TestCase.findOneAndUpdate({_id:req.params.id}, ts, {upsert:true}, function(err, doc){
                if (err) res.status(500).send({ message: err.message });
                return res.send("succesfully saved");
            });
          };
        }
    });
  });

  //delete a test plan
  app.delete('/api/testCase/:id', middleware.ensureAuthenticated, function(req, res) {
    TestCase.findOne({_id: req.params.id}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            ts.remove(function(err, result) {
              if (err) {
                res.status(500).send({ message: err.message });
              }
              return res.send("succesfully deleted");
            });
          }else{
            return res.status(500).send({ message: "Case test doesn't exists" });
          };
        }
    });
  });
};
