import jQuery from 'jQuery';
import normalizeNameAttr from './utils/normalizeNameAttr';
import $document from './doc';

const $ = jQuery;

var formSelector = 'form[data-remote-validation-url]';

function checkBoxOrHiddenField($field) {
  var sel = 'input[type="hidden"][name="' + $field.attr('name') + '"]';
  var obj = $field.parents(formSelector).find(sel);
  return obj.length ? obj : $field;
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
        triggerErrorForOneField($form, $field, errors);
      }
    }
  }
}

function triggerErrorForOneField($form, $field, errors) {
  $form.trigger('error:field', [$field, errors]);
}

function validate(evt) {
  const $relatedTarget = $(evt.relatedTarget);
  const $currentTarget = $(evt.currentTarget);
  const isRelatedTargetSubmit = $relatedTarget.attr('type') === 'submit'; // supports `<button>` and `<input>`
  const isTargetForm = $currentTarget.is('form');
  const $form = isTargetForm ? $currentTarget : $currentTarget.parents(formSelector);
  const url = $form.data('remoteValidationUrl');

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

export default validate;
