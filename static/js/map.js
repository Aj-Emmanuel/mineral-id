fetch("/api/states")
.then(res=>res.json())
.then(states=>{

window.stateData = states;

});