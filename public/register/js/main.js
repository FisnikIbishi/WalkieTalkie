(function ($) {
    "use strict";

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(event){        
        var check = true;
        
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if (!check) {
            event.preventDefault(); // prevent form submission
        }
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
            hideValidate(this);
        });
    });

    function validate (input) {
        var value = $(input).val().trim();

        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if(value.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
               
                return false;
            }
        }
        else if ($(input).attr('name') == 'username') {
            if (value.length < 8) {
              
                return false;
            }
        }
        else if ($(input).attr('name') == 'birthday') {
            if (value == '') {
                return false;
            } else {
                // Check if the user is at least 16 years old
                var today = new Date();
                var birthDate = new Date(value);
                var age = today.getFullYear() - birthDate.getFullYear();
                var month = today.getMonth() - birthDate.getMonth();
                if (age < 16 || (age == 16 && month < 0) || (age == 16 && month == 0 && today.getDate() < birthDate.getDate())) {
                    return false;
                }
            }
        }
        
        
        else if ($(input).attr('name') == 'password') {
            if (!value.match(/[A-Z]/) || !value.match(/[0-9]/) || !value.match(/[$@$!%*#?&]/)) {
                
                return false;
            }
        }
        else if ($(input).attr('name') == 'confirm-pass') {
            if (value != $('input[name="password"]').val()) {
                
                return false;
            }
        }
        else {
            if(value == ''){
                return false;
            }
        }
        return true;
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    
        // Show error message within the input element's parent container
        var errorMsg = $('<span/>', {
            class: 'error-msg',
            text: getErrorMessage(input)
        });
    
        // Only append the error message if it doesn't already exist
        if ($(thisAlert).find('.error-msg').length === 0) {
            $(thisAlert).append(errorMsg);
        }
    }
    
    
    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
        $(thisAlert).find('.error-msg').remove();
    }
    
    function getErrorMessage(input) {
        var name = $(input).attr('name');
        if(name == 'username') {
            return 'Username must be at least 8 characters long';
        }
        else if(name == 'email') {
            return 'Email must be filled';
        }
        else if(name == 'birthday') {
            return 'Birthday must be 16+';
        }
        else if(name == 'password') {
            return 'Password must have at least one Capital letter, one number and one symbol';
        }
        else if(name == 'confirm-pass') {
            return 'Confirm Password must be the same as password';
        }
        else {
            return 'Please fill in this field';
        }
        
    }


    
    // const registerButton = document.getElementById('register-btn');

    // registerButton.addEventListener('click', () => {
    //   // Validation code
    //   var check = true;
    //   var input = $('.validate-input .input100');
    
    //   for(var i=0; i<input.length; i++) {
    //     if(validate(input[i]) == false){
    //       showValidate(input[i]);
    //       check=false;
    //     }
    //   }
    
    //   if (check) {
    //     alert("Form submitted successfully!");
    //     $(this).trigger("reset"); // reset form after submission
    
    //     // If there are no errors, redirect to the home page
    //     window.location.href = "/home";
    //   }
    // });
    
    


})(jQuery);



