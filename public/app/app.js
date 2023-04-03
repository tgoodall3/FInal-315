var usersExist = false;
var userFullName = "";
var _db = "";
var _userProfInfo = {};
// var lists = [];

function barlistener(){
    $(".bars").click(function(e){
        $(".bars").toggleClass("active");
        $("nav").toggleClass("active");
    })  
}

// function logListener(){
//   $(".oval a").click(function(e){
//       $(".bars").toggleClass("active");
//       $("nav").toggleClass("active");
//   })  
// }

// function loadRecipe (){
//   let listString = "<ul>";
//   $.each(_userProfInfo.lists, function(index, list){
//     listString += `<li id="${index}" onclick="LoadListItems(${index})">${list.name} 
//     <span class="right"> Items: ${list.ListItems.length}</span></li>`;
//   });

//   listString += "<ul>";
//   $("#app").html(listString);
// }

function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    // console.log(hashTag + " " + pageID);

    if(pageID !== "") {

        $.get(`pages/${pageID}/${pageID}.html`, function(data){
            // console.log("data " + data);
            $("#app").html(data); 
        })

    } else {
        $.get(`pages/home/home.html`, function(data){
            console.log("data " + data);
            $("#app").html(data); 
        })
    }
}

function initURLlisteners(){
    $(window).on("hashchange", changeRoute); 
    changeRoute();
}

function viewRecipe(){
  console.log("View recipe");
  $("#app").html(` 
  <div class="wrapper">
  <div class="detail-recipe">
    <div class="header">
      <h1>supreme pizza</h1>
    </div>
    <div class="food-image">
      <img src="images/recipe-pizza.png" alt="" />
    </div>
    <div class="food-description">
      <div class="head">
        <h1>Description:</h1>
        <span
          >Make pizza night super duper out of this world with homemade
          pizza. This recipe is supreme with vegetables and two types of
          meat. Yum!</span
        >
      </div>
      <div class="info">
        <span>Total Time:</span>
        <span>1h 24min</span>
        <span>Servings:</span>
        <span>4 servings</span>
      </div>
    </div>
  </div>
  <div class="ingredients">
    <div class="header">
      <h1>Ingredients:</h1>
    </div>
    <div class="list">
      <span>1/4 batch pizza dough</span>
      <span>2 tablespoons Last-Minute Pizza Sauce</span>
      <span>10 slices pepperoni</span>
      <span>1 cup cooked and crumbled Italian sausage </span>
      <span>2 large mushrooms, sliced </span>
      <span>1/4 bell pepper, sliced</span>
      <span>1 tablespoon sliced black olives</span>
      <span>1 cup shredded mozzarella cheese</span>
    </div>
  </div>
  <div class="instructions">
    <div class="header">
      <h1>Instructions:</h1>
    </div>
    <div class="list">
      <span
        >1. Preheat the oven to 475°. Spray pizza pan with nonstick cooking
        or line a baking sheet with parchment paper.</span
      >
      <span
        >2. Flatten dough into a thin round and place on the pizza pan.
      </span>
      <span>3. Spread pizza sauce over the dough. </span>
      <span
        >4. Layer the toppings over the dough in the order listed .
      </span>
      <span
        >5. Bake for 8 to 10 minutes or until the crust is crisp and the
        cheese melted and lightly browned.</span
      >
    </div>
  </div>
  <a href="editRecipe.html"><button>Edit Recipe</button></a>
</div>
  `);
}

function editRecipe(){
  // e.preventDefault();
  console.log("edit recipe");
  $("#app").html(` 
  <div class="recipe">
        <div class="create">
            <form class="recipe">
              <label for="fName">Add Recipe Image</label>
              <input id="fName" type="text" name="First Name" />
              <label for="LName">Recipe Name</label>
              <input id="lName" type="text" name="Last Name" />
              <label for="email">Recipe Description</label>
              <input id="email" type="text" name="Email" />
              <label for="improve">Recipe Total Time</label>
              <input id="improve" type="text" name="Improve" />
              <label for="concerns">Recipe Serving Size?</label>
              <input id="concerns" type="text" name="concerns" />
              </form>
      
              <form class="Ingredient">
              <label for="me">Ingredient #1</label>
              <input id="me" type="text" name="me" />
              <label for="valuable">Ingredient #2</label>
              <input id="valuable" type="text" name="valuable" />
              <label for="reccomendations">Ingredient #3</label>
              <input id="reccomend" type="text" name="reccomend" />
          </form>
      
              <form class="Instruction">
                <label for="Anything">Instruction #1</label>
                <input id="anything" type="text" name="anything" />
                <label for="message">Instruction #2</label>
                <input id="message" type="text" name="message" />
                <label for="message">Instruction #3</label>
                <input id="message" type="text" name="message" />
              </form>
      
              <div class="CreateSub">
                <input id="submit" type="submit" value="Submit" />
              </div>
            </form>
          </div>
    </div>
  `);

}


