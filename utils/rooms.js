const rooms = [];

const hasUser = username => {
  return rooms.some(room => room.users.some(user => user.username === username))
};

const joinRoom = (id, username) => {
  let joinableRoom; 

  if (rooms.length !== 0) {
    joinableRoom = rooms.findIndex((room, index) => {
      return room.users.length < 6 && !room.started
    });
  }

  if (joinableRoom !== -1 && typeof joinableRoom !== 'undefined') {
    rooms[joinableRoom].users.push({ ids: [id], username });
  } else {
    const newRoom = createRoom();
    rooms[newRoom].users.push({ ids: [id], username });
  }
};

const createRoom = () => {
  const name = Date.now() + '' + Math.random();
  rooms.push({ name, time: null, timer: null, started: false, users: [] });
  return rooms.findIndex(room => room.name === name);
};

const addId = (id, username) => {
  const roomIdx = getRoomIdx(null, username)
  const userIdx = rooms[roomIdx].users.findIndex(user => user.username === username)
  rooms[roomIdx].users[userIdx].ids.push(id)
};

const getUsersInRoom = room => {
  const roomIdx = rooms.findIndex(roomNo => roomNo.name === room);
  if (roomIdx !== -1) return rooms[roomIdx].users.map(user => user.username);
};

const getRoomIdx = (socketid, name) => {
  let roomId; 
  for (let i = 0; i < rooms.length; i++) {
    let search = rooms[i].users.find(user => user.ids.includes(socketid) || user.username === name);
    if (typeof search !== 'undefined') {
      roomId = i; 
      break;
    }  
  }
  return roomId;
};

const getRoom = (socketid, name) => {
  const roomId = getRoomIdx(socketid, name);
  if (typeof roomId !== 'undefined') {
    return rooms[roomId].name;
  }
};

const removeUser = socketid => {
  let removed;
  const roomIdx = getRoomIdx(socketid); 
  if (typeof roomIdx !== 'undefined') {
    const userIdx = rooms[roomIdx].users.findIndex(user => user.ids.includes(socketid));
    const idIdx = rooms[roomIdx].users[userIdx].ids.findIndex(id => id === socketid);
    rooms[roomIdx].users[userIdx].ids.splice(idIdx, 1)

    
    if (rooms[roomIdx].users[userIdx].ids.length === 0) {
      rooms[roomIdx].users.splice(userIdx, 1);
      removed = true

      if (rooms[roomIdx].users.length === 0) {
        removeRoom(rooms[roomIdx].name);
        console.log('Room deleted');
      }
    } 
    return removed;
  }
};

const removeRoom = room => {
  const roomId = rooms.findIndex(roomNo => roomNo.name === room);
  rooms.splice(roomId, 1);
};

const startRoom = socketid => { 
  const roomId = getRoomIdx(socketid); 
  rooms[roomId].started = true;
};

const roomStarted = room => { 
  const roomId = rooms.findIndex(roomNo => roomNo.name === room); 
  if (typeof roomId !== 'undefined' && roomId !== -1) return rooms[roomId].started;
};

module.exports = {
  joinRoom,
  getUsersInRoom,
  getRoom,
  removeUser,
  startRoom,
  roomStarted,
  addId,
  hasUser
};
