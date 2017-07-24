//initializes app

(function onPageLoad() {

  var household, age, relationship, smoker;

  household = [];

  addIdsFormInputs();
  addButtonEvent();
  submitFormEvent();


//functions

function addIdsFormInputs() {  //adding Id's for easier access

  var inputArray, select;

  inputArray = document.getElementsByTagName("input");
  select = document.getElementsByTagName("select");

  inputArray[0].id = "age";
  inputArray[1].id = "smoker";
  select[0].id = "relationship";

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

    age = document.getElementById("age").value;
    relationship = document.getElementById("relationship").value

  } else if ( createEditMemberCallback === editMember ) {

    age = document.getElementById("ageEdit").value;
    relationship = document.getElementById("relationshipEdit").value;

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

  age = document.getElementById("age").value;
  relationship = document.getElementById("relationship").value;
  smoker = document.getElementById("smoker").checked ? "Yes" : "No";

  obj = {};
  obj.age = age;
  obj.relationship = relationship;
  obj.smoker = smoker;



  household.push(obj);

};

function clearForm() {

  document.getElementById("age").value = "";
  document.getElementById("relationship").value = "";
  document.getElementById("smoker").checked = false;

};


function displayHouseholdMembers() {

  var display, htmlFragment, memberInfo, li, div, deleteButton, editButton;

  display = document.querySelector(".household");
  display.innerHTML = "";
  htmlFragment = document.createDocumentFragment();

  household.forEach( function (member, index){

    memberInfo =  "Relationship: "+ member.relationship + "    |    "   +
                        " Age: " + member.age + "    |    " +
                        " Smoker: " + member.smoker + "      "
    li = document.createElement("li");
    li.id = index;

    div = document.createElement("div");
    div.style.textTransform = "capitalize";

    deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.innerHTML = "Delete"

    editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = "Edit"

    div.append(memberInfo, deleteButton, editButton);
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

  document.getElementById("editForm").addEventListener("submit", function (event) {

    event.preventDefault();
    validate(editMember, index)
  });

}

function createEditForm(memberAge, memberSmoker, memberRelationship) {

  var documentFragment, form, relationshipOptions, button, labelRelationship,
      labelAge, labelSmoker, labelButton;

  documentFragment = document.createDocumentFragment()
  memberSmoker = memberSmoker === "Yes"? true: false;
  form = document.createElement("form");
  form.id = "editForm"

  relationship = document.getElementById("relationship").cloneNode(true);
  relationship.id = "relationshipEdit";

  relationshipOptions = relationship.querySelectorAll("option");
  relationshipOptions.forEach(function(option){

    if ( option.value === memberRelationship ) {
      option.selected = true;
    }

  });

  age = document.getElementById("age").cloneNode(true);
  age.id = "ageEdit";
  age.value = memberAge

  smoker = document.getElementById("smoker").cloneNode(true);
  smoker.id = "smokerEdit";
  smoker.checked = memberSmoker;

  button = document.createElement("button");
  button.type = "Submit";
  button.innerHTML = "Submit";

  labelRelationship = document.createElement("label");
  labelRelationship.append("Relationship", relationship);

  labelAge = document.createElement("label");
  labelAge.append("Age", age);

  labelSmoker = document.createElement("label");
  labelSmoker.append("Smoker", smoker);

  form.append(labelRelationship, labelAge, labelSmoker, button);
  documentFragment.append(form);

  return documentFragment

};

function editMember(index) {

  var member;

  member = household[index];
  member.age = document.getElementById("ageEdit").value;
  member.relationship = document.getElementById("relationshipEdit").value;
  member.smoker = document.getElementById("smokerEdit").checked ? "Yes" : "No";

};

function submitFormEvent(){

  var form;

  form = document.querySelector("form");
  form.addEventListener("submit", function(e){

    e.preventDefault();

  })

}


})();
