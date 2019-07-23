const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const ClientInitWSMessageTypes = {
    CONNECTION_INIT : 'CONNECTION_INIT',
    DATA_SUBSCRIBE_REQUEST : 'DATA_SUBSCRIBE_REQUEST',
    DATA_UNSUBSCRIBE_REQUEST : 'DATA_UNSUBSCRIBE_REQUEST'
}

var conCount = 0;
var msgCount = 0;

wss.on('connection', function connection(ws) {
	conCount++;
	console.log('new connection. Count : ' + conCount);

  ws.on('message', function incoming(message) {
    msgCount ++;
	
	const commandIndex = message.indexOf(':');
	const command = message.slice(0, commandIndex);
	
	const input = JSON.parse(message.slice(commandIndex + 1));
	
	console.log('received: %s, count: %s',command,  msgCount);
	if(command === ClientInitWSMessageTypes.CONNECTION_INIT) {
		ws.send('INITIALIZED:');
	} else if (command === ClientInitWSMessageTypes.DATA_SUBSCRIBE_REQUEST) {
		ws.send('DATA:' + input.uniqueID + ':' + 'This is a test data message');
	} else if (command === ClientInitWSMessageTypes.DATA_UNSUBSCRIBE_REQUEST) {
		ws.send('DATA_UNSUBSCRIBED:' + input.uniqueID + ':');
	}	
  });
 
 ws.on('close', function close(event) {
		conCount--;
		console.log('closed connection. Count : ' + conCount);
	})
});

server.listen(8080);
console.log('WSServer Listening on 8080');