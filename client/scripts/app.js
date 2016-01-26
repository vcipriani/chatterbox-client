// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.$messages = null;
app.rooms = [];
app.currentRoom = 'all';
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
      roomname: 'lobby'
    });
  });  

  app.$messages = $('#chats');
  
  this.fetch();
  setInterval(this.fetch, 10000);
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
          app.fetch();
          }
        });
};

app.fetch = function () {
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
        app.addMessage(messageObject);
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
  $('.roomSelector').html('');
  $('.roomSelector').append('<option value="all">Choose a room..</option>');
  app.rooms.forEach(function(item){
    $node = $('<option></option>');
    $node.text(item);
    $node.val(item);
    $('.roomSelector').append($node);
  });
};

app.clearMessages = function() {
  app.$messages.html('');
};

app.addMessage = function(inputObject) {

  var $chat = $('<div class="chat"></div>');

  $chat.append($('<p class="username"></p>').text(inputObject.username));

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