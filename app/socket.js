const socketIo = require('socket.io');
const socket = {}

socket.connection = (app) => {
    const io = socketIo.listen(app);
    io.on("connection", (socket) => {
        console.log("usuario conectado " + socket.handshake.query.uid); 

        // --------socket sede-------------
        socket.on('sedes',(data)=>{            
            io.sockets.emit("sedesres",data);
        })
        // --------socket empresa------------
        socket.on('empresas',(data)=>{            
            io.sockets.emit("empresasres",data);
        })
        // --------socket bitacora------------
        socket.on('bitacoras',(data)=>{
            io.sockets.emit("bitacorasres",data);
        })
        // --------socket pqrs------------
        socket.on('pqrs',(data)=>{            
            io.sockets.emit("pqrsres",data);
        })
        // --------socket publicidad------------
        socket.on('publicacionesmasivas',(data)=>{
            io.sockets.emit("publicacionesmasivasres",data);
        })        
        // --------socket publicidad------------
        socket.on('usuarios',(data)=>{
            io.sockets.emit("usuariosres",data);
        })

        socket.on("disconnect", function() {
            console.log("usuario desconectado " + socket.id);
        });

    });
}

module.exports = socket;
