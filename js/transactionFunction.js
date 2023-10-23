const fetchTriggerTransaction = document.querySelector('.transaction');
const switch_log = document.querySelector('.container-switch-log');
const switch_log_option = document.querySelectorAll('.container-switch-log > div');
const filesLogView = document.getElementById('files-log');
const notesLogView = document.getElementById('notes-log');


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

async function deleteOneTransaction(transactionId){
  try {
    const response = await fetch('http://127.0.0.1:8000/v1/api/transaction/'+transactionId, {
      method : 'DELETE'
    });
    const data = await response.json();
    const transactionRow = document.querySelector(`[data-transaction-id="${transactionId}"]`).closest('tr');

    if (transactionRow) {
      transactionRow.remove();
      document.querySelectorAll(`.index-data`).forEach((element, index) => {
        element.innerHTML = index + 1;
      })
    }

    return data;
  } catch (error) {
      console.error('Error delete transactions:');
      return null;
  }
}

async function getAllNotes(){
  try {
    const response = await fetch('http://127.0.0.1:8000/v1/api/gen-notes');
    const notes = await response.json();
    return notes;
  } catch (error) {
      console.error('Error fetching transactions:', error);
      return null;
  }
}

async function deleteAllNotes(noteID){
  try {
    const response = await fetch('http://127.0.0.1:8000/v1/api/gen-notes/delete/'+noteID,{
      method : 'DELETE'
    });
    const notes = await response.json();
    return notes;
  } catch (error) {
      console.error('Error fetching transactions:', error);
      return null;
  }
}

function formatDate(inputDate) {
  const dateParts = inputDate.split('/');
  const day = dateParts[1];
  const month = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(dateParts[2], dateParts[0] - 1, dateParts[1]));
  const year = dateParts[2];

  return `${day} ${month} ${year}`;
}


switch_log.addEventListener('click',() => {
  filesLogView.classList.toggle('hidden');
  notesLogView.classList.toggle('hidden');
  switch_log_option.forEach(element => {
    element.classList.toggle('selected');
  })
})

fetchTriggerTransaction.addEventListener('click', () => {
  getAllTransactions()
  .then(transactions =>{
    const transactionTableBody = document.getElementById('transaction-data');

    let element_files = ``;

    transactions.records.forEach((transaction, index) => {
      element_files += `
        <tr>
          <td class = "index-data">${index + 1}</td>
          <td>${transaction.transactionID}</td>
          <td>${transaction.partition_type}</td>
          <td>${transaction.sharding_key}</td>
          <td>${transaction.database}</td>
          <td>${transaction.data.fileName}</td>
          <td><img src="img/trash.png" class="trash-logo" data-transaction-id="${transaction.transactionID}"></td>
        </tr>
      `;
    });
    transactionTableBody.innerHTML = element_files;


    const trashLogos = document.querySelectorAll('.trash-logo');

    trashLogos.forEach((logo) => {
      logo.addEventListener('click', function () {
        const transactionID = this.getAttribute('data-transaction-id');
        deleteOneTransaction(transactionID);
      });
    });
  })
  .catch(err => {
    console.log("Error getting transaction",err);
  })

  getAllNotes()
  .then(notes =>{
    const notesCardBody = document.getElementById('notes-log');
    notesCardBody.innerHTML = '';

    notes.data.forEach(note =>{
      notesCardBody.innerHTML += `
      <div class="note-card-container mb-4">
        <div>
            <p>Description</p>
            <h5>${note.description}</h5>
        </div>
        <div>
            <p>Analysis : from ChatGPT</p>
            <h5>${note.analysis}</h5>   
        </div>
        <div>
            <p>Created Date:</p>
            <h5>${formatDate(note.date)}</h5>  
        </div>
      </div>
      `
    });

  })
  .catch(err => {
    console.log("Error getting transaction",err);
  })
});

fetchTriggerTransaction.dispatchEvent(new Event('click'));

