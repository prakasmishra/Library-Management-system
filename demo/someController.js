import expressAsyncHandler from "express-async-handler";
import { sendEtaskToAdmin } from "../sockets/admin.js"

export const someController = expressAsyncHandler(async(req,res)=>{


    var etask = {
        name: 'etask',
        version: '0.0.1',
        description: 'user issued book',
        ttl : '5min',
        read : false
    }
    
    // performs some db operation;
    // etask creation

    sendEtaskToAdmin(etask);

    res.send({message : 'Registration pending...'});

})