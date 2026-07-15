const input =
document.getElementById(
"imageInput"
);

const preview =
document.getElementById(
"preview"
);

input.addEventListener(
"change",
function(){

const file = this.files[0];

preview.src =
URL.createObjectURL(file);

preview.style.display =
"block";

});

async function predictMineral(){

const file =
input.files[0];

if(!file){

alert(
"Choose image first"
);

return;
}

const formData =
new FormData();

formData.append(
"image",
file
);

const response =
await fetch(
"/predict",
{
method:"POST",
body:formData
}
);

const data =
await response.json();

document
.getElementById("result")
.innerHTML = `

<h2>${data.prediction}</h2>

<p>
Confidence:
${data.confidence}%
</p>

`;
}