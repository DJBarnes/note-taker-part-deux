// Note model

// Include mongoose and use it to get access at the Schema class
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Create a new Schema for a Note Model
// It includes 2 fields: subject, and body.
// Both are required with a minlength of 1.
var NoteSchema = new Schema({
    subject: {
        type: String,
        required: true,
        minlength: 1
    },
    body: {
        type: String,
        required: true,
        minlength: 1
    }
});

// Use the defined Schema to create an actual Note Model
mongoose.model('Note', NoteSchema);