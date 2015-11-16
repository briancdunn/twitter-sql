var express = require('express');
var router = express.Router();
// could use one line instead: var router = require('express').Router();
var tweetBank = require('../tweetBank');
var User = require('../models').User;
var Tweet = require('../models').Tweet;

router.get('/', function (req, res) {
  // var tweets = tweetBank.list();
  Tweet.findAll({include: [User]})
  .then(function(tweets){
    res.status(200).render( 'index', { title: 'Twitter.js', tweets: tweets });
  });
});

function getTweet (req, res){
  // console.log(req.params);
  Tweet.findAll({
    include: [{
      model: User,
      where: { name: req.params.name }
    }],
    where: req.params.id ? { id: req.params.id } : {}
  }).then(function(tweets) {
    res.render('index', { tweets: tweets });
  });
  // var tweets = tweetBank.find(req.params);
  // res.render('index', { tweets: tweets });
}

function tweetDelete (req,res) {

  Tweet.destroy({where: {id: req.params.id}})
  .then(function() {
    res.redirect('/users/'+req.params.name);
  });
}

router.get('/users/:name', getTweet);
router.get('/users/:name/tweets/:id', getTweet);
router.get('/users/:name/tweets/:id/delete', tweetDelete);

// note: this is not very REST-ful. We will talk about REST in the future.
router.post('/submit', function(req, res) {
  User.findOrCreate({
    where: { name: req.body.name }
  }).then(function(user) {
    Tweet.create({
      UserId: user[0].dataValues.id,
      tweet:req.body.text
    }).then(function(tweet) {
      res.redirect('/');
    })
  }); 
});

module.exports = router;
