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

const displayDomainInfo = (domainData) => {
    clearDomainInfoDisplay();

    /*remember to remove the keys you dont need first*/
    delete domainData['status'];

    for (const key in domainData) {
        const newInfoDiv = document.createElement('div');
        newInfoDiv.innerText = `${key}: ${domainData[key]}`;
        domainInfoWrapper.append(newInfoDiv);
    }
}

// Request-Related Async Functions
const fetchDomainInfo = async (query = '', event = null) => { 
    let domainLookupEndpoint;

    if (!query) {
        domainLookupEndpoint = `https://app.ipworld.info/api/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8`;
    } else {
        domainLookupEndpoint = `https://app.ipworld.info/api/iplocation?apikey=873dbe322aea47f89dcf729dcc8f60e8&ip=${query}`;
    }

    try {
        const response = await fetch(domainLookupEndpoint);

        // Check if response is OK before trying to parse its JSON
        if (!response.ok) {
            const errorData = await response.json(); // Parse error message if response is not okay
            const errorText = `Status code: ${response.status}\nError message: ${errorData.Message || 'No additional error information.'}`;
            showErrorOnDisplay(errorText);
            throw new Error(errorText);
        }

        const data = await response.json(); // Now, we can safely parse the success response
        
        if (!query) {
            userIdDisplay.innerText = data.ip;
        }

        displayDomainInfo(data);

    } catch (error) {
        // This will catch any errors thrown during the fetch or when processing the response.
        console.error('An error occurred:', error);
        showErrorOnDisplay(`${error.message}.`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded',() => fetchDomainInfo());
domainForm.addEventListener('submit', (e) => { e.preventDefault(); fetchDomainInfo(domainForm.elements.query.value) });