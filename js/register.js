const createAccount = document.getElementById('create-account-form');
const error_meesage_register = document.getElementById('error-message-register');
const input_form_register = document.querySelectorAll('#create-account .form-control');

createAccount.addEventListener("submit", async(event) => {
    event.preventDefault();

    const form = event.target;
    let allFieldsFilled = true;

    for (const element of form.elements) {
        if (element.tagName === 'INPUT') {
            if (element.value.trim() === '') {
                allFieldsFilled = false;
            }
        } 
    }

    if(allFieldsFilled){
        if(form.elements.registeredPassword.value === form.elements.registeredReTypePassword.value){
            const formData = new FormData();
            formData.append('name', form.elements.registeredName.value);
            formData.append('email', form.elements.registeredEmail.value);
            formData.append('password', form.elements.registeredPassword.value);

            try {
                const response = await fetch('http://127.0.0.1:8000/v1/api/user/register', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();

                if(data.status != 200){
                    deployErrorMessageRegister(data.message);
                } else {
                    localStorage.setItem("userId", data.record.userID);
                    window.location.href = 'homePage.html';
                }
            } catch (error) {
                console.error("Error fetching API.");
            }
        } else {
            deployErrorMessageRegister("Mismatch password.");
            [...input_form_register].slice(2,-1).forEach(element => {
                if(element.value.trim() === ''){
                    element.style.borderBottom = "1.5px solid var(--color-error-message)";
                }
                setTimeout(() => {
                    element.style.borderBottom = "1.5px solid #ccc";
                },1500)
            });
        }
    } else {
        deployErrorMessageRegister("Please fill out all required fields.");
        input_form_register.forEach(element => {
            if(element.value.trim() === ''){
                element.style.borderBottom = "1.5px solid var(--color-error-message)";
            }
            setTimeout(() => {
                element.style.borderBottom = "1.5px solid #ccc"
            },1500)
        });


    }
})

function deployErrorMessageRegister(message){
    error_meesage_register.innerHTML = message;
    error_meesage_register.classList.remove('hidden');
    error_meesage_register.classList.add('pulse-animation');
    error_meesage_register.addEventListener('animationend', () => {
        error_meesage_register.classList.remove('pulse-animation');
    });
}


