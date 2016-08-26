(function($) {

  var formSelector = 'form[data-remote-validation-url]';

  function triggerErrorForAllFields($form, mapping) {
    for (var name in mapping) {
      var $field = $('[name="' + name + '"]');
      if ($field.length > 0) {
        triggerErrorForOneField($form, $field, mapping[name]);
      }
    }
  }

  function triggerErrorForOneField($form, $field, errors) {
    $form.trigger('error:field', [$field, errors])
  }

  function doRemoteValidationRequest(evt) {
    var $currentTarget, isTargetForm, form, url;

    $currentTarget = $(evt.currentTarget);
    isTargetForm = $currentTarget.prop('tagName') === "FORM";
    $form = isTargetForm ? $currentTarget : $currentTarget.parents(formSelector);
    url = $form.data('remoteValidationUrl');

    // Don't submit yet until later.
    if (isTargetForm) {
      evt.preventDefault();
    }

    $.ajax({
      url      : url,
      data     : $form.serialize(),
      method   : 'POST',
      dataType : 'json',
      success  : function() {
        if (isTargetForm) {
          $document.off("submit.ujs-validations");
          $form.submit();
          return;
        }

        triggerErrorForOneField($form, $currentTarget, []);
      },
      error    : function(evt) {
        var
          data = JSON.parse(evt.responseText),
          map  = {},
          errors;

        for (var d in data) {
          if (Object.prototype.toString.call(data[d]) === '[object Array]') {
            map[d] = data[d];
          } else {
            for (var attr in data[d]) {
              map[d + "[" + attr + "]"] = data[d][attr];
            }
          }
        }

        if (isTargetForm) {
          triggerErrorForAllFields($form, map);
        } else {
          triggerErrorForOneField($form, $currentTarget, map[$currentTarget.attr('name')] || []);
        }
      }
    });
  }

  var $document = $(document);

  // "blur" for <input type="text" />
  $document.on("blur.ujs-validations", "form[data-remote-validation-url] input[type=text]", function(evt) {
    doRemoteValidationRequest(evt);
  });

  // "blur" for <textarea>
  $document.on("blur.ujs-validations", "form[data-remote-validation-url] textarea", function(evt) {
    doRemoteValidationRequest(evt);
  });

  // "blur" for <select>
  $document.on("blur.ujs-validations", "form[data-remote-validation-url] select", function(evt) {
    doRemoteValidationRequest(evt);
  });

  // "change" for <select>
  $document.on("change.ujs-validations", "form[data-remote-validation-url] select", function(evt) {
    doRemoteValidationRequest(evt);
  });

  // "change" for <input type="radio">
  $document.on("change.ujs-validations", "form[data-remote-validation-url] input[type=radio]", function(evt) {
    doRemoteValidationRequest(evt);
  });

  $document.on("submit.ujs-validations", "form[data-remote-validation-url]", function(evt) {
    doRemoteValidationRequest(evt);
  });

})(jQuery);
