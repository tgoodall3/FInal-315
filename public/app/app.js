var usersExist = false;
var userFullName = "";
var _db = "";
var _userProfInfo = {};

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
