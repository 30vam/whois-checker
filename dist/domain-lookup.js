// HTML Elements
const userIdDisplay = document.querySelector('#user-id-display');
const domainInfoWrapper = document.querySelector('#domain-info-wrapper');
const domainForm = document.querySelector('#domain-form');

// Functions
const clearDomainInfoDisplay = () => {
    while (domainInfoWrapper.lastElementChild) {
        domainInfoWrapper.removeChild(domainInfoWrapper.lastElementChild);
    }
}

const showErrorOnDisplay = (errorText) => {
    clearDomainInfoDisplay();
    
    const errorDiv = document.createElement('div');
    errorDiv.innerText = errorText;
    domainInfoWrapper.append(errorDiv);
}

const deleteUselessKeys = (domainData) => {
    const keysToDelete = [
        'zipCode', 
        'accuracyRadius', 
        'flag', 
        'countryGeoNameId', 
        'network', 
        'countryNativeName', 
        'stateGeoNameId', 
        'continentCode', 
        'currencyNamePlural', 
        'cityGeoNameId', 
        'numOfCities', 
        'currencySymbol', 
        'isEU', 
        'countryTLD', 
        'metroCode', 
        'continentGeoNameId', 
        'stateCode', 
        'countryISO2', 
        'numOfStates', 
        'countryISO3', 
        'currencyCode', 
        'currencySymbolNative',
        'asNo', 
        'status'
    ];
    
    keysToDelete.forEach(key => { delete domainData[key]; });  // Remove the unnecessary info from data
    return domainData;
}

const displayDomainInfo = (domainData) => {
    clearDomainInfoDisplay();
    domainData = deleteUselessKeys(domainData);

    for (const key in domainData) {
        const newInfoDiv = document.createElement('div');
        const infoTitleSpan = document.createElement('div');
        const infoText = document.createElement('div');
        newInfoDiv.classList.add('w-[95%]', 'bg-red-300', 'bg-opacity-10', 'backdrop-blur-sm', 'rounded-xl', 'p-2');
        infoTitleSpan.classList.add('font-semibold', 'text-2xl');
        
        let infoTitle = key.replace(/([a-z])([A-Z])/g, '$1 $2'); // Make info names appear not in camelCase
        infoTitle = infoTitle.charAt(0).toUpperCase() + infoTitle.slice(1)  // Capitalize the first words 1st letter too
        
        // Add the texts to divs and divs to their wrappers
        infoTitleSpan.innerText = `${infoTitle}:`;
        infoText.innerText = domainData[key];
        newInfoDiv.append(infoTitleSpan, infoText);
        domainInfoWrapper.append(newInfoDiv);
    }
}

// Request-Related Async Functions
const fetchDomainInfo = async (query = '', event = null) => { 
    let domainLookupEndpoint;

    // Different API endpoints for domains and client ip/info
    if (!query) {
        domainLookupEndpoint = `https://app.ipworld.info/api/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8`;
    } else {
        domainLookupEndpoint = `https://app.ipworld.info/api/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8&ip=${query}`;
    }

    try {
        const response = await fetch(domainLookupEndpoint);  // Try to get a response from API

        // Check if response is OK before trying to parse its JSON
        if (!response.ok) {
            const errorData = await response.json(); // Parse error message if response is not okay
            const errorText = `Status code: ${errorData.status}\nError message: ${errorData.Message || 'No additional error information.'}`;
            showErrorOnDisplay(errorText);
            throw new Error(errorText);
        }

        // If the response was ok, we can safely parse the success response
        const data = await response.json(); 
        
        // Update user IP if query was empty
        if (!query)
            userIdDisplay.innerText = data.ip;

        displayDomainInfo(data);  // Display all domain/user info in a readable manner

    } catch (error) {
        // This will catch any errors thrown during the fetch or when processing the response.
        console.error('An error occurred:', error);
        showErrorOnDisplay(`${error.message}.`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded',() => fetchDomainInfo());
domainForm.addEventListener('submit', (e) => { e.preventDefault(); fetchDomainInfo(domainForm.elements.query.value) });