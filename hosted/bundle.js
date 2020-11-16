"use strict";

var handleTask = function handleTask(e) {
  e.preventDefault();
  $("#myMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#TaskName").val() == '' || $("#taskPriority").val() == '') {
    handleError("Please fill out all fields!");
    return false;
  }

  sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
    loadTasksFromServer();
  });
  return false;
};

var TaskForm = function TaskForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "taskForm",
    name: "taskForm",
    onSubmit: handleTask,
    action: "/maker",
    method: "POST",
    className: "taskForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "taskName",
    type: "text",
    name: "name",
    placeholder: "Task Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "priority"
  }, "Priority: "), /*#__PURE__*/React.createElement("input", {
    id: "taskPriority",
    type: "password",
    name: "priority",
    placeholder: "Task Priority"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeTaskSubmit",
    type: "submit",
    value: "Make Task"
  }));
};

var TaskList = function TaskList(props) {
  if (props.tasks.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "taskList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyTask"
    }, "No tasks added yet! Why not add one?"));
  }


//Change face IMG
  var taskNodes = props.tasks.map(function (task) {
    return /*#__PURE__*/React.createElement("div", {
      key: task._id,
      className: "task"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/note.png",
      alt: "task icon",
      className: "taskIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "taskName"
    }, " Name: ", task.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "taskPriority"
    }, " Priority: ", task.priority, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "taskList"
  }, taskNodes);
};


var loadTasksFromServer = function loadTasksFromServer() {
  sendAjax('GET', '/getTasks', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
      tasks: data.tasks
    }), document.querySelector("#tasks"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskForm, {
    csrf: csrf
  }), document.querySelector("#makeTask"));
  ReactDOM.render( /*#__PURE__*/React.createElement(TaskList, {
    tasks: []
  }), document.querySelector("#tasks"));
  loadTasksFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#myMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#myMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
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
