import validate from './validate';
import $document from './doc';

$document.on("blur.ujs-validations", "form[data-remote-validation-url] input[type=text]", validate);
$document.on("blur.ujs-validations", "form[data-remote-validation-url] textarea", validate);
$document.on("blur.ujs-validations", "form[data-remote-validation-url] select", validate);
$document.on("change.ujs-validations", "form[data-remote-validation-url] select", validate);
$document.on("change.ujs-validations", "form[data-remote-validation-url] input[type=checkbox]", validate);
$document.on("change.ujs-validations", "form[data-remote-validation-url] input[type=radio]", validate);
$document.on("submit.ujs-validations", "form[data-remote-validation-url]", validate);
