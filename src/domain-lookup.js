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
    console.log(query);
    const domainLookupEndpoint = `http://ip-api.com/json/${query}?fields=255963`;
    try {
        const response = await fetch(domainLookupEndpoint);
        // Check response status and throw error if the res wasn't ok
        if (!response.ok) {
            const errorText = `Bad response. Status code: ${response.status}`;
            showErrorOnDisplay(errorText);
            throw new Error(errorText);
        }

        const data = await response.json();
        // This checks if the parsed data was vaild, for example the domain exists or not
        if (data.status === 'success') {
            // When the page starts, show user ip
            if (query === '') {
                userIdDisplay.innerText = data.query;
            } 

            console.log(data);
            displayDomainInfo(data);
        } else {
            console.log(`There was a problem with parsing the response: ${data.message}`)
            showErrorOnDisplay(`Invalid query, are you sure '${data.query}' actually exists?`);
        }
    } 
    catch (error) {
        const errorText = `Error caught when trying to fetch data: ${error}`;
        console.log(errorText);
        showErrorOnDisplay(errorText);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded',() => fetchDomainInfo());
domainForm.addEventListener('submit', (e) => { e.preventDefault(); fetchDomainInfo(domainForm.elements.query.value) });