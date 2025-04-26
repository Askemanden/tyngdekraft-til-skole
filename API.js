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
    values = data["bodies"][0];
    new body(values.englishName,x,y,z,data.meanRadius/1000,data.density*10e12);
}

function fetchData(planetName,x,y,z){
    loadJSON(apiAddress + planetName, data =>{
        processData(x,y,z,data);
    });
}