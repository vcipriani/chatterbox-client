// YOUR CODE HERE:
var app = {};
app.init = function() {

  var self = this;
  $('.submitChat').on('submit', function(event){
    event.preventDefault();
    var message = $('.newMessage').val();
    if(message==='' || message === ' ') {
      return;
    }
    self.send(message);
  });  

  this.fetch();
  $('.newMessage').focus();
};


app.send = function(message, roomName) {
  roomName = roomName || 'lobby';
  var msg = {username: 'test',
            text: message,
            roomname: roomName};

  $.ajax({url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(msg),
        success: function(){
          console.log('Success' + msg);
          $('.newMessage').val('');
          $('.newMessage').focus();
          app.fetch();
          }
        });
};

app.fetch = function () {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt',
    success: function(data) {
      var $messages = $('.messages');
      $messages.html('');
      _.each(data.results, function(messageObject) {
        $messages.append(newMessage(messageObject.text));
      });
    },
    error: function(err) {
      console.error('bummer, you got an error. here\'s what went wrong:');
      console.error(err);
    }
  });
};

$(document).on('ready', function() {
  app.init();
});

// Helper functions
function newMessage(text) {
  var $node = $('<p></p>');
  $node.text(text);
  return $node;
}