function initFirebase(){
  firebase.auth().onAuthStateChanged((user)=> {
    if(user){
      _db = firebase.firestore();
      console.log("auth changed logged in");

      $("button").prop("disabled", false);


      console.log("display name");
      console.log(user.displayName);
      
      if (user.displayName){
        $(".name").html(user.displayName);  
      }

      $("#log-in-nav-holder").hide();
      $("#log-out-nav-holder").show();

      
      usersExist = true;
    } else{
      _db = "";
      _userProfInfo = {};
      console.log("auth changed logged out");
      $(".name").html("");

      $("#log-out-nav-holder").hide();
      $("#log-in-nav-holder").show();

      $("button").prop("disabled", true);
      $("rec").prop("disabled", true);
      usersExist = false;
      userFullName = "";
    }
  })
}

function addRecipe(){
  let newRecipeName = $("#recipeName").val();
    let newRecipeObj = {
    name: newRecipeName,
    recipeItems: [],
    };
    

    console.log("work");

  _userProfInfo.lists.push(newRecipeObj);
  updateUserInfo(_userProfInfo);
  loadRecipe();
  $("#recipeName").val();
  } 



function updateUserInfo(userObj){
  let id = firebase.auth().currentUser.uid;
  _db.collection("Users").doc(id).update(userObj).then(()=>{
    console.log("Updated Doc");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Update Error " + error);
    alert ("Update Error");

  });
}

function signOut(){
  firebase
  .auth()
  .signOut()
  .then(() => {
    console.log("signed out");
    alert ("You are signed out");

  })
  .catch ((error) => {
    console.log("error signing out");
  })
}


function signIn() {
  firebase.auth().signInAnonymously()
  .then(() => {
    console.log("signed in");
    alert ("You are signed in");

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error signing in " + errorMessage);
    // ...
  });
}

function createAccount() {
  let FName = $(".FName").val();
  let LName = $(".LName").val();
  let Email = $(".Email").val();
  let Password = $(".Password").val();
  let fullname = FName + ' ' + LName;
  let userObj = {
    firstname: FName,
    lastname: LName,
    Email: Email,
    lists: [],
  }


  console.log("create " + FName + ' ' + LName + ' ' + Email + ' ' + Password + ' ');
  // console.log("email" + Email);

  firebase.auth().createUserWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...

    console.log("created");

    alert("You have created your account!");

    firebase.auth().currentUser.updateProfile({
      displayName: fullname,
    })

   _db.collection("Users").doc(user.uid).set(userObj).then((doc) => {
    console.log("doc added");

  //  _userProfInfo = userObj;
   console.log("create UserInfo ", _userProfInfo);


   })
   
   .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("create error " + errorMessage);

    console.log(displayName);
  });

    userFullName = fullname;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("create error " + errorMessage);

  });

}

function login(){
  let Email = $("#Email").val();
  let Password = $("#Password").val();
  console.log(Email + Password);

  firebase.auth().signInWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...

    _db.collection("Users").doc(user.uid).get().then((doc) => {
      console.log(doc.data());
      _userProfInfo = doc.data();
      console.log("login UserInfo ", _userProfInfo);

      // loadRecipe();
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Log in Error" + error);
      alert ("error logging in");
  
    });

    console.log("Logged In");
    alert ("You are Logged in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Log in Error" + error);
    alert ("error logging in");

  });
}


$(document).ready(function(){
  try{
    let app = firebase.app();
    initFirebase();
    // signInAnon();
  } catch(error){
    console.log("error", error)
  }

  initURLlisteners();
  barlistener();
});
