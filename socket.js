const { Server } = require("socket.io");

// let users = [];
let users = { group: "Group Chat" };

let groupMassages = [];

let port = process.env.PORT || 8000;

const io = new Server(port, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    // Massages[socket.id] = [];
    // users.push({ id: socket.id, name: name });
    socket.broadcast.emit("user-joined", users, groupMassages, socket.id);
  });

  // socket.on("ActiveUserNumer", () => {
  //   socket.emit("receiveActiveUserNumer", Object.keys(user).length);
  // });

  socket.on("requstUserData", () => {
    socket.emit("getUser", users, socket.id, groupMassages);
  });

  socket.on("send", (massege) => {
    groupMassages.push({ name: users[socket.id], id: socket.id, msg: massege });
    socket.broadcast.emit("receive", groupMassages);
  });

  socket.on("privateMsg", (id, massege) => {
    socket.to(id).emit("privateMsgRec", users[socket.id], socket.id, massege);
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
    delete users[socket.id];
    socket.broadcast.emit("updateUser", users, groupMassages);
  });
});
