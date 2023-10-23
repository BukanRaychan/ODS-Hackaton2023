const search_input = document.getElementById('search-data-query');
const query_result =document.getElementById('query-result');


async function getOneUser(message){
    try{
        let arrayOfLine = [];
        let totDigit = 0;
        let data_split;
        
        const formData = new FormData();
        formData.append('prompt', message);
        const response = await fetch('http://127.0.0.1:8000/v1/api/query', {
            method : "POST",
            body : formData
        });
        const data = await response.json();
        data_split = data.query.response.split('\n');
        console.log(0);
        data_split.forEach((line) => {
            arrayOfLine = Array.from(line)
            arrayOfLine.forEach((char, charIndex) => {
                setTimeout(() => {
                    query_result.innerHTML += char;
                }, (totDigit + charIndex + 1) * 30)
            });
            setTimeout(() => {
                query_result.innerHTML += '<br>';
            }, (totDigit + arrayOfLine.length) * 30)
            totDigit += arrayOfLine.length
        });

    } catch (err) {
        console.log("fetching error", err)
    }
}

search_input.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        getOneUser(search_input.value)
        query_result.innerHTML = "";
    }
});

