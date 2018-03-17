var proofPicsCount = 0;
var deckPicsCount = 0;
var uploadCount = 0;

$(document).ready(function() {
    $().fancybox({
        buttons: ['close'],
        selector: '.fancybox',
        smallBtn: false
    });

    setKogFormValidation();   
    initializeWidgetHandlers(); 
});

function setKogFormValidation() {
    $('#kog-deck-submission-form').submit(function() {
        var currentDate = new Date();
        $('#subject').val("Deck submission from: " + $('#author').val() + " - " + currentDate);

        $(this).addClass('was-validated');

        if($(this)[0].checkValidity() != true || validateProof() == false || validateDeck() == false ) {
            return false;
        }
    });
}

function initializeWidgetHandlers() {
    var proofWidget = uploadcare.MultipleWidget('#proof');
    proofWidget.onChange(function(info) {   
        if(info == null) {
            proofPicsCount = 0;
        }    
        else {
            proofPicsCount = info.files().length;
        }         
    });

    var deckPicsWidget = uploadcare.MultipleWidget('#deck-pics');
    deckPicsWidget.onChange(function(info) { 
        if(info == null) {
            deckPicsCount = 0;
        }    
        else {
            deckPicsCount = info.files().length;
        }    
    });
}

function validateProof() {
    if(proofPicsCount <= 1 ) {
        $('#proof-form-group .invalid-feedback').show();
        return false; 
    }
    else {
        $('#proof-form-group .invalid-feedback').hide();
        return true; 
    }
}

function validateDeck() {
    if(deckPicsCount < 1 ) {
        $('#deck-form-group .invalid-feedback').show();
        return false; 
    }
    else {
        $('#deck-form-group .invalid-feedback').hide();
        return true; 
    }
}