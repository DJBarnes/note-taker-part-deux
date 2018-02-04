var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var NoteSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});
mongoose.model('Note', NoteSchema);