//initializes app

(function () {//Anonymous function is executed when script tag is loaded.

  var household = []; //Holds members as they are created.

  function Member(age, relationship, smoker){ //Function creates new member objects.
    this.age = age;
    this.relationship = relationship;
    this.smoker = smoker;
  };

  function createHouseholdMember() { //Finds member retrieves member info from Dom form when submitted and calls Member function.
    var age = document.getElementsByName("age")[0].value;
    var relationship = document.getElementsByName("rel")[0].value;
    var smoker = document.getElementsByName("smoker")[0].checked ? "Yes" : "No";

    var obj = new Member(age, relationship, smoker);

    household.push(obj); //New member objects are pushed to household array.
  };

  function validate(createEditMemberCallback, index) { //Validates age and relationship.
    var age = "";
    var relationship = "";
    //Function takes a callback function as a parameter that either creates a brand new member or edits existing member.
    if ( createEditMemberCallback === createHouseholdMember ) {
      age = document.getElementsByName("age")[0].value;
      relationship = document.getElementsByName("rel")[0].value;
    } else if ( createEditMemberCallback === editMember ) {
      age = document.getElementById("ageEdit").value;
      relationship = document.getElementById("relationshipEdit").value;
    }

    if ( age === "" || isNaN(age) === true || parseInt(age, 10) <= 0 ) {
      alert("Valid Age Required");
    } else if ( relationship === "" ) {
      alert("Relationship Required");
    } else {
      createEditMemberCallback(index); //Callback is called and member is either created or edited after validation.
      clearForm();
      displayHouseholdMembers(); //Dom is re-rendered with updated household members.
    }
  };


  function clearForm() { //Clears form.
    document.getElementsByName("age")[0].value = "";
    document.getElementsByName("rel")[0].value = "";
    document.getElementsByName("smoker")[0].checked = false;
  };

  function displayHouseholdMembers() { //Function displays all household members as list appended to class "household".
    var htmlFragment = document.createDocumentFragment();
    //Fragment is created to avoid appending to dom multiple times. Instead list will be appended to fragment.

    household.forEach( function (member, index){
      //Each object's information is appended to list along with edit and delete buttons.

      var memberInfo =  "Relationship: "+ member.relationship + "    |    "   +
                          " Age: " + member.age + "    |    " +
                          " Smoker: " + member.smoker + "      ";
      var li = document.createElement("li");
      li.id = index;

      var div = document.createElement("div");
      div.style.textTransform = "capitalize";

      var deleteButton = document.createElement("button"); //Delete button created
      deleteButton.className = "delete";
      deleteButton.innerHTML = "Delete";

      var editButton = document.createElement("button"); //Edit button created.
      editButton.className = "edit";
      editButton.innerHTML = "Edit";

      div.append(memberInfo, deleteButton, editButton);
      li.append(div);
      htmlFragment.append(li); //Each li element once created is appended to fragment.
    });

    var display = document.querySelector(".household");
    display.innerHTML = "";
    display.append(htmlFragment); //Once all elements are appended to fragment, fragement is appended to DOM.
    addEditDeleteEvents(); //Function is called to give each button an event for deletion and editing.
  };


  function addEditDeleteEvents() { //Events are added to delete and edit houshold member info.
    document.querySelectorAll(".delete").forEach( function (button, index){
      button.addEventListener("click", function(e){
        deleteMember(e, index);
      });
    });

    document.querySelectorAll(".edit").forEach(function(button, index) {
      button.addEventListener("click", function(e){
        renderEditForm(e, index);  //Function changes li into form for editing.
      });
    });
  };

  function deleteMember(e, index) { //Deletes Member
    e.preventDefault();
    household.splice(index, 1);
    displayHouseholdMembers();
  };

  function renderEditForm(e, index) { //Renders an edit form.
    e.preventDefault();
    var member = household[index];
    var listOfHouseholdMembersDisplayed = document.querySelectorAll("li");
    var div = listOfHouseholdMembersDisplayed[index].querySelector("div");
    var form = createEditForm( member.age, member.smoker, member.relationship); // Calls function that creates a form and populates form with existing info.
    listOfHouseholdMembersDisplayed[index].replaceChild(form, div); //replaces <p> tag with new form at specific index.

    document.getElementById("editForm").addEventListener("submit", function (event) {
      event.preventDefault();
      validate(editMember, index);
    });

  };

  function createEditForm(memberAge, memberSmoker, memberRelationship) { //Creates a form by cloning parts of original form.
    var documentFragment = document.createDocumentFragment(); //creates a temporary fragment;
    var memberSmokerTF = memberSmoker === "Yes"? true: false;
    var form = document.createElement("form");
    form.id = "editForm";

    var relationship = document.getElementsByName("rel")[0].cloneNode(true);
    relationship.id = "relationshipEdit";

    var relationshipOptions = relationship.querySelectorAll("option");
    relationshipOptions.forEach(function(option){

      if ( option.value === memberRelationship ) {
        option.selected = true;
      }
    });

    var age = document.getElementsByName("age")[0].cloneNode(true);
    age.id = "ageEdit";
    age.value = memberAge;

    var smoker = document.getElementsByName("smoker")[0].cloneNode(true);
    smoker.id = "smokerEdit";
    smoker.checked = memberSmokerTF;

    var button = document.createElement("button");
    button.type = "Submit";
    button.innerHTML = "Submit";

    var labelRelationship = document.createElement("label");
    labelRelationship.append("Relationship", relationship);

    var labelAge = document.createElement("label");
    labelAge.append("Age", age);

    var labelSmoker = document.createElement("label");
    labelSmoker.append("Smoker", smoker);

    form.append(labelRelationship, labelAge, labelSmoker, button);
    documentFragment.append(form);

    return documentFragment; //Returns a fragment with form that will later be appended to household list at specific index and replace p tag.
  };

  function editMember(index) { //Edits member after member is validated.
    var member = household[index];
    member.age = document.getElementById("ageEdit").value;
    member.relationship = document.getElementById("relationshipEdit").value;
    member.smoker = document.getElementById("smokerEdit").checked ? "Yes" : "No";
  };


  function serialize(household){ // Upon submission function serializes info from household array, displays and sends to fake server.
    var json = JSON.stringify(household);
    var debug = document.querySelector(".debug");

    debug.innerHTML = json;
    debug.style.display = 'block';

    sendJson(json); //Calls function to send Json to fake server.
  };

function sendJson(json){ //Executes fake request sent.
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "http://fakeserver.com");
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(json);
};


//Adds event listener to add button in order to add household members to form.
  document.querySelector(".add").addEventListener("click", function(e){
    e.preventDefault();
    validate(createHouseholdMember);
  });

  //Adds event listener to submit form.

  document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();
    serialize(household);
  });

})();
