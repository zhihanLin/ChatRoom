const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(3000, () => {
  console.log('listening on *:3000');
});

const users = new Map()
const onlineUsers = []

users.set("zh", {password: "1223",
                gender: "male",
                avatar: "images/avatar02.jpg"})

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

// set public as static resource folder
app.use(require('express').static('public'))

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('greeting', data => {
      console.log(data)
      socket.emit('send', data)
  })

  socket.on('signup', data => {
    let user = users.has(data.username)
    if (user) {
      socket.emit('signupError', {msg: 'Username already exists'})
      console.log('sign up failed')
    } else {
      socket.username = data.username
      socket.avatar = data.avatar
      onlineUsers.push({
        username: data.username,
        avatar: data.avatar
      })
      users.set(data.username, 
        {password: data.password, 
          gender: data.gender, 
          avatar: data.avatar})
      socket.emit('signupSuccessed', {
        username: data.username,
        avatar: data.avatar
      })
      //  boardcast to all users
      //  user's username
      io.emit('addUser', data.username)
      //  list of all online users
      // io.emit('userList', Array.from(users, ([username, info]) =>
      // ({username, info}) ))
      io.emit('userList', onlineUsers)
    }
  })
  
  socket.on('login', data => {
    let user = users.has(data.username)
    if (!user) {
      socket.emit('loginError', {msg: 'invalid username or password'})
    } else {
      let pw = users.get(data.username).password
      if (pw != data.password) {
        socket.emit('loginError', {msg: 'invalid username or password'})
      } else {
        socket.username = data.username
        socket.avatar = users.get(data.username).avatar
        onlineUsers.push({
          username: data.username,
          avatar: users.get(data.username).avatar
        })
        socket.emit('loginSuccessed', {
          username: data.username,
          avatar: users.get(data.username).avatar
        })
        //  boardcast to all users
        //  user's username
        io.emit('addUser', data.username)
        //  list of all online users
        // io.emit('userList', Array.from(users, ([username, info]) =>
        // ({username, info}) ))
        io.emit('userList', onlineUsers)
      }
    }
  })

  socket.on('disconnect', () => {
    let index = onlineUsers.findIndex(item => item.username === socket.username)
    onlineUsers.splice(index, 1)

    io.emit('delUser', socket.username)

    io.emit('userList', onlineUsers)
  })
  
});
