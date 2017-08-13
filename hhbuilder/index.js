//initializes app

(function onPageLoad() {

  var household = [];

  function Member(age, relationship, smoker){
    this.age = age;
    this.relationship = relationship;
    this.smoker = smoker;
  };

  function createHouseholdMember() {
    var age = document.getElementsByName("age")[0].value;
    var relationship = document.getElementsByName("rel")[0].value;
    var smoker = document.getElementsByName("smoker")[0].checked ? "Yes" : "No";

    var obj = new Member(age, relationship, smoker);

    household.push(obj);
  };

  function validate(createEditMemberCallback, index) {
    var age = "";
    var relationship = "";

    if ( createEditMemberCallback === createHouseholdMember ) {
      age = document.getElementsByName("age")[0].value;
      relationship = document.getElementsByName("rel")[0].value
    } else if ( createEditMemberCallback === editMember ) {
      age = document.getElementById("ageEdit").value;
      relationship = document.getElementById("relationshipEdit").value;
    }

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


  function clearForm() {
    document.getElementsByName("age")[0].value = "";
    document.getElementsByName("rel")[0].value = "";
    document.getElementsByName("smoker")[0].checked = false;
  };

  function displayHouseholdMembers() {
    var htmlFragment = document.createDocumentFragment();

    household.forEach( function (member, index){

      var memberInfo =  "Relationship: "+ member.relationship + "    |    "   +
                          " Age: " + member.age + "    |    " +
                          " Smoker: " + member.smoker + "      ";
      var li = document.createElement("li");
      li.id = index;

      var div = document.createElement("div");
      div.style.textTransform = "capitalize";

      var deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.innerHTML = "Delete";

      var editButton = document.createElement("button");
      editButton.className = "edit";
      editButton.innerHTML = "Edit";

      div.append(memberInfo, deleteButton, editButton);
      li.append(div);
      htmlFragment.append(li);
    });

    var display = document.querySelector(".household");
    display.innerHTML = "";
    display.append(htmlFragment);
    addEditDeleteEvents();
  };

  //delete and edit houshold memberInfo
  function addEditDeleteEvents() {
    document.querySelectorAll(".delete").forEach( function (button, index){
      button.addEventListener("click", function(e){
        deleteMember(e, index);
      });
    });

    document.querySelectorAll(".edit").forEach(function(button, index) {
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

    var member = household[index];
    var listOfHouseholdMembersDisplayed = document.querySelectorAll("li")
    var div = listOfHouseholdMembersDisplayed[index].querySelector("div")
    var form = createEditForm( member.age, member.smoker, member.relationship);
    listOfHouseholdMembersDisplayed[index].replaceChild(form, div);

    document.getElementById("editForm").addEventListener("submit", function (event) {
      event.preventDefault();
      validate(editMember, index)
    });
  };

  function createEditForm(memberAge, memberSmoker, memberRelationship) {
    var documentFragment = document.createDocumentFragment()
    var memberSmokerTF = memberSmoker === "Yes"? true: false;
    var form = document.createElement("form");
    form.id = "editForm"

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
    age.value = memberAge

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

    return documentFragment
  };

  function editMember(index) {
    var member = household[index];
    member.age = document.getElementById("ageEdit").value;
    member.relationship = document.getElementById("relationshipEdit").value;
    member.smoker = document.getElementById("smokerEdit").checked ? "Yes" : "No";
  };

  function serialize(household){
    var json = JSON.stringify(household);
    var debug = document.querySelector(".debug");

    debug.innerHTML = json;
    debug.style.display = 'block';
  };



  document.querySelector(".add").addEventListener("click", function(e){
    e.preventDefault();
    validate(createHouseholdMember);
  });

  document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();
    serialize(household);
  });

})();
