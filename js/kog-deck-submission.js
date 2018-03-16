$(document).ready(function() {
    // Initialize the example KoG pics 
    $().fancybox({
        buttons: ['close'],
        selector: '.fancybox',
        smallBtn: false
    });

    setKogFormValidation();    
});

function setKogFormValidation() {
    $('#proof').change(function() {
        $('#kog-deck-submission-form').submit();    
    });

    $('#kog-deck-submission-form').submit(function() {
        if($('#proof')[0].files.length <= 1) {
            $('#proof')[0].setCustomValidity("Additional files are required");
        }
        else {
            $('#proof')[0].setCustomValidity("");
        }

        $(this).addClass('was-validated');

        if($(this)[0].checkValidity() != true) {
            return false;
        }
    });
}