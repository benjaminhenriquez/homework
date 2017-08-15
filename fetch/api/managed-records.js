import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

function retrieve(options){
  options = options ? options : {}; //If no options object is passed, an empty one is created.
  var page = options.page ? options.page : 1; //If no page number is given, a page number of 1 is given.
  var startIndex = page * 10 - 10;
  var colors = options.colors ? options.colors : ["red", "brown", "blue", "yellow", "green"]; //If no colors array is given, an array with all colors is given.
  var uriColors = colors.slice(0); //Clone of colors array is created as to not mutate that variable.
  var uri = new URI(window.path).search({limit: 10, offset: startIndex }); //URL is created using URI library which takes an object.

  uri += getColors(uriColors); //Adds colors to end of URL recursively.

  var data = fetch(uri).then(function(response){ //Uses Fetch library to make get request to URL. Resolved promise is stored in data variable.
    if(response.ok) {
      var json = response.json();
      return json;
    }
    throw new Error('Network response was not ok.'); //Error created.
  }).then(function(json){

      return buildObject(json, page, colors); //Manipulates json received and creates a Javascript object to be stored in data variable.

  }).catch(function(error) {
     console.log('There has been a problem with your request: ' + error.message); //Logs error.
  });

  return data; //Returns an Object with transformed data.
};

//Helper Functions. Initially used forEach methods to iterate but changed to recursury functions as to avoid any kind of for loop.

function getColors(colors) { //Adds each color to end of URL
  if(colors.length == 0) {
    return "";
  }
  var next = colors.shift();
  return "&color[]=" + next + getColors(colors);
};

function buildObject(json, page, colors) {//Creates Object and sets initial values.
  var obj = {};
  obj.ids = [  ], obj.open = [  ], obj.closedPrimaryCount = 0;

  if(checkColor(colors) === false){ //If false will return an object with null values
    obj.previousPage = null;
    obj.nextPage = null;

    return obj;
  }
  else{ //If ture will go on and build Object with JSON data.
    obj.previousPage = page - 1 < 1 ? null : page - 1;
    obj.nextPage =  page + 1 > 50 ? null : page + 1;

    buildHelper(json, obj, 0); //Calls function that will recursively go through each object returned from json array and flush out object created in function.
    return obj; //Returns object that will be stored in Data varialbe and returned at end of retrieve function.
  }

};

function checkColor(colorsQueried){ // Compares colors Queried array with array of valid colors one at a time.
  var availableColors = ["red", "brown", "blue", "yellow", "green"];

  if(colorsQueried.length === 0){
    return true;
  }
  else{
    var next = colorsQueried.shift();
    var validColors = availableColors.filter(function(c){
        return next === c;
    });

    if(validColors.length === 0){ //If colorQueried is not found in list of valid colors, function returns false.
      return false;
    }
    else{ //If color is found, it will move to next color in list of colorsQueried until there is no more in list.
      return checkColor(colorsQueried);
    }
  }
};

function buildHelper(json, obj, closed) { //Moves through json and help build the object to be stored in Data.
  if(json.length == 0) {
    return; //No need to return since object is beind called by reference and mutated.
  }

  var x = json.shift();

   //Will go through each(x) of the json objects and make count of closedPrimaryCount, add isPrimary key, and add(or not) to open array. 
  if(x.color === "red" || x.color === "yellow" || x.color === "blue"){//Adds isPrimary key and values.
    x.isPrimary = true;
  }
  else{
    x.isPrimary = false;
  }

  if(x.disposition === 'closed'  && x.isPrimary === true){ //Adds to closedPrimaryCount.
    closed++;
  }
  else if(x.disposition === 'open'){ //If open is true, will push entire object to Open array in object that is to be returned.
    obj.open.push(x);
  }

  obj.ids.push(x.id); //Pushes the id of each object into array in object to be returned.
  obj.closedPrimaryCount = closed;
  buildHelper(json, obj, closed); //Calls itself again if there are still json objects to be manipulated and counted.
};

export default retrieve;
