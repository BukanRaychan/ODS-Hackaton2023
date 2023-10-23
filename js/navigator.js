const uploadNav = document.querySelector('.upload');
const transactionNav = document.querySelector(".transaction");
const getNav = document.querySelector(".get");
const queryNav = document.querySelector(".query");
const odsNav = document.querySelector(".ods");
const get_started_button = document.querySelector("#ods-view button");

let currentNav;

get_started_button.addEventListener("click", () => {
    uploadNav.dispatchEvent(new Event('click'));
})

landing(document.querySelector(`.${localStorage.getItem('currentNav')}`));

function landing(landingNav){
    currentNav = landingNav;
    currentNav.classList.toggle("disable");
    document.getElementById(currentNav.getAttribute('id')+"-view").classList.toggle("hidden");
}

uploadNav.addEventListener("click", function(){
    switchPage(uploadNav)
})

getNav.addEventListener("click", function(){
    switchPage(getNav)
})

transactionNav.addEventListener("click", function(){
    switchPage(transactionNav)
})

odsNav.addEventListener("click", function(){
    switchPage(odsNav)
})

queryNav.addEventListener("click", function(){
    switchPage(queryNav)
})

function switchPage(destinationNav){
    currentNav.classList.toggle("disable");
    destinationNav.classList.toggle("disable");
    document.getElementById(currentNav.getAttribute('id')+"-view").classList.toggle("hidden");
    document.getElementById(destinationNav.getAttribute('id')+"-view").classList.toggle("hidden");

    currentNav = destinationNav;
    
    localStorage.setItem("currentNav", destinationNav.id);
}