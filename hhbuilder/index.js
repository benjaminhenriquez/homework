// your code goes here ...

onPageLoad();







//functions

//initializes app

function onPageLoad(){

  var household = [];

  // addRequiredProperty();
  addIdsFormInputs();
  addButtonEvent(household);

}

//validations

// function addRequiredProperty(){
//
//   var inputArray = document.querySelectorAll("input");
//   var age = inputArray[0];
//   var relationship = document.querySelector("select")
//
//    age.required = true;
//    relationship.required = true;
// }



//adding Id's for easier access

function addIdsFormInputs(){
  var inputArray = document.querySelectorAll("input");
  var select = document.querySelector("select");

  inputArray[0].id = "age";
  inputArray[1].id = "smoker";
  select.id = "relationship";

}


//Adding household members and clearing form

function addButtonEvent(household){

  var addButton = document.querySelector(".add");

  addButton.addEventListener("click", function(e){

    e.preventDefault();
    validate(household, createHouseholdMember);

  });
}

function validate(household, createEditMemberCallback, index){
  if(createEditMemberCallback === createHouseholdMember){

    var age = document.querySelector("#age").value;
    var relationship = document.querySelector("#relationship").value;

  }
  else if (createEditMemberCallback === editMember){
    var age = document.querySelector("#ageEdit").value;
    var relationship = document.querySelector("#relationshipEdit").value;
  }

  if(age === "" || isNaN(age) === true ||parseInt(age, 10) <= 0){
    alert("Valid Age Required")
  }
  else if(relationship === ""){
    alert("Relationship Required")
  }
  else{
      createEditMemberCallback(household, index)
      clearForm();
      displayHouseholdMembers(household);

  }

}

function createHouseholdMember(household){

  var age = document.querySelector("#age").value;
  var relationship = document.querySelector("#relationship").value;
  var smoker = document.querySelector("#smoker").checked ? "Yes" : "No";

  var obj = {};
      obj.age = age;
      obj.relationship = relationship;
      obj.smoker = smoker;

  household.push(obj);

}

function clearForm(){
  document.querySelector("#age").value = "";
  document.querySelector("#relationship").value = "";
  document.querySelector("#smoker").checked = false;
}


//displaying household members added in DOM

function displayHouseholdMembers(household){

  var memberInfo = document.querySelector(".household");
  memberInfo.innerHTMl = "";
  var innerHTML = ""

  household.forEach(function(member, index){

     innerHTML += ("<li id ="+ index +"> Relationship: "+ member.relationship
                    + " Age: " + member.age + " Smoker: " + member.smoker +
                  "<button class='delete'>Delete</button>\
                  <button class='edit'>Edit</button></li>");

  });

  memberInfo.innerHTML = innerHTML;
  addEditDeleteEvents(household);

}


//delete and edit houshold memberInfo

function addEditDeleteEvents(household){

  var householdMemberDelete = document.querySelectorAll(".delete");
  var householdMemberEdit = document.querySelectorAll(".edit");

  householdMemberDelete.forEach(function(button, index){

    button.addEventListener("click", function(e){

      e.preventDefault();
      household.splice(index,1);
      displayHouseholdMembers(household);

    })

  })

  householdMemberEdit.forEach(function(button, index){

    button.addEventListener("click", function(e){

      e.preventDefault();

      var member = household[index]
      var li = document.querySelectorAll("li")[index]
      li.innerHTML = editForm( member.age, member.smoker);
      var relationshipOptions = li.querySelectorAll("option");
      relationshipOptions.forEach(function(option){
        if(option.value === member.relationship){
          option.selected = true;
        }
      })

      li.querySelector("form").addEventListener("submit",function(e){
        e.preventDefault();
        validate(household, editMember, index)
      })
    })

  })

}

function editMember(household, index){

  var member = household[index];

  member.age = document.querySelector("#ageEdit").value
  member.relationship = document.querySelector("#relationshipEdit").value
  member.smoker = document.querySelector("#smokerEdit").checked ? "Yes":"No"
}

function editForm(age, smoker){

  var smoker = "Yes"? true: false;

  var form = "<form>\
                <label>Relationship\
                  <select id='relationshipEdit' name='rel'>\
                    <option value=''>---</option>\
                    <option value='self'>Self</option>\
                    <option value='spouse'>Spouse</option>\
                    <option value='child'>Child</option>\
                    <option value='parent'>Parent</option>\
                    <option value='grandparent'>Grandparent</option>\
                    <option value='other'>Other</option>\
                  </select>\
                </label>\
                <label>Age\
                  <input id='ageEdit' type='text' name='age' value =" + age +">\
                </label>\
                <label>Smoker?\
                  <input id='smokerEdit' type='checkbox' name='smoker' checked=" + smoker +">\
                </label>\
                  <button type='submit'>submit</button>\
              </form>"

  return form
}

// submit

// functiion submit()
