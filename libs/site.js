$(function () {
  setupSmoothScrolling();
  setupBackToTop();
  setupContactForm();
});

function setupSmoothScrolling() {
  $(".navbar a, a.internal").on("click", function (event) {
    var hash = this.hash;

    if (!hash) {
      return;
    }

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
}

function closePanel() {
  if (typeof bootstrap === "undefined") {
    return;
  }

  var collapseElement = document.getElementById("myNavbar");

  if (!collapseElement) {
    return;
  }

  var collapseInstance =
    bootstrap.Collapse.getInstance(collapseElement) ||
    new bootstrap.Collapse(collapseElement, { toggle: false });

  collapseInstance.hide();
}

function setupBackToTop() {
  var $window = $(window);
  var $backToTop = $(".back-to-top-layer");

  if (!$backToTop.length) {
    return;
  }

  function updateVisibility() {
    $backToTop.toggleClass("is-visible", $window.scrollTop() > 260);
  }

  $window.on("scroll", updateVisibility);
  updateVisibility();
}

function setupContactForm() {
  var $form = $("#contact_form");
  var $success = $("#success_message");
  var $fields = $form.find("input, textarea, select");

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

    $field.toggleClass("is-invalid", !isValid);
    $feedback.text(isValid ? "" : getValidationMessage(field));

    return isValid;
  }

  function resetValidationState() {
    $fields.removeClass("is-invalid");
    $form.find(".invalid-feedback").text("");
  }

  function buildRequestUrl(action) {
    if (!action) {
      return "";
    }

    return action + (action.indexOf("?") === -1 ? "?chck=js" : "&chck=js");
  }

  $fields.on("input change blur", function () {
    setFieldState(this);
  });

  $form.on("submit", function (event) {
    event.preventDefault();
    $success.hide();

    var isFormValid = $fields.toArray().every(setFieldState);

    if (!isFormValid) {
      return;
    }

    $.ajax({
      url: buildRequestUrl($form.attr("action")),
      method: "POST",
      data: $form.serialize(),
      dataType: "json"
    })
      .done(function () {
        $success.slideDown("slow");
        $form.trigger("reset");
        resetValidationState();
      })
      .fail(function (xhr, status, error) {
        console.error("Form submission failed:", status, error);
      });
  });
}
