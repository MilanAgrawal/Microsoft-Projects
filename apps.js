const express=require('express')
const app=express()
const http=require('http')
const bodyparser=require("body-parser");
const ejs=require('ejs')//required for templating
const mongoose=require('mongoose')//required for database connection
const md5=require("md5")//used for encryption of data in the databases
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
app.use(express.static(__dirname+'/files'))//static files like css ,images and js files
app.use(bodyparser.urlencoded(
  {
    exxtended:true
  }));
mongoose.connect("/*removed due to privacy*/");//connecting to mongodb atlas
const userschema=new mongoose.Schema({
  email:String,
  password:String
});//new object which contains email and password
const secret="secrets";
const User=new mongoose.model("User",userschema);
app.get("/",function(req,res){
  res.render("home")
});//app renders home page in the starting
app.get("/login",function(req,res)
{
res.render("login")//when get request is made to the login route the login.ejs file is rendered
});
app.get("/register",function(req,res)
{
res.render("register")//when get request is made to the register route the register.ejs file is rendered
});
app.post("/leavemeetingssss",function(req,res){
  res.render("home")//when the user clicks on the end meeting button then post request made there is handled here and home page is rendered
})
app.post("/register",function(req,res){
  const newuser=new User({
    email:req.body.username,
    password:md5(req.body.password) //when the user has registered and they click the submit button then a post request is made to the register branch which is handled here
  });
  newuser.save(function(err){
    if(err)
    console.log(err);//the data which is collected by the registration form is added to the database 
    else
    res.render("home");
  })
})
app.get('/:room', (req, res) => {//when request goes to the dynamic id created by uuid
    res.render('room', { roomId: req.params.room })//ADD AND RENDER EJS TEMPLATE HERE IN PLACE OF THE INDEX.HTML FILE
})
app.post("/login",function(req,res){//when the user makes a post request to the login page then the username and password is checked from the database and if correct then the user is redirected to the room for meeting
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
