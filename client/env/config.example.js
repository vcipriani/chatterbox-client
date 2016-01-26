// YOU DO NOT NEED TO EDIT this code.
//
// All this is doing is inserting the parse API keys into every $.ajax
// request that you make so you don't have to.
var getUserName = function() {
  var newSearch = '?username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
};

if (!/(&|\?)username=/.test(window.location.search)) {
  getUserName();
}

// Put your parse application keys here!
$.ajaxPrefilter(function (settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "PARSE_APP_ID");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "PARSE_API_KEY");
});
