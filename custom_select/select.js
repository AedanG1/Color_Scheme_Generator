export default class Select {
    constructor(element) {
        this.element = element;
        //Change node list of options to object
        this.options = getFormattedOptions(element.querySelectorAll('option'));
        this.customContainer = document.createElement('div');
        this.labelElement = document.createElement('span');
        this.optionsContainer = document.createElement('ul');
        setupCustomElement(this);
        //Hide default select
        element.style.display = 'none';
        //Insert custom select after our original select in the DOM
        element.after(this.customContainer);
        this.value = this.selectedOption.value;
    }
    //Get option that's selected by default
    get selectedOption() {
        return this.options.find(option => option.selected);
    }
    //Get the index of the current selected option
    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption);
    }
    //Set new selected option
    selectValue(value) {
        //Find option element with the value that was passed in
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        })
        //Get previous selected option from selectedOption method
        const previousSelectedOption = this.selectedOption;
        //Set previous selected option selected attribute to false and new one to true
        previousSelectedOption.selected = false;
        previousSelectedOption.element.selected = false;
        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;
        //Update value property to new selection
        this.value = newSelectedOption.value;

        this.labelElement.innerText = newSelectedOption.label;
        //Remove .selected class from previous selected option
        this.optionsContainer
            .querySelector(`[data-value="${previousSelectedOption.value}"]`)
            .classList.remove('selected');
        //Add .selected class to clicked option
        const newCustomElement = this.optionsContainer
            .querySelector(`[data-value="${newSelectedOption.value}"]`);
        newCustomElement.classList.add('selected');
        //Make sure the option selected is visible
        newCustomElement.scrollIntoView({ block: 'nearest' });
    }
}

function setupCustomElement(select) {
    //Add class to custom select container
    select.customContainer.classList.add('custom-select-container');
    //Allow tab focusing on custom select container
    select.customContainer.tabIndex = 0;
    /*Add class to custom label element, set custom label to selected option,
    append custom label to custom container*/
    select.labelElement.classList.add('custom-select-value');
    select.labelElement.innerText = select.selectedOption.label;
    select.customContainer.append(select.labelElement);
    /*Add class to custom options container, create custom options for each original option,
    append custom options container to custom select container*/
    select.optionsContainer.classList.add('custom-select-options');
    select.options.forEach(option => {
        const optionElement = document.createElement('li');
        optionElement.classList.add('custom-select-option');
        optionElement.classList.toggle('selected', option.selected);
        optionElement.innerText = option.label;
        optionElement.dataset.value = option.value;
        optionElement.addEventListener('click', () => {
            //Add selected attribute to clicked option
            select.selectValue(option.value);
            //Hide options container
            select.optionsContainer.classList.remove('show');
        })
        select.optionsContainer.append(optionElement);
    })
    select.customContainer.append(select.optionsContainer);

    //Toggle custom options container when custom select container is clicked
    select.labelElement.addEventListener('click', () => {
        select.optionsContainer.classList.toggle('show');
    })
    //Hide custom options container when clicked anywhere else
    select.customContainer.addEventListener('blur', () => {
        select.optionsContainer.classList.remove('show');
    })

    let debounceTimeout
    let searchTerm = "";
    select.customContainer.addEventListener('keydown', event => {
        switch (event.code) {
            case "Space":
                select.optionsContainer.classList.toggle('show');
                break;
            case "ArrowUp":
                const prevOption = select.options[select.selectedOptionIndex - 1];
                if (prevOption) {
                    select.selectValue(prevOption.value);
                }
                break;
            case "ArrowDown":
                const nextOption = select.options[select.selectedOptionIndex + 1];
                if (nextOption) {
                    select.selectValue(nextOption.value);
                }
                break;
            case "Enter":
            case "Escape":
                select.optionsContainer.classList.remove("show");
                break;
            default:
                //Cancels clearing the search string when a new key is pressed
                clearTimeout(debounceTimeout);
                //Add new character to search string
                searchTerm += event.key;
                //Clear search after 500ms
                debounceTimeout = setTimeout(() => {
                    searchTerm = ""
                }, 500)
                //Finds option that starts with user input search string
                const searchedOption = select.options.find(option => {
                    return option.label.toLowerCase().startsWith(searchTerm);
                })
                //If there's a match, select the searched option
                if (searchedOption) select.selectValue(searchedOption.value);
        }
    })
}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        }
    })
}