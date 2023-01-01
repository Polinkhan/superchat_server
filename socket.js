const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000" || "https://polinkhan.github.io/superchat",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let Users = { group: "Group Chat" };

let groupMassages = [];

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    Users[socket.id] = name;
    const newUser = { [socket.id]: name };
    socket.broadcast.emit("user-joined", newUser, socket.id);
    console.log(Users);
  });

  socket.on("requstUsersData", () => {
    console.log(Users);
    socket.emit("getUsersData", Users, socket.id, groupMassages);
  });

  socket.on("send", (massege) => {
    groupMassages.push({ name: Users[socket.id], id: socket.id, msg: massege });
    socket.broadcast.emit("receive", groupMassages);
  });

  socket.on("privateMsg", (id, massege) => {
    const msg = { name: Users[socket.id], id: socket.id, msg: massege };
    socket.to(id).emit("privateMsgRec", msg, socket.id);
  });

  socket.on("clearMsg", () => {
    groupMassages = [];
    socket.broadcast.emit("receive", groupMassages);
    socket.emit("receive", groupMassages);
  });

  socket.on("disconnect", () => {
    delete Users[socket.id];
    console.log(Users);
    socket.broadcast.emit("updateUser", socket.id);
  });
});

httpServer.listen(5000);
