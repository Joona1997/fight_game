import express from 'express';
import * as http from 'http';
import path from 'path';
import { ExpressPeerServer } from 'peer';

const app = express();
const server = http.createServer(app);

const port =  "8000";

const peerServer = ExpressPeerServer(server, {
    proxied: true,
    debug: true,
    path: '/myapp',
    ssl: {}
});


app.use(peerServer);

app.use(express.static(path.join(__dirname, "../../frontend/build")));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + "../../frontend/build/index.html"));
});

server.listen(port);
console.log('Listening on: ' + port);