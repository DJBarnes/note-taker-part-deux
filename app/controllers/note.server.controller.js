var Note = require('mongoose').model('Note');

exports.index = function (req, res) {

    var viewData = getViewDataObject(req);

    Note.find({}, function(err, notes) {
        if (err) {
            for (propertyName in err.errors) {
                req.session.errors.push(err.errors[propertyName].message);
            }
            viewData.notes = [];
        } else {
            viewData.notes = notes;
        }
        res.render('note/index', viewData);
    });
};

exports.create = function (req, res) {

    var viewData = getViewDataObject(req);

    if (!viewData.note) {
        viewData.note = new Note();
    }

    console.log(viewData);

    res.render('note/create', viewData);
}


exports.store = function (req, res) {

    var note = new Note(req.body);

    note.save(function (err) {
        if (err) {
            for (propertyName in err.errors) {
                req.session.errors.push(err.errors[propertyName].message);
                req.session[propertyName + 'Class'] = 'is-invalid';
            }
            req.session.note = note;
            res.redirect('create');
        } else {
            req.session.messages.push("Note Created Successfully");
            res.redirect('/');
        }
    });
};

exports.edit = function (req, res) {

    var viewData = getViewDataObject(req);

    var searchTerm = {
        _id: req.params.id
    }

    Note.findOne(searchTerm, function(err, note) {
        if (err) {
            for (propertyName in err.errors) {
                req.session.errors.push(err.errors[propertyName].message);
            }
            res.redirect('/');
        } else {
            viewData.note = note;
            console.log(viewData);
            res.render('note/edit', viewData);
        }
    });
}

exports.update = function (req, res) {

    Note.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            runValidators: true
        },
        function(err) {
            console.log(err);
        if (err) {
            for (propertyName in err.errors) {
                req.session.errors.push(err.errors[propertyName].message);
                req.session[propertyName + 'Class'] = 'is-invalid';
            }
            req.session.note = new Note(req.body);
            res.redirect('/edit/' + req.params.id);
        } else {

            req.session.messages.push("Note Updated Successfully!");

            res.redirect('/');

        }

    });
}

exports.destroy = function (req, res) {
    
    Note.deleteOne({_id:req.params.id}, function(err) {
        if (err) {
            for (propertyName in err.errors) {
                req.session.errors.push(err.errors[propertyName].message);
            }
            res.redirect('/edit/' + req.params.id);
        } else {

            req.session.messages.push("Note Deleted Successfully!");

            res.redirect('/');

        }

    });
}

// Returns the default viewData object that will be used when
// rendering out the view.
var getViewDataObject = function (req) {

    var messages = req.session.messages;
    var errors = req.session.errors;
    var subjectClass = req.session.subjectClass;
    var bodyClass = req.session.bodyClass;
    var note = req.session.note;

    messages = (messages) ? messages : [];
    errors = (errors) ? errors : [];
    subjectClass = (subjectClass) ? subjectClass : "";
    bodyClass = (bodyClass) ? bodyClass : "";
    note = (note) ? note : new Note();

    viewData = {
        messages: messages,
        errors: errors,
        subjectClass: subjectClass,
        bodyClass: bodyClass,
        note: note,
    };

    req.session.messages = [];
    req.session.errors = [];
    req.session.subjectClass = "";
    req.session.bodyClass = "";
    req.session.note = null;

    return viewData;
};
