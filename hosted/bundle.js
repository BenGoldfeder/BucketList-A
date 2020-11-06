"use strict";
"use strict";

var handleError = function handleError(message) {
  $("#errormessage").text(message);
  $("#domomessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domomessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjac = function sendAjac(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
