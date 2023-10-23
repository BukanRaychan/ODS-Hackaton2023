const dataContainer = document.getElementById('data-container');
const fetchTriggerGet = document.querySelector('.get');

async function getAllTransactions() {
    try {
        const response = await fetch('http://127.0.0.1:8000/v1/api/transaction');
        const transactions = await response.json();
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
};

async function getOneTransactions(transactionID) {
    try {
        const response = await fetch('http://127.0.0.1:8000/v1/api/transaction/'+transactionID);
        const transaction = await response.json();
        return transaction;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
};

let listFile = [];
let listTexts = [];

async function loadData() {
    try {
        const file = await getAllTransactions();
        listTexts = file.records.map(file => file.data.fileName);
        listFile = file.records.map(file => file.transactionID);
        createRepetitiveElements(listTexts);
    } catch (error) {
        dataContainer.innerHTML = '<h2 class="position-absolute pop-up" style="color: #3E3D43; top : 50%; left: 50%; transform: translate(-50%, -50%); font-weight: normal;">Data empty</h2>'
    }
}


loadData();
// Call the function to load data initially
fetchTriggerGet.addEventListener('click', () => {
    loadData();
})

// Function to handle search and update the elements based on the search query
function handleSearch() {
    const searchText = document.querySelector('.grip').value.toLowerCase().trim();

    // Filter the listTexts based on the search query
    const filteredTexts = listTexts.filter(text => text.toLowerCase().includes(searchText));

    // Update the displayed elements with the filtered texts
    createRepetitiveElements(filteredTexts);
}

// Function to create repetitive elements
function createRepetitiveElements(listTexts) {
    let element;

    // Check if the list is emptydata
    if (listTexts.length === 0) {
        element = `
        <h2 class="position-absolute pop-up" style="color: var(--neutral-color-2); top : 50%; left: 50%; transform: translate(-50%, -50%); font-weight: normal;">
            Data empty
        </h2>
        `
    } else {
        //Parent div
        element = '<div class="row p-4 row-cols-xxl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 grip-0 row-gap-4">'

        // Loop through the list and create repetitive child elements
        listTexts.forEach((text, index) => {
            if (Array.of(text).length >= 33) {
                text = text.slice(0, 30) + "...";
            };
            element += `
            <div class="col" style="height: 48px;">
                <div class="h-100 d-flex align-items-center px-4 data" onclick="downloadFile('${listFile[index]}')">
                    ${text}
                </div>
            </div>
            `;
        })

        //closing parent div
        element += '</div>'
    }

    dataContainer.innerHTML = element;
}

function downloadFile(file){
    console.log(getOneTransactions(file));
}