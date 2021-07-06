const express=require('express')
const app=express()
const http=require('http')
const bodyparser=require("body-parser");
const ejs=require('ejs')
const mongoose=require('mongoose')
const md5=require("md5")
const encrypt=require("mongoose-encryption");
const server= http.createServer(app)
const io=require('socket.io')(server)//enables user client communication
//socket.io connected to the server
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
  debug:true,
});

app.use('/peerjs',peerServer);
const { v4: uuidv4 } = require('uuid');
app.set('view engine','ejs')
app.use(express.static(__dirname+'/files'))
app.use(bodyparser.urlencoded(
  {
    exxtended:true
  }));
mongoose.connect("mongodb+srv://milan_2001:Milan@2001@cluster0.jtxdt.mongodb.net/userDB",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const userschema=new mongoose.Schema({
  email:String,
  password:String
});
const secret="secrets";
const User=new mongoose.model("User",userschema);
app.get("/",function(req,res){
  res.render("home")
});
app.get("/login",function(req,res)
{
res.render("login")
});
app.get("/register",function(req,res)
{
res.render("register")
});
app.post("/leavemeetingssss",function(req,res){
  res.render("home")
})
app.post("/register",function(req,res){
  const newuser=new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newuser.save(function(err){
    if(err)
    console.log(err);
    else
    res.render("home");
  })
})
app.get('/:room', (req, res) => {//when request goes to the dynamic id created by uuid
    res.render('room', { roomId: req.params.room })//ADD AND RENDER EJS TEMPLATE HERE IN PLACE OF THE INDEX.HTML FILE
})
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=md5(req.body.password);
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err)
    }
    else{
      if(foundUser)
      {
        if(foundUser.password==password){
        res.redirect(`/${uuidv4()}`);
        }
      }
    }

  })
})
io.on('connection',(socket)=>{
socket.on('join-room',(roomId,userId)=>{
socket.join(roomId);
  socket.broadcast.to(roomId).emit('user-connected',userId);
  /*socket.on('disconnect' , ()=>{
         socket.broadcast.to(roomId).emit('userDisconnect' , userId);
     })*/
var date=new Date()
     socket.on('messages',messages=>{
       io.to(roomId).emit('broadcastingss',messages)
     })

})
})
let port=process.env.PORT
if(port==null||port==""){
  port=3005;
}
server.listen(port,function()
{
  console.log('server started on port 3005')
})
