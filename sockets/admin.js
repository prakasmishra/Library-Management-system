import {createServer} from 'http';
import {Server} from 'socket.io';


var admin = null;

export const attachAdminSocket = function (app) {
    const httpServer = createServer(app);
    const io = new Server(httpServer,{
        cors: {
          origin: true,
          methods: ["GET", "POST"]
        }
      });

    admin = io.of('/admin');

    admin.on('connection' , (socket)=>{
        console.log(`someone connected with ${socket.id}`);
    })

    return httpServer;
}

export const sendEtaskToAdmin = (etaskObj) => {
    
    console.log("sending method is called");

    if(!admin){
        throw new Error("No socket connected");
    }
    admin.emit('recieve-etask',JSON.stringify(etaskObj));
}

