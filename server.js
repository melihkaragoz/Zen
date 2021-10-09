var http = require('http')
var express = require('express')
var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server,{
    rejectUnauthorized:false
})//.listen(server)
const port = 8000;
var clients = [];
var clientNames = [];
var otherUser;

app.get('/',(req,res)=>{
    app.use(express.static(__dirname+'/home'))
    res.sendFile('./home/index.html',{root:__dirname})
})

io.on('connection',function(socket){
    console.log('bir kullanici baglandi. {'+socket.id+'}')
    io.emit('userActions','bir kullanici baglandi.')
    socket.on('chat message',function(msg){
        clientNames = []
        clients.forEach(function(item){
            clientNames.push(item['nick']) 
        })
        var data = {
            'nickname' : undefined,
            'message' : undefined,
        }
        if(msg != ''){
            clients.forEach(function(item){
                if(item['id'] == socket.id){
                    console.log(item['nick']+"'den bir mesaj var.")
                    data['nickname'] = item['nick']
                }
            })
            data['message'] = msg   
            // console.log('giden data => '+data['nickname'])
            io.emit('users',clientNames)
            io.emit('chat message',data)
        }
    })
    socket.on('disconnect',function(msg){
        console.log('bir kullanici ayrildi')
        io.emit('userActions','bir kullanici ayrildi')
    })
    socket.on('nickname',function(nickname){
        clients.forEach(function(item){
            clientNames.push(item['nick']) 
            console.log(' odadaki kullanıcılar =>  '+item['nick'])
        })
        var otherUser;
        var client = {
            'nick' : undefined,
            'id' : undefined
        }
        console.log(socket.id+" id'li kullanıcıdan nickname geldi : "+nickname)
        socket.emit('userActions',"nickname geldi : "+nickname)
        client['nick'] = nickname
        client['id'] = socket.id
        clients.push(client)
        clients.forEach(function(item){
            if(item['id'] != socket.id){
                otherUser = item['nick']
                return false;
            }
        })
        // socket.emit('users',clients['nick']);
        console.log(client)
    })
})

server.listen(port,function(){
    console.log('server calisiyor.')
})