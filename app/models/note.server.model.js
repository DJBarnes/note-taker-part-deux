var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
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
mongoose.model('Note', NoteSchema);