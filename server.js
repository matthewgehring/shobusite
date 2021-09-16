//TODO: implement UUID for session codes
const uuidv4 = require('uuid').v4;
const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }
});
const path = require('path');
const Session = require('./sessionObject').Session;

var codeToSession = {}; //only for joining lobbies
var SocketToSession ={};
let MessageSocketToSession = {}

function socketEvents(socket){
    //session create (player 1)
    socket.on("create-session", (name)=> {

        //first create a unique code
        //TODO: Replace this we a UUID
        var code = Math.floor(Math.random()*1000000).toString();
        
        //create a new session, constructor takes a name, socket, and code.
        //socket is created when the server is hit via navigating to localhost:3000 or the heroku instance. 
        const session = new Session(name,socket,code);

        codeToSession = {...codeToSession, 
                        [code]:session };
        
        SocketToSession = {...SocketToSession,
                        [socket.id]:session};

        MessageSocketToSession = {...MessageSocketToSession,
                                    [code]: []}
        
        socket.emit("session-created",name,code);
        socket.on("disconnect", ()=> {
            try{
            SocketToSession[socket.id].player_two_socket.emit("user-disconnected");
            }
            catch(err){
                ;
            }
            
            delete codeToSession[code];
            delete SocketToSession[socket.id];
            
            
        })
        // console.log("code", codeToSession)
        // console.log("socket", SocketToSession)
    })

    //join session (player 2)
    socket.on("join-session",(code,name)=>{
        //failed session code 
        if(codeToSession[code]===undefined){
            socket.emit("invalid-code");
        }
        else{
            codeToSession[code].JoinSession(name,socket);
            codeToSession[code].Broadcast("valid-code", (code, codeToSession[code].gameState));
            SocketToSession = {...SocketToSession,
            [socket.id]: codeToSession[code]};

            delete codeToSession[code];
            socket.on("disconnect", ()=> {
                try{
                    SocketToSession[socket.id].player_one_socket.emit("user-disconnected");

                }
                catch(err){
                    console.log(err);
                }
                
                delete SocketToSession[socket.id];
            })
        }

    
        // console.log("code", codeToSession)
        // console.log("socket", SocketToSession)
    })

    //game logic
    socket.on("player-move", (player, moves)=> {
        
        SocketToSession[socket.id].PlayerMove(player, moves);

        switch(SocketToSession[socket.id].checkWinner()){
            case "player_one":                
                SocketToSession[socket.id].Broadcast("announcement","player_one");
                break;
            case "player_two":
                SocketToSession[socket.id].Broadcast("announcement","player_two");
                break;
            case "tie":
                SocketToSession[socket.id].Broadcast("announcement","tie");
                break;
            case "ongoing":
                break;
            default:
                console.log("no switch cases hit");
        }
        
        //TODO: check winners before broadcasting
        SocketToSession[socket.id].Broadcast("update",SocketToSession[socket.id].gameState);
    })
}
const messages = []
function messageEvents(socket){
    socket.on('message', (code, message, name)=>{
        const [socket1, socket2] = MessageSocketToSession[code]
        const packet = {id: uuidv4(),
                        user: {name: name},
                        value: message,
                        time: Date.now()}              
        // messages.push(packet)
        // messages.forEach((message) => socket1.emit('message', message));
        // messages.forEach((message) => socket2.emit('message', message));
        socket1.emit('message', packet);
        socket2.emit('message', packet);
    })

    socket.on('joined-chat', (code)=>{
        MessageSocketToSession[code].push(socket)
    })
}

//main namespace
io.on('connection', socketEvents);
//message namespace
const message = io.of("/message")
message.on("connection", messageEvents)


const port = process.env.PORT || 8000;

//this is for the production build of the app
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'));
    });
}

server.listen(port);