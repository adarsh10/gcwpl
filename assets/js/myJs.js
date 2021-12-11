$(window).load(function(){
    $(".loader").fadeOut(400);
    $(".custom-body").fadeIn(800);
});

$(document).ready(function() {
});

// form_candidate ajax script
$(function() {
    $("#contact").submit(function(eventObj) {
        eventObj.preventDefault();

        var statusCheck = 1;
        var name  = $('#lead_name').val();
        var mobile  = $('#lead_mobile').val();
        var email  = $('#lead_email').val();
        var message  = $('#lead_message').val();

        var nameCheck = validateName(name);
        var mobileCheck = validateMobile(mobile);
        var emailCheck = validateEmail(email);

        switch(nameCheck){
            case 0: alert("Your name contains number. Please Enter a valid Name"); statusCheck=0; break;
            case 2: alert("Your name cannot be blank spaces. Enter a valid name"); statusCheck=0; break;
            case 3: alert("Your name contains special symbols. Enter a valid name"); statusCheck=0; break;
            case 4: alert("Please enter your name"); statusCheck=0; break;
        }

        if(mobileCheck == 0){
            alert("Enter a valid mobile number");
            statusCheck=0;
        } else if(mobileCheck == 1){
            alert("Enter 10 digit mobile number");
            statusCheck=0;
        }
        
        if(!emailCheck){
            alert("Please provide your valid email ID");
            statusCheck = 0;
        }
        
        if(statusCheck == 1){
            $("#contact-submit").attr("disabled","disabled");
            try {
                var s = {
                    leadName: name,
                    leadMobile: mobile,
                    leadEmail: email,
                    leadMessage: message
                };
                $.ajax({
                    type: "POST",
                    url: "/contactSubmit",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(s),
                    success: processDataContact
                });
            } catch (exception) {
                console.log("exception occured!!" + exception);
            }
        }
    }); // end of submit
}); // end of function

function processDataContact(returnedData) {
    if(returnedData == "1"){
        $('#contact')[0].reset();
        alert("Thank you! Request sent!")
    } else{
        $("#contact-submit").removeAttr("disabled");
        alert("Looks like something went wrong. Please try again later!")
    }
}


/* validation */
function validateMobile(mobile) {
    if(mobile == undefined){
        return 1;
    }
    var validMobile = /^[7-9]{1}[0-9]{9}$/i;
    if (mobile.length > 0 && validMobile.test(mobile) === false) {
        return 0; // format is wrong
    } else if (mobile.length == 0) {
        return 1; // not 10 digits
    }
    else{
        return 2; // passed
    }
}

function validateName(name) {
    var validName = /^[a-zA-Z]+$/;
    var spacing = /^[ ]+$/;
    var specialChars = /[^\w\s]/gi;
    var numberChar = /^[a-zA-Z0-9]+$/;

    if (validName.test(name)) {
        return 1; //correct
    } else if (numberChar.test(name)) {
        return 0; //name contains integer
    } else {
        if(spacing.test(name) == true){
            return 2; // blank spaces
        } else if(name == ""){
            return 4;
        } else{
            if(specialChars.test(name)) {
                return 3; //name has special characters
            } else{
                return 1; // name valid with space in between
            }
        }
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}