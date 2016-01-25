// YOUR CODE HERE:
var app = {};
app.init = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function(data) {
      var $messages = $('.messages');
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

function newMessage(text) {
  var $node = $('<p></p>');
  $node.text(text);
  return $node;
}