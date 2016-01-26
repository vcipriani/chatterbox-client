// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.$messages = null;
app.$roomDropdown = null;
app.rooms = [];
app.currentRoom = null;
app.init = function() {

  var self = this;

  //Send message listener
  $('.submitChat').on('submit', function(event){
    event.preventDefault();
    var message = $('.newMessage').val();
    if(message==='' || message === ' ') {
      return;
    }
    self.send({
      username: GetURLParameter('username'),
      text: message,
      roomname: (app.currentRoom || 'lobby')
    });
  });  
  
  app.$messages = $('#chats');
  app.$roomDropdown = $('.roomSelector');

  //Dropdown event handler
  app.$roomDropdown.on('change', function(){
    app.currentRoom = app.$roomDropdown.val();
    if (app.currentRoom === '4ad3bf17') {
      app.currentRoom = null;
    }
    app.fetch(app.currentRoom);
  });
  this.fetch(app.currentRoom);
  setInterval(function(){
    app.fetch(app.currentRoom);
  }, 10000);
  $('.newMessage').focus();
};


app.send = function(messageObj) {

  $.ajax({url: app.server,
        type: 'POST',
        data: JSON.stringify(messageObj),
        success: function(){
          // console.log('Success' + msg);
          $('.newMessage').val('');
          $('.newMessage').focus();
          app.fetch(app.currentRoom);
          }
        });
};

app.fetch = function (roomName) {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    success: function(data) {
      app.clearMessages();
      _.each(data.results, function(messageObject) {
        if (app.rooms.indexOf(messageObject.roomname) === -1) {
          app.rooms.push(messageObject.roomname);
        }

        if (roomName) {
          if (roomName === messageObject.roomname) {
            app.addMessage(messageObject);
          }
        } else {
          app.addMessage(messageObject);
        }

        // if (roomName && roomName === messageObject.roomname) {
        //   app.addMessage(messageObject);
        // } else if (!roomName) {

        // }
      });


      app.populateRoomDropdown();
    },
    error: function(err) {
      console.error('bummer, you got an error. here\'s what went wrong:');
      console.error(err);
    }
  });

};

app.populateRoomDropdown = function() {
  app.$roomDropdown.html('');
  app.$roomDropdown.append('<option value="4ad3bf17">Choose a room..</option>');
  app.$roomDropdown.append('<option value="Create New Room..">Create New Room..</option>');
  app.rooms.forEach(function(item){
    $node = $('<option></option>');
    $node.text(item);
    $node.val(item);
    if(item === app.currentRoom && app.currentRoom) {
      $node.attr('selected','selected');
    }
    app.$roomDropdown.append($node);
  });
};

app.clearMessages = function() {
  app.$messages.html('');
};

app.addMessage = function(inputObject) {

  var $chat = $('<div class="chat"></div>');

  $chat.append($('<p class="username"></p>').text(inputObject.username + ' in ' + inputObject.roomname));

  $chat.append($('<p class="chat"></p>').text(inputObject.text));

  app.$messages.append($chat);
};

app.addRoom = function() {

};
$(document).on('ready', function() {
  app.init();
});

//Helper functions
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
        return sParameterName[1];
    }
  }
}