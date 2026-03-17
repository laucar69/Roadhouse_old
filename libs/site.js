$(function () {
  $(".navbar a, a.internal").on("click", function (event) {
    if (!this.hash) {
      return;
    }

    var hash = this.hash;
    var $target = $(hash);

    if (!$target.length) {
      return;
    }

    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $target.offset().top
      },
      900,
      function () {
        window.location.hash = hash;
      }
    );

    closePanel();
  });

  setupContactForm();
});

function closePanel() {
  var collapseElement = document.getElementById("myNavbar");

  if (!collapseElement || typeof bootstrap === "undefined") {
    return;
  }

  var collapseInstance = bootstrap.Collapse.getInstance(collapseElement);

  if (collapseInstance) {
    collapseInstance.hide();
  }
}

function setupContactForm() {
  var $form = $("#contact_form");
  var $success = $("#success_message");

  if (!$form.length) {
    return;
  }

  var fieldMessages = {
    name: {
      valueMissing: "Bitte gib deinen Namen an",
      tooShort: "Bitte gib mindestens 2 Zeichen ein"
    },
    mailfrom: {
      valueMissing: "Bitte trage deine eMail Adresse ein",
      typeMismatch: "Bitte trage eine richtige eMail Adresse ein"
    },
    subject: {
      valueMissing: "Bitte trage einen kurzen Betreff ein"
    },
    comment: {
      valueMissing: "Bitte trage deine Mitteilung ein",
      tooShort: "Bitte schreibe mindestens 10 Zeichen",
      tooLong: "Bitte schreibe nicht mehr als 300 Zeichen"
    }
  };

  function getValidationMessage(field) {
    var messages = fieldMessages[field.name] || {};
    var validity = field.validity;

    if (validity.valueMissing) {
      return messages.valueMissing || "Bitte fülle dieses Feld aus";
    }

    if (validity.typeMismatch) {
      return messages.typeMismatch || "Bitte prüfe dieses Feld";
    }

    if (validity.tooShort) {
      return messages.tooShort || "Bitte gib mehr Zeichen ein";
    }

    if (validity.tooLong) {
      return messages.tooLong || "Bitte gib weniger Zeichen ein";
    }

    return "";
  }

  function setFieldState(field) {
    var $field = $(field);
    var $feedback = $field.siblings(".invalid-feedback");
    var isValid = field.checkValidity();

    if (isValid) {
      $field.removeClass("is-invalid");
      $feedback.text("");
      return true;
    }

    $field.addClass("is-invalid");
    $feedback.text(getValidationMessage(field));
    return false;
  }

  $form.find("input, textarea, select").on("input change blur", function () {
    setFieldState(this);
  });

  $form.on("submit", function (event) {
    event.preventDefault();
    $success.hide();

    var fields = $form.find("input, textarea, select").toArray();
    var isFormValid = fields.every(setFieldState);

    if (!isFormValid) {
      return;
    }

    var action = $form.attr("action");
    var requestUrl = action.indexOf("?") === -1 ? action + "?chck=js" : action;

    $.ajax({
      url: requestUrl,
      method: "POST",
      data: $form.serialize(),
      dataType: "json"
    })
      .done(function () {
        $success.slideDown("slow");
        $form.trigger("reset");
        $form.find(".is-invalid").removeClass("is-invalid");
        $form.find(".invalid-feedback").text("");
      })
      .fail(function (xhr, status, error) {
        console.error("Form submission failed:", status, error);
      });
  });
}
