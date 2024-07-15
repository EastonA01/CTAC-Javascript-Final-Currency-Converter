// Global Variable Declarations //
const base_currency = document.getElementById("base-currency"); // Get base-currency select tag
const target_currency = document.getElementById("target-currency"); // Target Currency
const currency_amount = document.getElementById("amount"); // Currency exchange value
const historical_date = document.querySelector('input[type="date"]');
const apiStart = 'https://api.freecurrencyapi.com/';
const currencies = 'v1/currencies?apikey=fca_live_kEF1vdXkCmPfgXDV7ZLoWUZEsfL9pGER9YZ40hYq&currencies='
const latest = 'v1/latest?apikey=fca_live_kEF1vdXkCmPfgXDV7ZLoWUZEsfL9pGER9YZ40hYq&currencies='
const APIkey = 'fca_live_kEF1vdXkCmPfgXDV7ZLoWUZEsfL9pGER9YZ40hYq'
// Variable declaration for amounts
let target = null;
let amount = 1; // Base amount for when site is initialized
let base = null;
let date = "2024-07-01" // Arbitrary date that is the current default for the input
//^^ Global Variable Declarations ^^//

// Function to get all currency data
const getCurrencies = async () => {
    try {
      // Make the fetch request
      const response = await fetch(`${apiStart}${currencies}`);
      
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

// Function to set the max date for the date input to today's date
const setMaxDate = () => {
    const dateInput = document.getElementById('start');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute("max", today);
}

// Event listeners for if there is a change of amount/target/base/date
currency_amount.addEventListener('change', function(event) {
    // Get the value of the selected option
    const selectedValue = event.target.value;

  amount = selectedValue;
  if(amount <= 0){
    alert("Invalid amount")
  }
  else if(target == base){
      alert("Base and target values cannot be the same!")
  }
  else if(target != null && base != null){
      latestFetch();
  }
  else{
      alert("Please pick a target and/or base value!")
  }
});
base_currency.addEventListener('change', function(event) {  // Event listener for when base currencies change
    // Get the value of the selected option
    const selectedValue = event.target.value;

    // Log the value to the console
    // console.log('Base value:', selectedValue); // Testing Log, Ignore
    base = selectedValue;
    if(target == base){
      alert("Base and target currencies cannot be the same!")
    }
    else if(target != null){
        latestFetch();
    }
    else{
        alert("Please pick a target value!")
    }
});
target_currency.addEventListener('change', function(event) { // Target event listener
    // Get the value of the selected option
    const selectedValue = event.target.value;

    // Log the value to the console
    // console.log('Targeted value:', selectedValue); // Testing log, ignore
    target = selectedValue;
    // Check if base currency != null or for currencies matching
    if(target == base){
      alert("Base and target currencies cannot be the same!")
    }
    else if(base != null){
        latestFetch();
    }
    else{
        alert("Please pick a base value!")
    }
});
historical_date.addEventListener('change', function(event) { // Date event listener
  // Get the value of the selected option
  const selectedValue = event.target.value;

  date = selectedValue;

  if(base != null && target != null){
    console.log("All Requirements satisfied, histories is a go.");
  }
  else{
      alert("Please pick a base value!")
  }
});

// Function that on change of currencies or amount- update converted-amount
const latestFetch = async () => {
    const response = await fetch(`${apiStart}${latest}${target}&base_currency=${base}`);
    const data = await response.json();
    const exchangeRate = data.data[target]; // Change 'target' to the desired currency code

    const convertedAmount = amount * exchangeRate;
    // console.log(`Converted Amount: ${convertedAmount}`); // Testing for exchange rate, ignore
    const resultElement = document.getElementById('converted-amount');
    resultElement.innerHTML = `${convertedAmount.toFixed(2)} ${target}`;
}

const histoRates = async () => {
    // API Request
    const response = await fetch(`${apiStart}v1/historical?apikey=${APIkey}&currencies=${target}&date=${date}&base_currency=${base}`);
    // Response data
    const data = await response.json();
    // Get rate @ object data.data @ position of Target (in this case currency code like 'EUR' or 'USD')
    const histoRate = Object.values(data)[0][date][target];
    // Get container
    const histoContainer = document.getElementById("historical-rates-container");
    // console.log(histoRate); // Testing log, ignore
    histoContainer.innerHTML = `${base} to ${target} conversion rate on ${date} was $${histoRate.toFixed(2)}`;
}
// Event listener to get historical rates
const btn = document.getElementById("historical-rates");
btn.addEventListener("click", histoRates);

document.getElementById('save-favorite').addEventListener('click', async () => {
    if (!base || !target || base === target) {
        alert('Please select different base and target currencies.');
        return;
    }

    try {
        const response = await fetch('/api/currency-pairs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ baseCurrency: base, targetCurrency: target })
        });
        const data = await response.json();
        alert('Favorite saved!');
        fetchFavoritePairs();
    } catch (error) {
        console.error('Error saving favorite:', error);
        alert('Failed to save favorite.');
    }
});

async function fetchFavoritePairs() {
    try {
        // Fetch our favorites from our mock express api with sequelize
        const response = await fetch('/api/currency-pairs');
        // Parse response
        const pairs = await response.json();
        // Append to container
        const container = document.getElementById('favorite-currency-pairs');
        container.innerHTML = ''; // Clear container if there is anything inside
        // Loop
        pairs.forEach(pair => {
            const div = document.createElement('div');
            div.textContent = `${pair.baseCurrency} to ${pair.targetCurrency}`;
            div.classList.add('favorite-pair');
            div.dataset.baseCurrency = pair.baseCurrency;
            div.dataset.targetCurrency = pair.targetCurrency;
            container.appendChild(div);
        });

        // Add click event listeners to favorite pairs
        const favoritePairs = document.querySelectorAll('.favorite-pair');
        favoritePairs.forEach(pair => {
            pair.addEventListener('click', function() {
                base_currency.value = this.dataset.baseCurrency;
                target_currency.value = this.dataset.targetCurrency;
                base = this.dataset.baseCurrency;
                target = this.dataset.targetCurrency;
                latestFetch();
            });
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchFavoritePairs(); // Fetch pair of our previous favorites
    setMaxDate(); // Set max date for date input when page is loaded
});
