const handleError = (message) => {
    $("#errormessage").text(message);
    $("#domomessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
    $("#domomessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjac = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};