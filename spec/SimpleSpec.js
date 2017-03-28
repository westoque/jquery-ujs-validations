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

  it('shows errors for a checkbox with [name] being an array', function(done) {
    const checkBoxArray = '<input type="checkbox" value="red" name="user[colors][]" id="user_colors_red">' +
                          '<input type="hidden" name="user[colors][]" value="">';

    injectForm(checkBoxArray);

    $('form').on('error:field', function($field, errors) {
      expect(errors.length).toEqual(1);
      done();
    });

    const $input = $('#user_colors_red');
    $input.trigger('change');

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith(TestResponses.validate.failure);

    resetForm();
  });
});
