const apiAddress = "https://api.le-systeme-solaire.net/rest/bodies?data=englishName,meanRadius,density&filter[]=density,neq,0&filter[]=meanRadius,neq,0&filter[]=englishName,eq,";

function checkData(data){
    if(data["bodies"].length == 0){
        return false;
    }
    return true;
}

function processData(x,y,z,data, vx, vy, vz){
    if(!checkData(data)){
        return
    }
    values = data["bodies"][0];
    new body("body" + values.englishName,x,y,z,values.meanRadius/1000,values.density*10e12, vx, vy, vz);
}

function fetchData(planetName,x,y,z, vx, vy, vz){
    loadJSON(apiAddress + planetName, data =>{
        processData(x,y,z,data,vx, vy, vz);
    });
}