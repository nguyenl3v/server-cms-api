const User = require("../model/user");
const { addUser, getUser } = require("./appChat");

module.exports = io => {
  const review = [];
  let messages = [];
  io.on("connection", function(socket) {
    socket.on("post/review", function(d) {
      const date = Date.now();
      const data = { ...d, date };
      review.push(data);
      io.sockets.emit("get/review", review);
    });
    io.sockets.emit("get/review", review);
    User.find({ admin: true })
      .select("name")
      .exec(function(err, users) {
        const user = Object.assign({}, ...users);
        io.emit("get/userAdmin", user._doc);
      });
    socket.on("rooms", function(data) {
      if (data !== null) {
        socket.join(data.admin);
        socket.join(data.name);
        socket.sender = data.name;
        socket.receiver = data.admin;
        addUser(data.name);
        socket.emit("get/msg", messages);
        io.to(socket.receiver).emit("get/msg", messages);
        io.to(socket.receiver).emit("get/user/admin", getUser());
      }
    });
    socket.on("msg", function(msg) {
      const sendMessage = {
        sender: msg.sender,
        receiver: msg.receiver,
        msg: msg.msg
      };
      messages.push(sendMessage);
      socket.emit("get/msg", messages);
      io.to(msg.receiver).emit("get/msg", messages);
    });
  });
};
