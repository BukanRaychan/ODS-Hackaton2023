const login = document.getElementById('login-form');
const error_message_login = document.getElementById('error-message-login');
const input_form_login = document.querySelectorAll('#login .form-control');

login.addEventListener("submit", async(event) => {
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
        const formData = new FormData();
        formData.append('email', form.elements.loginEmail.value);
        formData.append('password', form.elements.loginPassword.value);

        try {
            const response = await fetch('http://127.0.0.1:8000/v1/api/user/login', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if(data.status != 200){
                deployErrorMessageLogin(data.message+".");
            } else {
                localStorage.setItem("userId", data.user_id);
                window.location.href = 'homePage.html';
            }
        } catch (error) {
            deployErrorMessageLogin("Error fetching API.");
        }
    } else {
        deployErrorMessageLogin("Please fill out all required fields.");
        input_form_login.forEach(element => {
            if(element.value.trim() === ''){
                element.style.borderBottom = "1.5px solid var(--color-error-message)";
            }
            setTimeout(() => {
                element.style.borderBottom = "1.5px solid #ccc"
            },1500)
        });
        
    } 
})

function deployErrorMessageLogin(message){
    error_message_login.innerHTML = message;
    error_message_login.classList.remove('hidden');
    error_message_login.classList.add('pulse-animation');
    error_message_login.addEventListener('animationend', () => {
        error_message_login.classList.remove('pulse-animation');
    });
}