<script>
// Immediately Invoked Function Expression (IIFE) to avoid polluting the global namespace
(function() {
    // Function to convert all elements with class 'price' to the user's preferred currency
    async function convertPrices() {
        // Select all elements that contain prices
        const priceElements = document.querySelectorAll('.price');

        // Iterate over each price element to convert its content
        priceElements.forEach(async (element) => {
            // Extract the amount (assuming the price is the element's text content)
            const amount = parseFloat(element.innerText);
            
            // Construct the API URL for conversion (replace 'yourapi.com' with your actual API domain)
            // 'baseCurrency' should be set to the site's default currency
            const apiUrl = `https://yourapi.com/currency-converter/convert-for-traveler?amount=${amount}&baseCurrency=EUR`;

            try {
                // Fetch the converted amount from your API
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'Accept-Language': navigator.language } // Send the user's language preference
                });

                if (response.ok) {
                    const convertedAmount = await response.json(); // Assuming the response is the converted amount
                    // Update the price element with the converted amount
                    // Format the number to two decimal places and append the currency symbol if needed
                    element.innerText = `${convertedAmount.toFixed(2)} KRW`; // Example: update with converted amount and currency
                }
            } catch (error) {
                console.error('Currency conversion error:', error);
            }
        });
    }

    // Convert prices on page load
    window.addEventListener('DOMContentLoaded', convertPrices);
})();
</script>
