const { Server } = require("socket.io");
let port = process.env.PORT || 8000;
const io = new Server(port, { cors: { origin: "*" } });

// let users = [];
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

  // socket.on("sendImg", (imgSrc) => {
  //   socket.broadcast.emit("receiveImg", imgSrc, user[socket.id]);
  // });

  // socket.on("typing", (name) => {
  //   socket.broadcast.emit("userIsTyping", name, socket.id, user);
  // });

  // socket.on("stopTyping", (name) => {
  //   socket.broadcast.emit("userStopedTyping", socket.id, user);
  // });

  socket.on("disconnect", () => {
    // socket.broadcast.emit("userLeave", user[socket.id], socket.id, user);
    // socket.broadcast.emit("userStopedTyping", socket.id, user);
    // const updateUsers = users.filter((user) => {
    //   return user.id !== socket.id;
    // });
    // users = updateUsers;
    delete Users[socket.id];
    console.log(Users);
    socket.broadcast.emit("updateUser", socket.id);
  });
});
