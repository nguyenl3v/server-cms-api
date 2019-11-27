const users = [];
const getMessage = (messages, msg) => {
  const m = messages.filter(
    item => item.sender === msg.sender || item.receiver === msg.sender
  );
  return m;
};
const addUser = userItem => {
  userItem && users.indexOf(userItem) === -1 ? users.push(userItem) : false;
  return users;
};
const getUser = () => {
  return users;
};
module.exports = { getMessage, addUser, getUser };
