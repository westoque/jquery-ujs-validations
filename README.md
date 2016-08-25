Unobtrusive remote validations for jQuery
=========================================

Allows remote validation of form fields using unobtrusive javascript and beautiful rails patterns.

## Motivation

It's 2016. We should be validating real time instead of on submit. Others, add pure javascript solutions which adds complexity and duplication to our app, since rails also comes with it's own validations. Why not use it to our advantage?

Like [jquery_ujs][0], this unobtrusive scripting library is also developed
for the Ruby on Rails framework but is not also strictly tied to any
specific backend.

Here's a demo: DEMO_LINK_HERE

Installation
------------

We currently only support bower as of this moment.

    bower install jquery_ujs_validations

## Usage

General usage is just to add the data attribute `remote_validation_url` with the url for the validation to the `<form>` and add the `validate` method in your controller and everything should just work out of the box.

### Usage with `form_for`

In your view

    # views/contacts/new.html.erb

    <%= form_for @contact, data: { remote_validation_url: validate_contact_path } do |f| %>
      <div>
        <%= f.label :name %>
        <%= f.text_field :name %>
      </div>

      <div>
        <%= f.submit %>
      </div>
    <% end %>


And in your controller, you **SHOULD** namespace your model when returning a json response.

    # controllers/contacts_controller.rb

    class ContactsController < ApplicationController
      def validate
        contact = Contact.new(contact_params)

        if contact.valid?
          head :ok
        else
          render json: { contact: contact.errors }, status: :unprocessable_entity
        end
      end

      protected

      def contact_params
        params.require(:contact).permit!
      end
    end


### Usage with `form_tag`

In your view

    # views/contacts/new.html.erb

    <%= form_tag :search, data: { remote_validation_url: validate_search_path } do %>
      <%= f.label :q %>
      <%= f.text_field :q %>
      <%= submit_tag :search %>
    <% end %>

And in your controller

    # controllers/search_controller.rb

    class SearchController < ApplicationController
      def validate
        if params[:q].blank?
          render json: { q: ["query is invalid"] }
        else
          head :ok
        end
      end
    end


## Customization

The default error handling behavior is to wrap the `<input>` with `<div class="field_with_errors">`. If you want to customize this behavior, you should listen to the `errors:field` event, and add your own custom handler.

Here's an example when using bootstrap:

    $("form[remote_validation_url]").on("errors:field", function(jqEl, errors) {
      if (errors.length > 0) {
        console.log("has errors");
      } else {
        console.log("no errors");
      }
    });

[0]: https://github.com/rails/jquery-ujs
