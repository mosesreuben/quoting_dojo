// ------------------SETUP-----------------------------

var express = require("express");
var path = require("path");
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/quoting_dojo');
//--------------------------DB  SCHEMAS--------------------
var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2},
    quote: { type: String, required: true, minlength: 10}
  }, {timestamps: true});
  
  mongoose.model("Quote", QuoteSchema);
  var Quote = mongoose.model("Quote");
// --------------------------------------------------------
app.get("/", function(req, res) {
    res.render("index");
   })
   
   app.get("/quotes", function(req, res) {
     Quote.find({}, function(err, quotes){
       if(err){
         console.log("something went wrong");
         console.log(err);
         res.render("quotes", {title: "There are errors", errors: Quote.errors});
       }
       else{
         console.log("getting quotes");
         console.log(quotes);
         res.render("quotes", {quotes: quotes});
       }
     })
   })
   
   app.post("/quotes", function(req, res) {
    console.log("Posting Data", req.body);
   
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
   
    quote.save(function(err){
      if(err){
        console.log("something went wrong");
        console.log(err);
        res.render("index", {title: "There are errors", errors: quote.errors});
      }
      else{
        console.log("quote created");
        res.redirect("/quotes");
      }
    })
   })   
//--------------------LISTEN-----------------
app.listen(8000, function() {
    console.log("listening on port 8000");
   });