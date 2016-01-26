// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.$messages = null;

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
      username: window.location.search,
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
    data: 'order=-createdAt',
    success: function(data) {
      app.clearMessages();
      _.each(data.results, function(messageObject) {
        app.addMessage(messageObject);
      });
    },
    error: function(err) {
      console.error('bummer, you got an error. here\'s what went wrong:');
      console.error(err);
    }
  });
};

app.clearMessages = function() {
  app.$messages.html('');
};

app.addMessage = function(inputObject) {
  var $node = $('<p></p>');
  $node.text(inputObject.text);
  app.$messages.append($node);
};

app.addRoom = function() {

};
$(document).on('ready', function() {
  app.init();
});
