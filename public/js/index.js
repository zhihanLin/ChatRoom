/*** Main Features ***/

/* connecting socket.io */
const socket = io()

/** Sign Up **/
$('#register_avatar li').on('click', function() {
  $(this).addClass('selected').siblings().removeClass('selected')
})

$('#sex li').on('click', function() {
  $(this).addClass('selected').siblings().removeClass('selected')
})

$('#register').on('click', function() {
  /* collecting user info */
  // get username
  var username = $('#register_username').val().trim()
  if (!username) {
    console.log('Invalid Username')
    return
  }
  // get password
  var password = $('#register_password').val().trim()
  if (!password) {
    console.log('Invalid Passwod')
    return
  }
  // get gender
  var gender = $('#sex li.selected input').attr('value')
  if (!gender) {
    console.log('Select Your Gender')
    return
  }
  // get avatar
  var avatar = $('#register_avatar li.selected img').attr('src')

  /* send user info to socketio*/
  socket.emit('signup', {
    username: username,
    password: password,
    gender: gender,
    avatar: avatar
  })
})
/* listen to signup request*/
socket.on('signupError', data => {
  console.log(data.msg)
})
socket.on('signupSuccessed', data => {
  //  show chatroom and hide login window
  $('.register_box').fadeOut()
  $('.container').fadeIn()
  // setup login user's info
  $('.avatar_url').attr('src', data.avatar)
  $('.user-list .username').text(data.username)
})

/** Log In **/
$('#loginBtn').on('click', function() {
  /* collecting user credential */
  // get username
  var username = $('#username').val()
  var password = $('#password').val()
  /* send user credential to socketio */
  socket.emit('login', {
    username: username,
    password: password
  })
})
/* listen to login request */
socket.on('loginError', data => {
  consolo.log(data)
}) 
socket.on('loginSuccessed', data => {
  //  show chatroom and hide login window
  $('.login_box').fadeOut()
  $('.container').fadeIn()
  // setup login user's info
  $('.avatar_url').attr('src', data.avatar)
  $('.user-list .username').text(data.username)
})


 /* new user registeration */
$('#registerBtn').on('click', function() {
  $('.login_box').fadeOut()
  $('.register_box').fadeIn()
})

socket.on('addUser', data => {
  $('.box-bd').append(`
    <div class="system">
      <p class="message_system">
        <span class="content">${data} Just Landed</span>
      </p>
    </div>
  `)
})

socket.on('delUser', data => {
  $('.box-bd').append(`
    <div class="system">
      <p class="message_system">
        <span class="content">${data} Has Left</span>
      </p>
    </div>
  `)
})

socket.on('userList', data => {
  //  updating online users to sidebar
  console.log(data)
  $('.user-list ul').html('')
  data.forEach(item => {
    $('.user-list ul').append(`
    <li class="user">
      <div class="avatar"><img src="${item.avatar}" alt="" /></div>
      <div class="name">${item.username}</div>
    </li> 
    `) 
  })

  $('#userCount').text(data.length)
})
