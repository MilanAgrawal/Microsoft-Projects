const socket=io('/')
const myPeer= new Peer()
const videoGrid = document.getElementById("video-streaming");/*the video element to which the video stream is to be added*/
const myVideo = document.createElement("video");
myVideo.muted = true;//not hear our voice echoing back 
let username;
let myVideoStream;
var getUserMedia =
navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia;
navigator.mediaDevices.getUserMedia({
video: true,
audio: true
}).then(stream =>{
  myVideoStream=stream;

addVideoStream(myVideo,stream)/*adding our videos stream to the videoGrid element*/
/*when someone calls ,we answer back giving our video stream and responding to the stream sent by them*/
myPeer.on('call',(call)=>
{
  call.answer(stream);
  const video=document.createElement("video");
  call.on('stream',(userVideoStream)=>{
    addVideoStream(video,userVideoStream)
  })
})

/*when new user joins our room we allow our video and audio stream to be shared with the other users*/
socket.on('user-connected',(userId)=>{

  console.log(userId+"connected in the calls")
  connectToNewUser(userId,stream);
  //new functionality of fc function timeout to update the users stream
})
})
myPeer.on("open",(id)=>{
let username=prompt("enter name");
  socket.emit("join-room",ROOM_ID,id);

  console.log(username)
})
const connectToNewUser=function(userId,stream){
/*calling the user and sending our video and audio stream*/
  const call=myPeer.call(userId,stream)
  const video=document.createElement('video')
  /*taking the user video stream*/
  call.on('stream',(userVideoStream) =>{
    /*taking user video and audio stream and adding to ours pages*/
    addVideoStream(video,userVideoStream)
  })
  /*rmoves the videos when the user leaves the calls*/
    call.on('close',()=>{
    video.remove()
  })
}

const addVideoStream=(video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
       video.play();
    });
videoGrid.append(video);
}
/*The send button in chat box sends the value in the input elements to the server and then it is broadcasted to all the users in the same room and is appended to the list items of ul.
*/
const objectss=$('.adds #heaa')
const buttonss=$('.adds #buttonclasses')
objectss.keyup((e)=>{
  if(e.code=== 'Enter'){
    buttonss.click();
  }
})
//when the users add any chat messages and click on the send button or press enter key ,then if it is empty message they get an alert, else the messages are sent to everyone via web sockets
buttonss.on('click',function(){
  console.log(objectss.val())
  if(objectss.val()==""){
  const chatboxclassessadderss=$(".chat-sectionsareas");
  alert('type something in the chatbox');
}
else
{
  socket.emit('messages',objectss.val())
  objectss.val('')
}
})

/*add the socket.disconnected event here*/
socket.on('broadcastingss',messages=>{
console.log(messages);
  const date=new Date()
  o=date.getHours()+":"+date.getMinutes();//date is appended to the messages and are added to the chatboxes
const chatboxclassessadderss=$(".chat-sectionsareas");
chatboxclassessadderss.append(`<div class="chatboxes"><div class="messagesent">${messages}</div><div class="smallerss">${o}<div></div>`)})

$("#yoee").on('click',function(){
  $(".displaybox").toggleClass('styledisplay');
})//function for displaying and hiding the notepad in the chat area

function doMute (){
  document.querySelector('.microphonesmute').innerHTML = `<i class="fas fa-microphone"></i>`;
document.querySelector('.microphonesmute').classList.remove("mute")
}//allowing user to  add some styles to the buttons when muted

function doUnmute (){
  document.querySelector('.microphonesmute').classList.add("mute")
  document.querySelector('.microphonesmute').innerHTML = `<i class="unmute fas fa-microphone-slash"></i><span></span>`;
//allowing user to add some styles to the buttons when unmuted
}
//unmute and mute microphone when mute button is clicked
function togglemuteUnmute () {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    doUnmute();
  } else {
    doMute();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}
//show and close video when video button is clicked
function togglevideo(){
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    PlayVideo()
  } else {
    StopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}
let d =new Date();
document.getElementById('datetimecheckdevices').innerHTML=d.toDateString();
function copyText() {
   const textToCopy = window.location.href;
    textToCopy.focus
    navigator.clipboard.writeText(textToCopy)
    .then(() => { alert(`Copied!`)
})
.catch((error) => { alert(`Copy failed! ${error}`) }) }


function StopVideo (){
  document.querySelector('.videosmute').innerHTML = `<i class="fas fa-video"></i>`;
document.querySelector('.videosmute').classList.remove("mute")
}//styles to video button

function PlayVideo (){
  document.querySelector('.videosmute').innerHTML = `<i class="stop fas fa-video-slash"></i>`;
document.querySelector('.videosmute').classList.add("mute")
}//styles to video button
