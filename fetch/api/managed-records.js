import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";



// Your retrieve function plus any additional functions go here ...
function retrieve(options){



  var options = options ? options : {};
  var page = options.page ? options.page : 1;
  var startIndex = page * 10 - 10;
  var colors = options.colors ? options.colors : ["red", "brown", "blue", "yellow", "green"];
  var uri = new URI(window.path).search({limit: 10, offset: startIndex});

  colors.forEach(function(color){
    var string = "&color[]=" + color;
    uri = uri + string
  })




  var data = fetch(uri).then(function(response){

    if(response.ok) {
      var j = response.json();

      return j;
    }
    throw new Error('Network response was not ok.');

  }).then(function(j){


    if(page === 1 && j.length === 0){
        var obj = {}
          obj.ids = [  ], obj.open = [  ], obj.closedPrimaryCount = 0;
          obj.previousPage = null;
          obj.nextPage =  null;

        return obj;

    }

    else{

      var closed = 0;

      var obj = {}
      obj.previousPage = page - 1 < 1 ? null : page - 1;
      obj.nextPage =  page + 1 > 50 ? null : page + 1;
      obj.ids = [  ], obj.open = [  ], obj.closedPrimaryCount = 0;



      j.forEach(function(x){

        if(x.color === "red" || x.color === "yellow" || x.color === "blue"){
          x.isPrimary = true
        }
      else{
        x.isPrimary = false
      }

        if(x.disposition === 'closed'  && x.isPrimary === true){
          closed++;
        }
        else if(x.disposition === 'open'){

          obj.open.push(x);
        }

        obj.ids.push(x.id)
        obj.closedPrimaryCount = closed;


      });


      return obj;

    }





  }).catch(function(error) {

     console.log('There has been a problem with your fetch operation: ' + error.message);

});


return data;


}


export default retrieve;
