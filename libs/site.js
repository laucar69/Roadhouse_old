$(document).ready(function(){
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, a.internal").on('click', function(event) {

   // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {

    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 900, function(){

      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
      });
    } 
	closePanel();
})
})

function closePanel(){
	$('.navbar-header button').attr('aria-expanded','false');
	$('.navbar-header button').addClass('collapsed');

	$('.navbar-collapse').removeClass('in');
	$('.navbar-collapse').attr('aria-expanded','false');


}


$(document).ready(function() {
	
	$('.form-group button').click(function(){
		$('#contact_form').attr('action',$('#contact_form').attr('action') + "?chck=js");
	})

    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Bitte gib deinen Namen an'
                    }
                }
            },             
            mailfrom: {
                validators: {
                    notEmpty: {
                        message: 'Bitte trage deine eMail Adresse ein'
                    },
                    emailAddress: {
                        message: 'Bitte trage eine richtige eMail Adresse ein'
                    }
                }
            },
			subject: {
                validators: {
                    notEmpty: {
                        message: 'Bitte trage einen kurzen Betreff ein'
                    }
                }
            },
            comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 300,
                        message:'Bitte schreibe mindestens 10 Zeichen und nicht mehr als 200'
                    },
                    notEmpty: {
                        message: 'Bitte trage deine Mitteilung ein'
                    }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#contact_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post($form.attr('action'), $form.serialize(), function(result) {
                console.log(result);
            }, 'json');
        });
});