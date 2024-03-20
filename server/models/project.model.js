const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {type: String, required: true},
    tasks: [{
        username: { type: String, required: true},
        name: {type: String, required: true},
        description: { type: String, required: true},
        priority: { type: Number, required: true},
        end: { type: Date, required: true},
    }]
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;