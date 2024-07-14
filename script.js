

// Global Variable Declarations //
const base_currency = document.getElementById("base-currency"); // Get base-currency select tag
const target_currency = document.getElementById("target-currency"); // Target Currency
const currency_amount = document.getElementById("amount"); // Currency exchange value
const apiStart = 'https://api.freecurrencyapi.com/';
const currencies = 'v1/currencies?apikey=fca_live_kEF1vdXkCmPfgXDV7ZLoWUZEsfL9pGER9YZ40hYq&currencies='
const latest = 'v1/latest?apikey=fca_live_kEF1vdXkCmPfgXDV7ZLoWUZEsfL9pGER9YZ40hYq&currencies='
// Variable declaration for amounts
let target = null;
let amount = null;
let base = null;
//^^ Global Variable Declarations ^^//

// Function to get all currency data
const getCurrencies = async () => {
    try {
      // Make the fetch request
    //   const response = await fetch(`${apiStart}${currencies}`);
    //   INTERIM FETCH RESPONSE DELETE LATER!
        const response = await fetch(`http://localhost:4000/calling-codes`)
      
      // Check if the response is okay (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Parse the JSON from the response
      const data = await response.json();
      
      return Object.keys(data.data); // Return the data if you need to use it elsewhere
    } catch (error) {
      // Handle errors
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

// Populate base-currency and target-currency
const populateCurrencies = async (select1, select2) => {
    // Await response
    const currencyData = await getCurrencies();
    currencyData.forEach(item => {
        // Initialize and populate options for 1 and 2
        let currencyOption1 = document.createElement('option');
        currencyOption1.value = item;
        currencyOption1.innerHTML = item;
        // Option2
        let currencyOption2 = document.createElement('option');
        currencyOption2.value = item;
        currencyOption2.innerHTML = item;
        // Append children to options
        select1.appendChild(currencyOption1);
        select2.appendChild(currencyOption2);
    });
}
populateCurrencies(base_currency, target_currency); // Populate all currency options

// Event listeners for if there is a change of amount/target/base
currency_amount.addEventListener('change', function(event) {
    // Get the value of the selected option
    const selectedValue = event.target.value;

    // Log the value to the console
    console.log('Amount:', selectedValue);
    amount = selectedValue;
});
base_currency.addEventListener('change', function(event) {  // Event listener for when base currencies change
    // Get the value of the selected option
    const selectedValue = event.target.value;

    // Log the value to the console
    console.log('Base value:', selectedValue);
    base = selectedValue;
    if(target != null){
        conversion();
    }
    else{
        alert("Please pick a target value!")
    }
});
target_currency.addEventListener('change', function(event) { // Target event listener
    // Get the value of the selected option
    const selectedValue = event.target.value;

    // Log the value to the console
    console.log('Targeted value:', selectedValue);
    target = selectedValue;
    // Check if base currency != null
    if(base != null){
        conversion();
    }
    else{
        alert("Please pick a base value!")
    }
});

// Function that on change of currencies or amount- update converted-amount
const conversion = async () => {
    try {
        // Make the fetch request
        // let response = await fetch(`${apiStart}${latest}${base}%2C${target}`)
        // // INTERIM FETCH RESPONSE DELETE LATER!
        const response = await fetch(`http://localhost:4000/conversion`)
        .then(response => response.json()) // Parse
        .then(data => {
              //  Pass data to display function
              displayLatest(data);
        })
        
        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
     
        // Parse the JSON from the response
        const data = await response.json();
    } catch (error) {
      // Handle errors
      console.error('There has been a problem with your fetch operation:', error);
    }
}

// TODO: Display data in a easily digestible format so that we may use the values to generate conversions
function displayLatest(data){
    let display = document.getElementById('data');
    let input = document.createElement('p');
    input.innerHTML = JSON.stringify(data.data, null, 2);  
    display.appendChild(input);
    console.log(`Data is ${data}`);
    console.log(`Data.data is ${data.data}`);
    object_keys = Object.keys(data.data);
    console.log(`Object keys is ${object_keys}`);
    console.log(object_keys);
    // object_keys.forEach(key => {
    //   console.log(object_keys);
    // });
    // // data = Object.keys(data.EUR);
    // data.forEach(item => {
    //     console.log(data);
    // });
}

// TODO: Generate currency conversion with data from displayLatest