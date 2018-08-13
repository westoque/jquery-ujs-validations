/* globals TestResponses */

describe('form with data-remote-validation-url attribute', function() {
  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();

    resetForm();
  });

  it('submits the form once when there are no errors', function(done) {
    var expected = 1;
    var submissions = 0;
    var isSubmitting = false;

    injectForm('<input type="text" name="zipcode" />');

    var $form = $('form');

    $form.submit(function() {
      if (!isSubmitting) {
        setTimeout(function () {
          expect(submissions).toEqual(expected);
          done();
        }, 5);
      }

      submissions += 1;
      isSubmitting = true;
    });

    $form.submit();

    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(TestResponses.validate.success);
  });

  it('shows errors for a checkbox without a hidden field', function(done) {
    var checkBoxArray = '<input type="checkbox" value="red" name="user[colors][]" id="user_colors_red">';

    injectForm(checkBoxArray);

    $('form').on('error:field', function(evt, $field, errors) {
      expect(errors.length).toEqual(1);
      expect($field.attr('type')).toEqual('checkbox');
      done();
    });

    var $input = $('#user_colors_red');
    $input.trigger('change');

    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(TestResponses.validate.failure);
  });

  it('shows errors for a checkbox with a hidden field', function(done) {
    var checkBoxArray = '<input type="checkbox" value="red" name="user[colors][]" id="user_colors_red">' +
                        '<input type="hidden" name="user[colors][]" value="">';

    injectForm(checkBoxArray);

    $('form').on('error:field', function(evt, $field, errors) {
      expect(errors.length).toEqual(1);
      expect($field.attr('type')).toEqual('hidden');
      done();
    });

    var $input = $('#user_colors_red');
    $input.trigger('change');

    var request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(TestResponses.validate.failure);
  });

  function injectForm(input) {
    document.getElementById('root').innerHTML = '<form data-remote-validation-url="/users/validate">' +
                                                  '<div class="form-group">' +
                                                      input +
                                                  '</div>' +
                                                '</form>';
  }

  function resetForm() {
    document.getElementById('root').innerHTML = '';
  }

});
