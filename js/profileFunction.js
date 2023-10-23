const formElements = document.querySelectorAll(".form-profile");
const dropdownElement = document.getElementById("dropdownProfile");
const edit_profile = document.getElementById("edit-profile");
const logout = document.getElementById("logout");
const edit = document.getElementById("edit");
const cancel = document.getElementById("cancel");
const delete_account = document.getElementById("delete-account");
const thumbnail_name = document.getElementById("thumbnail-name");
const thumbnail_name_clicked = document.getElementById("thumbnail-name-clicked");
const nameForm = document.getElementById("name");
const emailForm = document.getElementById("email");
const passwordForm = document.getElementById("password");
let userID = localStorage.getItem('userId');
let data;

if (userID == '') {
    window.location.href = 'landingPage.html';
}

// ====================== FETCHING LOUNGE ======================

async function getOneUser(){
    try{
        const response = await fetch('http://127.0.0.1:8000/v1/api/user/'+userID);
        data = await response.json();
        data = data.record;
        changeProfile();
    } catch (err) {
        console.log("fetching error", err)
        wind
    }
}

async function putOneUser(){
    try{
        const formData = new FormData();
        formData.append('name', nameForm.value);
        formData.append('email', emailForm.value);
        formData.append('password', passwordForm.value);

        const response = await fetch('http://127.0.0.1:8000/v1/api/user/update/'+userID, {
            method: 'PUT',
            body: formData
        });
        data = await response.json();
        data = data.record.$set;
        changeProfile();
    } catch (err) {
        console.log("fetching error", err)
    }
}

async function deleteOneUser(){
    try{
        const response = await fetch('http://127.0.0.1:8000/v1/api/user/'+userID, {method: 'DELETE'});
        data = await response.json();
        localStorage.setItem('userId', '');
        window.location.href = 'landingPage.html';
    } catch (err) {
        console.log("fetching error", err ,data)
    }
}

getOneUser();

// ================================================================



edit_profile.addEventListener('click', toogleEdit);

edit.addEventListener('click', function(){
    putOneUser();
    toogleEdit();
});

cancel.addEventListener('click', function(){
    changeProfile();
    toogleEdit();
});

logout.addEventListener('click', function(){
    localStorage.setItem('userId', "");
});

delete_account.addEventListener('click', function(){
    deleteOneUser();
})

dropdownElement.addEventListener('hidden.bs.dropdown', () => {
    edit_profile.classList.remove("hidden");
    logout.classList.remove("hidden")
    edit.classList.add("hidden")
    cancel.classList.add("hidden")
    thumbnail_name.classList.toggle("hidden");
    thumbnail_name_clicked.classList.toggle("hidden");

    formElements.forEach(form => {
        form.disabled = true;
    });

    changeProfile();
});

dropdownElement.addEventListener('shown.bs.dropdown', () => {
    thumbnail_name.classList.toggle("hidden");
    thumbnail_name_clicked.classList.toggle("hidden");
});

function changeProfile(){
    nameForm.value = data.name;
    emailForm.value = data.email;
    passwordForm.value = data.password;
    thumbnail_name.innerHTML = data.name;
}

function toogleEdit(){
    edit_profile.classList.toggle("hidden");
    logout.classList.toggle("hidden")
    edit.classList.toggle("hidden")
    cancel.classList.toggle("hidden")

    formElements.forEach(form => {
        form.disabled = !form.disabled;
    });
}



