const dropArea = document.querySelector('.drop-area');
const defaultView = document.getElementById("default");
const hoverView = document.getElementById("hover");
const uploadedView = document.getElementById("uploaded");
const createNewNoteView = document.getElementById("create-new-note");
const databasePartitionOptionView = document.getElementById("database-partition-option");
const button = document.querySelector('.button');
const input = document.getElementById('browse-input');
const file_format_selector = document.getElementById('file-format-selector');
const file_format_text = document.getElementById('file-format-text');
const file_name = document.getElementById('file-name');
const upload_file_button = document.getElementById('upload-file-button');
const partitionOption = document.querySelectorAll('.partition');
const databaseOption = document.querySelectorAll('.database');
const status_upload = document.querySelector('#uploaded h1');
const create_note_button = document.getElementById('create-note-button');
const cancel_new_note = document.getElementById('cancel-new-note');
const send_new_note = document.getElementById('send-new-note');
const new_date_text = document.getElementById('new-date-text');
const new_note_text = document.getElementById('new-note-text');

let file;
let partition_database_option = [];
let note;


// ======================================== EVENT LISTENER ============================================================

//when file is inside the drop area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    console.log("inside");

    hoverView.style.display = "block ";
    defaultView.style.display = "none";
    dropArea.classList.add('active');
});

//when file outside the drop area
dropArea.addEventListener('dragleave', () => {
    console.log("outside");
    dropArea.classList.remove('active');
    defaultView.style.display = "block";
    hoverView.style.display = "none";
});

//when file is dropped in the drag area
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');
    file = event.dataTransfer.files[0]
    selectPartionDatabase();
});

//input will get clicked if button get clicked
button.onclick = () => {
    input.click();
};

//Action if input got clicked
input.addEventListener('change', function() {
    file = this.files[0]
    selectPartionDatabase();
});

//When user select the file format, automactly the desciprtion and Attribute accept is changed
file_format_selector.addEventListener('change', function() {
    file_format_text.textContent = file_format_selector.value;
    input.setAttribute('accept', file_format_selector.value);
});

//Add event listenere to all partition option
partitionOption.forEach(partition => {
    partition.addEventListener('click', () => {
        if (!partition.classList.contains('clicked')) {
            partitionOption.forEach(activePartition => {
                if (activePartition !== partition) {
                    activePartition.classList.remove('clicked');
                }
            });
        }

        partition.classList.toggle('clicked');
        toogleActive();
    });
});

//Add event listenere to all database option
databaseOption.forEach(database => {
    database.addEventListener('click', () => {
        database.classList.toggle('clicked');
        toogleActive();
    });
});

create_note_button.addEventListener('click', () => {
    defaultView.style.display = 'none';
    createNewNoteView.style.display = 'block';
});

cancel_new_note.addEventListener('click', () => {
    createNewNoteView.style.display = 'none';
    defaultView.style.display = 'block';
    new_note_text.value = '';
})

send_new_note.addEventListener('click',() => {
    note = JSON.stringify({
        "input_text" :`${new_date_text.value}\n${new_note_text.value}`
    })
    uploadingNote();
});

// ======================================== FUNCTIONS ========================================

function selectPartionDatabase(){
    upload_file_button.classList.remove('active');
    document.querySelectorAll('.database-partition-button.clicked').forEach(element => {
        element.classList.remove('clicked');
    });

    databasePartitionOptionView.style.display = "block";
    defaultView.style.display = "none";
    hoverView.style.display = "none";
    file_name.textContent = file.name;
}

function toogleActive(){
    if(document.querySelectorAll('.database.clicked').length >= 2 && document.querySelectorAll('.partition.clicked').length > 0){
        upload_file_button.classList.add('active');
        upload_file_button.addEventListener('click',uploadingFile)
    } else {
        upload_file_button.classList.remove('active');
    }
}

//Fetch And uploading data
async function uploadingFile(){
    partition_database_option = Array.from(document.querySelectorAll(".database-partition-button.clicked")).map(content => content.textContent);

    const formData = new FormData();
    formData.append('partitionType', partition_database_option.slice(-1)[0]);
    formData.append('shardingKey', "age");
    partition_database_option.slice(0,-1).forEach(element => {
        formData.append('database', element)
    })
    formData.append('data', file, file.name);

    try {
        const response = await fetch('http://127.0.0.1:8000/v1/api/transaction',{
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if(data.status == 200){
            status_upload.textContent = 'File Uploaded';
        } else {
            status_upload.textContent = `File Failed To Upload : Response ${data.status}`;
        } 
    } catch (err) {
        status_upload.textContent = 'File Failed To Upload : Fetch Process';
    }

    partition_database_option = [];
    input.value = '';

    databasePartitionOptionView.style.display = "none";
    uploadedView.style.display = "block";

    setTimeout(() => {
        uploadedView.style.display = "none";
        defaultView.style.display = "block";
        console.clear();
    },2000)
};

async function uploadingNote(){
    const formData = new FormData();
    formData.append("input_text", note);
    console.log(note);

    try {
        const response = await fetch('http://127.0.0.1:8000/v1/api/gen-notes/create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: note
        });
        const data = await response.json();
        if(data.status == 200){
            status_upload.textContent = data.message;
        } else {
            console.log(data);
            status_upload.textContent = `Note Failed To Upload : Response ${data.status}`;
        } 
    } catch (err) {
        status_upload.textContent = 'Note Failed To Upload : Fetch Process';
    }

    createNewNoteView.style.display = "none";
    uploadedView.style.display = "block";

    setTimeout(() => {
        uploadedView.style.display = "none";
        defaultView.style.display = "block";
    },2000)

    note = '';
    new_note_text.value = '';
    new_date_text.value = '';
}