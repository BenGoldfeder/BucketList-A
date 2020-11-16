module.exports.Account = require('./Account.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    
    priority: {
        type: Number,
        min: 0,
        required: true,
    },
    
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    
    createdData: {
        type: Date,
        default: Date.now,
    },

});


TaskSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    priority: doc.priority,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
    const search ={
        owner: convertId(ownerId),
    };
    return TaskModel.find(search).select('name priority').lean().exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;