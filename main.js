import Select from './custom_select/select.js'

//Get all select elements
const selectElement = document.querySelector('[data-custom]');

//Create custom select element for each select element
const customSelect = new Select(selectElement);