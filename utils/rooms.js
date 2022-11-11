const rooms = [];

const joinRoom = (id, username) => {
  let joinableRoom; 

  if (rooms.length !== 0) {
    const roomsContainingUser = [];
    rooms.forEach((room, index) => {
      let hasUser = room.users.find(user => user.username === username);
      if (hasUser) roomsContainingUser.push(index);
    });
    joinableRoom = rooms.findIndex((room, index) => {
      return room.users.length < 6 && !room.started && !roomsContainingUser.includes(index)
    });
  }

  if (joinableRoom !== -1 && typeof joinableRoom !== 'undefined') {
    rooms[joinableRoom].users.push({ id, username });
  } else {
    const newRoom = createRoom();
    rooms[newRoom].users.push({ id, username });
  }
};

const createRoom = () => {
  const name = Date.now() + '' + Math.random();
  rooms.push({ name, time: null, timer: null, started: false, users: [] });
  return rooms.findIndex(room => room.name === name);
};

const getUsersInRoom = room => {
  const roomId = rooms.findIndex(roomNo => roomNo.name === room);
  if (roomId !== -1) return rooms[roomId].users.map(user => user.username);
}

const getRoomId = socketid => {
  let roomId; 
  for (let i = 0; i < rooms.length; i++) {
    let search = rooms[i].users.find(user => user.id === socketid);
    if (typeof search !== 'undefined') {
      roomId = i; 
      break;
    }  
  }
  return roomId;
}

const getRoom = socketid => {
  const roomId = getRoomId(socketid);
  if (typeof roomId !== 'undefined') {
    return rooms[roomId].name;
  }
};

const removeUser = socketid => {
  const roomId = getRoomId(socketid); 
  if (typeof roomId !== 'undefined') {
    const userIndex = rooms[roomId].users.findIndex(user => user.id === socketid);
    rooms[roomId].users.splice(userIndex, 1);
    if (rooms[roomId].users.length === 0) {
      removeRoom(rooms[roomId].name);
      console.log('Room deleted');
    }
    return userIndex;
  }
}

const removeRoom = room => {
  const roomId = rooms.findIndex(roomNo => roomNo.name === room);
  rooms.splice(roomId, 1);
}

const startRoom = socketid => { 
  const roomId = getRoomId(socketid); 
  rooms[roomId].started = true;
}

const roomStarted = room => { 
  const roomId = rooms.findIndex(roomNo => roomNo.name === room); 
  if (typeof roomId !== 'undefined' && roomId !== -1) return rooms[roomId].started;
}

module.exports = {
  joinRoom,
  getUsersInRoom,
  getRoom,
  removeUser,
  startRoom,
  roomStarted,
};
