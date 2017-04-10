(function($) {

  var formSelector = 'form[data-remote-validation-url]';

  function checkBoxOrHiddenField($field) {
    var sel = 'input[type="hidden"][name="' + $field.attr('name') + '"]';
    var obj = $field.parents(formSelector).find(sel);
    return obj.length ? obj : $field;
  }

  function normalizeNameAttr(name) {
    return name.replace(/\[\]/, '');
  }

  function normalizeField($field) {
    if ($field.attr('type') === 'checkbox') {
      return checkBoxOrHiddenField($field);
    }

    return $field;
  }

  function triggerErrorForAllFields($form, formMap, errorMap) {
    var name, $field, errors;

    for (name in formMap) {
      if (formMap.hasOwnProperty(name)) {
        $field = $('[name="' + name + '"]');
        if ($field.length > 0) {
          errors = errorMap[normalizeNameAttr(name)] || [];
          $field = normalizeField($field);
          triggerErrorForOneField($form, $field, errors);
        }
      }
    }
  }

  function triggerErrorForOneField($form, $field, errors) {
    $form.trigger('error:field', [$field, errors]);
  }

  function doRemoteValidationRequest(evt) {
    var
      $relatedTarget,
      $currentTarget,
      isTargetForm,
      isRelatedTargetSubmit,
      $form, url;

    $relatedTarget = $(evt.relatedTarget);
    $currentTarget = $(evt.currentTarget);
    isRelatedTargetSubmit = $relatedTarget.attr('type') === 'submit'; // supports `<button>` and `<input>`
    isTargetForm = $currentTarget.is('form');
    $form = isTargetForm ? $currentTarget : $currentTarget.parents(formSelector);
    url = $form.data('remoteValidationUrl');

    // Delegate method to submit so we don't do a double validate
    // This will trigger a "submit" event.
    if (isRelatedTargetSubmit) {
      return;
    }

    // Don't submit yet until later.
    if (isTargetForm) {
      evt.preventDefault();
    }

    // Create form to javascript object mapping
    var formMap = {};
    $form.serializeArray().forEach(function(obj) {
      formMap[obj.name] = obj.value;
    });

    $.ajax({
      url      : url,
      data     : $form.serialize(),
      method   : 'POST',
      dataType : 'json',
      success  : function() {
        if ($currentTarget.is('form')) {
          triggerErrorForAllFields($form, formMap, {});
        } else {
          triggerErrorForOneField($form, $currentTarget, []);
        }

        if (isTargetForm || isRelatedTargetSubmit) {
          $document.off("submit.ujs-validations");
          $form.submit();
          return;
        }
      },
      error    : function(evt) {
        var
          data = JSON.parse(evt.responseText),
          errorsMap = {};

        for (var d in data) {
          if (Object.prototype.toString.call(data[d]) === '[object Array]') {
            errorsMap[d] = data[d];
          } else {
            for (var attr in data[d]) {
              if (data[d].hasOwnProperty(attr)) {
                errorsMap[d + "[" + attr + "]"] = data[d][attr];
              }
            }
          }
        }

        if (isTargetForm) {
          triggerErrorForAllFields($form, formMap, errorsMap);
        } else {
          var name = normalizeNameAttr($currentTarget.attr('name'));
          var $field = normalizeField($currentTarget);
          triggerErrorForOneField($form, $field, errorsMap[name] || []);
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

  // "change" for <input type="checkbox">
  $document.on("change.ujs-validations", "form[data-remote-validation-url] input[type=checkbox]", function(evt) {
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
