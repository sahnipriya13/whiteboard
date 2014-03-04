var http = require('http');
	fs = require('fs');
	var path = require('path');
	var usernames={};
var app1 = http.createServer(function (request, response) {
	console.log('request starting...');	
	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './main_whiteboard.html';	
	path.exists(filePath, function(exists) {	
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': 'text/html' });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});	
}).listen(1339);
var user_info = new Array();
var position;
var t, max =6, min=2;
console.log("Server running");
var totPlayers ;
var no_of_users;

var io= require('socket.io').listen(app1);

io.sockets.on('connection', function(socket)
{
console.log("CCOONNEECTTEDD");
		socket.on('mousemove1',function(data)
		{
		console.log("entered");
			io.sockets.in(socket.room).emit('moving1',data);
		});
socket.on('adduser',function(username){
console.log("LOGIN");
if(username)
{
console.log(username);
username0=socket.username;
console.log(username0);
socket.room='room1';
socket.emit('update_chat','SERVER','you have connected to room1');
socket.broadcast.to('room1').emit('update_chat','SERVER',socket.username+' has connected to this room');
console.log("XXXXXXXXXXXXX");
console.log(usernames[username]);
socket.emit('Online3',username);
delete usernames[username0];
socket.username=username;
socket.room='room1';
usernames[username]=username;
console.log(usernames[username]);
socket.emit('updateusers',usernames,username);
io.sockets.in('room1').emit('updateusers',usernames,username);}
else 
{
username = 'guest'+'_'+Math.round(Math.random()*10);
console.log(username);
socket.username=username;
socket.room='room1';
usernames[username]=username;
socket.join('room1');
socket.emit('update_chat','SERVER','you have connected to room1');
socket.broadcast.to('room1').emit('update_chat','SERVER',socket.username+' has connected to this room');
console.log("XXXXXXXXXXXXX");
console.log(usernames[username]);
socket.emit('Online3',username);
socket.emit('updateusers',usernames,username);
io.sockets.in('room1').emit('updateusers',usernames,username);
}

});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames,socket.username);
		if(socket.username)
		{
		socket.broadcast.emit('update_chat', 'SERVER', socket.username + ' has disconnected');
		}
		socket.leave(socket.room);
		
		var socketid= socket.id;
		for (var key in user_info) {
			var no_players_room = user_info[key]['no_of_users'];
			for(var i=0; i<no_players_room; i++)
			{
				if(user_info[key][i]['socket']==socketid)
				{
					for(var j=i; j<no_players_room-1;j++)
					{
						var new_k = j+1;
						user_info[key][j]['userName']	= user_info[key][new_k]['userName'];
						user_info[key][j]['socket']	= user_info[key][new_k]['socket'];
					}
					user_info[key]['no_of_users'] = user_info[key]['no_of_users']-1;
				}
			}
			var x=user_info[key]['no_of_users'] ;
			for(var j=0; j<x; j++)
			{
			info[j]=user_info[key][j]['userName'];
			}
			io.sockets.in(key).emit("Online2",info);
			}
	});
socket.on('getUrl',function()
{
console.log("GGGGGGGGGGGGGG");
var room = '';
possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for( var i=0; i < 16; i++ )
		{
			room += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		var url_val = 'http://192.168.1.9:1339/'+'#'+room;
		console.log(url_val);
			io.sockets.emit('sendRoom1', {url_val: url_val});
			user_info[room]=new Array();
			user_info[room][0]=room;
			user_info[room]['no_of_users']=0;
			});
			var info=new Array();
		socket.on('incominguser',function(data)
		{
		var roomName = data['roomv'];	
 if(!data['usernamev'])
					{
					if(user_info[roomName]['no_of_users'] < max)
					{					
                       console.log(user_info[roomName]);					
						var count = user_info[roomName]['no_of_users'];
						user_info[roomName][count] = new Array();
						user_info[roomName][count]['userName'] ='guest'+'_'+Math.round(Math.random()*10) ;
						user_info[roomName][count]['socket'] = socket.id;
						socket.join(roomName);
						console.log(user_info[roomName][count]['userName']);
						socket.emit("Online1",{users:user_info[roomName][count]['userName']});
						io.sockets.socket(user_info[roomName][count]['socket']).emit("PlayEvent",{no_of_users:user_info[roomName]['no_of_users']});
						console.log(user_info[roomName][count]['userName']);
						user_info[roomName]['no_of_users'] = user_info[roomName]['no_of_users']+1;
						totPlayers = user_info[roomName]['no_of_users']; 
						var i;
						for(i=0;i<totPlayers;i++)
						{
						console.log(user_info[roomName][i]['userName']);
						socket.emit("Online",{users:user_info[roomName][i]['userName'],total_Players:totPlayers});
						}
						for(i=count;i<totPlayers;i++)
						{
						socket.broadcast.to(roomName).emit("Online",{users:user_info[roomName][i]['userName'],total_Players:totPlayers});
						}
						console.log(totPlayers);
						
					}
					}
					else 
					{		
					if(user_info[roomName]['no_of_users'] < max)
					{	
var count = user_info[roomName]['no_of_users'];	
console.log(socket.id);
console.log(user_info);
var i;
for(i=0;i<count;i++)
{
if(user_info[roomName][i]['socket']==socket.id)	
{			
console.log(user_info[roomName][i]['userName']);
delete user_info[roomName][i]['userName'] ;
user_info[roomName][i]['userName']=data['usernamev'];
io.sockets.socket(user_info[roomName][i]['socket']).emit("PlayEvent",{no_of_users:user_info[roomName]['no_of_users']});
						socket.emit("Online1",{users:user_info[roomName][i]['userName']});
						totPlayers = user_info[roomName]['no_of_users']; 
						console.log(user_info[roomName][i]['userName']);
						console.log(user_info);	
					}
					info[i]=user_info[roomName][i]['userName'];
					
					
}
io.sockets.in(roomName).emit("Online2",info);

}
}
				
					});
		socket.on('mousemove',function(data)
		{
		var roomName = data['r1'];
		console.log(roomName);
		io.sockets.in(roomName).emit("moving",data);
		});
		
});







