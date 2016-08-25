(function($) {

  function doRemoteValidationRequest($currentTarget) {
    var $form = $currentTarget.parents('form[data-remote-validation-url]');
    var url = $form.data('remoteValidationUrl');

    $.ajax({
      url      : url,
      data     : $form.serialize(),
      method   : 'POST',
      dataType : 'json',
      success  : function() {},
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

        errors = map[$currentTarget.attr("name")] || [];

        $form.trigger("error:field", [$currentTarget, errors])
      }
    });
  }

  var $document = $(document);

  $document.on("blur.rails", "form[data-remote-validation-url] input[type=text]", function(evt) {
    var $currentTarget = $(evt.currentTarget);
    doRemoteValidationRequest($currentTarget);
  });

  $document.on("change.rails", "form[data-remote-validation-url] select", function(evt) {
    var $currentTarget = $(evt.currentTarget);
    doRemoteValidationRequest($currentTarget);
  });

  $document.on("change.rails", "form[data-remote-validation-url] input[type=radio]", function(evt) {
    var $currentTarget = $(evt.currentTarget);
    doRemoteValidationRequest($currentTarget);
  });

})(jQuery);
