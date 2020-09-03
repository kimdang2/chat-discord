const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const userExists = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(userExists) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const deleteUserAtIdx = users.findIndex((user) => user.id === id);

  if(deleteUserAtIdx !== -1) return users.splice(deleteUserAtIdx, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };