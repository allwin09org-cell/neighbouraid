function login(){

window.location="dashboard.html"

}

function addQuestion(){

let q=document.getElementById("question").value

let list=document.getElementById("questions")

let div=document.createElement("div")

div.innerText=q

list.appendChild(div)

}