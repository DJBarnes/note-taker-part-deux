$(document).ready(function() {
    $('tr.clickRow').click(function(e) {
        window.location.href = this.dataset.link;        
    });

    $('#note-destroy-button').click(function(e) {
        $('#note-destroy-form').submit();
    });
});