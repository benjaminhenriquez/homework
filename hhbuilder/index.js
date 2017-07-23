// your code goes here ...

//functions

//initializes app

(function onPageLoad() {

  var household, age, relationship, smoker;

  household = [];

  // addRequiredProperty();
  addIdsFormInputs();
  addButtonEvent();



//adding Id's for easier access

function addIdsFormInputs() {

  var inputArray, select;

  inputArray = document.querySelectorAll("input");
  select = document.querySelector("select");

  inputArray[0].id = "age";
  inputArray[1].id = "smoker";
  select.id = "relationship";

};


//Adding household members and clearing form

function addButtonEvent() {

  var addButton;

  addButton = document.querySelector(".add");

  addButton.addEventListener("click", function(e){

    e.preventDefault();
    validate(createHouseholdMember);

  });
};

function validate(createEditMemberCallback, index) {


  if ( createEditMemberCallback === createHouseholdMember ) {

    age = document.querySelector("#age").value;
    relationship = document.querySelector("#relationship").value

  } else if ( createEditMemberCallback === editMember ) {

    age = document.querySelector("#ageEdit").value;
    relationship = document.querySelector("#relationshipEdit").value;

  };

  if ( age === "" || isNaN(age) === true || parseInt(age, 10) <= 0 ) {

    alert("Valid Age Required");

  } else if ( relationship === "" ) {

    alert("Relationship Required");

  } else {

    createEditMemberCallback(index);
    clearForm();
    displayHouseholdMembers();

  };

};

function createHouseholdMember() {

  var obj;

  age = document.querySelector("#age").value;
  relationship = document.querySelector("#relationship").value;
  smoker = document.querySelector("#smoker").checked ? "Yes" : "No";

  obj = {};
  obj.age = age;
  obj.relationship = relationship;
  obj.smoker = smoker;



  household.push(obj);

};

function clearForm() {

  document.querySelector("#age").value = "";
  document.querySelector("#relationship").value = "";
  document.querySelector("#smoker").checked = false;

};


function displayHouseholdMembers() {

  var display, htmlFragment, memberInfo, li, div, deleteButton, editButton;

  display = document.querySelector(".household");
  display.innerHTML = "";
  htmlFragment = document.createDocumentFragment();

  household.forEach( function (member, index){

    memberInfo =  "Relationship: "+ member.relationship + "  |  "   +
                        " Age: " + member.age + "  |  " +
                        " Smoker: " + member.smoker + "    "
    li = document.createElement("li");
    li.id = index;

    div = document.createElement("div");


    //use css to capitalize the first word

    deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.innerHTML = "Delete"

    editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = "Edit"

    div.append(memberInfo);
    div.append(deleteButton);
    div.append(editButton);
    li.append(div);

    htmlFragment.append(li);

  });

  display.append(htmlFragment);
  addEditDeleteEvents();

};

//delete and edit houshold memberInfo

function addEditDeleteEvents() {

  var householdMemberDelete, householdMemberEdit;

  householdMemberDelete = document.querySelectorAll(".delete");
  householdMemberEdit = document.querySelectorAll(".edit");


  householdMemberDelete.forEach( function (button, index){

    button.addEventListener("click", function(e){
      deleteMember(e, index);
    });

  });

  householdMemberEdit.forEach(function(button, index) {

    button.addEventListener("click", function(e){
      renderEditForm(e, index);
    });

  });

};

function deleteMember(e, index) {

  e.preventDefault();
  household.splice(index, 1);
  displayHouseholdMembers();

};

function renderEditForm(e, index) {

  e.preventDefault();

  var member, listOfHouseholdMembersDisplayed, relationshipOptions, div, form;

  member = household[index];
  listOfHouseholdMembersDisplayed = document.querySelectorAll("li")
  div = listOfHouseholdMembersDisplayed[index].querySelector("div")
  form = createEditForm( member.age, member.smoker, member.relationship);
  listOfHouseholdMembersDisplayed[index].replaceChild(form, div);

debugger
  listOfHouseholdMembersDisplayed[index].querySelector("form").addEventListener("submit", function (e) {
    debugger
    e.preventDefault();
    validate(editMember, index)
  });

}

function createEditForm(memberAge, memberSmoker, memberRelationship) {

  var documentFragment, form, relationshipOptions, button, labelRelationship,
      labelAge, labelSmoker, labelButton;

  documentFragment = document.createDocumentFragment()
  memberSmoker = memberSmoker === "Yes"? true: false;
  form = document.createElement("form");

  relationship = document.querySelector("#relationship").cloneNode(true);
  relationship.id = "relationshipEdit";

  relationshipOptions = relationship.querySelectorAll("option");
  relationshipOptions.forEach(function(option){

    if ( option.value === memberRelationship ) {
      option.selected = true;
    }

  });

  age = document.querySelector("#age").cloneNode(true);
  age.id = "ageEdit";
  age.value = memberAge

  smoker = document.querySelector("#smoker").cloneNode(true);
  smoker.id = "idEdit";
  smoker.checked = memberSmoker;

  button = document.createElement("button");
  button.type = "Submit";
  button.innerHTML = "Submit";

  labelRelationship = document.createElement("label");
  labelRelationship.append("Relationship");
  labelRelationship.append(relationship);

  labelAge = document.createElement("label");
  labelAge.append("Age");
  labelAge.append(age);

  labelSmoker = document.createElement("label");
  labelSmoker.append("Smoker");
  labelSmoker.append(smoker);

  documentFragment.append(labelRelationship);
  documentFragment.append(labelAge);
  documentFragment.append(labelSmoker);
  documentFragment.append(button);

  return documentFragment

};

function editMember(index) {

  var member;

  member = household[index];
  member.age = document.querySelector("#ageEdit").value;
  member.relationship = document.querySelector("#relationshipEdit").value;
  member.smoker = document.querySelector("#smokerEdit").checked ? "Yes":"No";

};

})();



// submit

// functiion submit()


//change querySelector to findId or find by class
