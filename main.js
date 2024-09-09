import Select from './custom_select/select.js'

const selectElement = document.querySelector('[data-custom]');
//Create custom select element
const customSelect = new Select(selectElement);

const submitButton = document.querySelector('button');
const colorPicker = document.querySelector('#color-picker');
const colorDivs = document.querySelectorAll('#colors > div');
const colorSpans = document.querySelectorAll('#colors > div > p > span');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const hexCode = colorPicker.value.slice(1);
    const mode = customSelect.value;
    const count = 5;
    const baseUrl = 'https://www.thecolorapi.com/scheme?';

    getScheme(baseUrl, hexCode, mode, count);
})

colorSpans.forEach(span => {
    span.addEventListener('click', function() {
        //Copy to clipboard
        navigator.clipboard.writeText(this.innerText);
        //Confirmation message
        const messageExists = document.getElementById('clipboard-message');
        if (messageExists) {
           messageExists.remove(); 
        }
        const message = document.createElement('div');
        message.id = 'clipboard-message';
        message.innerText = 'Copied to clipboard!';
        this.closest('div').append(message); 
        setTimeout(() => {
            message.remove();
        }, 750)
    })
})

async function getScheme(url, hexCode, mode, count) {
    try {
        const response = await fetch(`${url}hex=${hexCode}&format=json&mode=${mode}&count=${count}`)
        if (!response.ok) {
            throw new Error(`Error ${response.status}`)
        }
        const colorsObj = await response.json();
        //Get hex codes
        const colorsArr = colorsObj.colors.map((color) => {
            return color.hex.value;
        })
        //Change display colors
        for (let i = 0; i < colorsArr.length; i++) {
            colorDivs[i].style.backgroundColor = `${colorsArr[i]}`;
        }
        //Change display spans
        for (let j = 0; j < colorsArr.length; j++) {
            colorSpans[j].innerText = `${colorsArr[j]}`;
        }

    } catch(error) {
        console.error(error);
    }
}