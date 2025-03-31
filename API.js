const apiAddress = "https://api.le-systeme-solaire.net/rest/bodies?data=englishName,meanRadius,density&filter[]=density,neq,0&filter[]=meanRadius,neq,0&filter[]=englishName,eq,";

function checkData(data){
    if(data["bodies"].length == 0){
        return false;
    }
    return true;
}

function processData(x,y,z,data){
    if(!checkData(data)){
        return
    }
    console.log(data);
    data = data["bodies"][0];
    console.log(data);
    new body(x,y,z,data.meanRadius*1000,data.density*1000);
}

function fetchData(planetName,x,y,z){
    console.log(apiAddress + planetName);
    loadJSON(apiAddress + planetName, data =>{
        processData(x,y,z,data);
    });
}