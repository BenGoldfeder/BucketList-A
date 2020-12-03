const handleTask = (e) => {
    e.preventDefault();
    
    $("#myMessage").animate({width:'hide'},350);
    
    if ( $("#taskName").val() == '' || $("#taskPriority").val() == '' ) {
        handleError("Please fill out all fields!");
        return false;
    }
    
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function() {
        loadTasksFromServer();
    });
    return false;
};

const TaskForm = (props) => {
    return (
        <form id="taskForm" 
            name="taskForm"
            onSubmit={handleTask}
            action="/maker"
            method="POST"
            className="taskForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="taskName" type="text" name="name" placeholder="Task Name"/>
            
        <label htmlFor="priority">Priority: </label>
        <input id="taskPriority" type="password" name="priority" placeholder="Task Priority"/>
        
        <label htmlFor="icon">Type: </label>
        <select id="taskIcon" name="icon">
            <option value="/assets/img/note.png">None</option>
            <option value="/assets/img/game.png">Game</option>
            <option value="/assets/img/book.png">Book</option>
            <option value="/assets/img/movie.png">Movie</option>
            <option value="/assets/img/music.png">Music</option>
            <option value="/assets/img/series.png">Series</option>
        </select>
            
        <input type="hidden" name="_id" value={props._id}/>
            
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeTaskSubmit" type="submit" value="Make Task"/>
        </form>
    );
};



const TaskList = function(props) {
    
    if(props.tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No tasks added yet! Why not add one?</h3>
            </div>
        );
    }
    
    const taskNodes = props.tasks.map(function(task) {
        return (
            <div key={task._id} className="task">
                <img src={task.icon} alt="task icon" className="displayIcon" />
                <img src="/assets/img/closed.png" alt="delete task" className="deleteIcon" onClick={deleteTask(task._id)}/>
                <h3 className="taskName"> Name: {task.name} </h3>
                <h3 className="taskPriority"> Priority: {task.priority} </h3>
                
            </div>
        );
    });
    
    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
    
};


const loadTasksFromServer = () => {
    sendAjax('GET', '/getTasks', null, (data) => {
        ReactDOM.render(
            <TaskList tasks={data.tasks}/>, document.querySelector("#tasks")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <TaskForm csrf={csrf}/>, document.querySelector("#makeTask")
    );
    ReactDOM.render(
        <TaskList tasks={[]}/>, document.querySelector("#tasks")
    );
    loadTasksFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};


const deleteTask = function(selectedID){
    sendAjax('POST', '/deleteTask', selectedID);
};


$(document).ready(function() {
    getToken();
});