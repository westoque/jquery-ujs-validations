/* globals TestResponses */

describe('Simple', function() {
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

  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('shows errors for a checkbox with hidden field', function(done) {
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

    resetForm();
  });

  it('shows errors for a checkbox without hidden field', function(done) {
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

    resetForm();
  });
});
