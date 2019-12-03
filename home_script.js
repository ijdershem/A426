import BackEnd from './backend.js';
const database = new BackEnd();

var firebaseConfig = {
    apiKey: "AIzaSyBm-lSl1g1XvzblxlF1eZJDht_v8yOB0qk",
    authDomain: "final-1c393.firebaseapp.com",
    databaseURL: "https://final-1c393.firebaseio.com",
    projectId: "final-1c393",
    storageBucket: "final-1c393.appspot.com",
    messagingSenderId: "957024138512",
    appId: "1:957024138512:web:78fcd128830fc176042195",
    measurementId: "G-3VL4NZZ0RF"
};
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
firebase.analytics();

let currentUser;
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        let acctManage = document.getElementById('account-mgmt');
        acctManage.children[0].textContent = "My Account";
        currentUser = user;
    } else {
        let acctManage = document.getElementById('account-mgmt');
        acctManage.children[0].textContent = "Sign Up or Log In";
        currentUser = null;
    }

    
});

function loadHome() {
    console.log('Loading home page...');
    let menubtn = document.getElementById("menu");
    menubtn.addEventListener("click", toggleSideBar);
    //Add listener to document ready to get userdata
}

/**
 * Currently getting current user properly.
 * TODO: (1) Need to index database and match user UID with data
 * and populate side bar with that data
 * (2) create methods for accessing/updating user data within the backend class
 */
async function toggleSideBar() { //Add animation for side-bar display
    let sideBar = document.getElementById("side-bar");
    if(sideBar.style.width != "400px") {
        setTimeout(function() {populateSideBar();}, 100);
        sideBar.style.width = '400px';
    } else {
        while (sideBar.firstChild) {
          sideBar.removeChild(sideBar.firstChild);
        }
        sideBar.style.width = '0';
    }
}

async function populateSideBar() {
   let userData = await getUserData();
   let sideBar = document.getElementById('side-bar');
   let currentUser = document.createElement('h1');
   
   let nav = document.createElement('div');
   nav.setAttribute('id', "side-bar-div");
   let storeBtn = document.createElement('h2');
   storeBtn.textContent = "Store";
   nav.appendChild(storeBtn);
   storeBtn.addEventListener('click', function(){
       window.location.href = "./Store/store.html"
   });

   if(userData) {
        currentUser.textContent = userData.username;
        let balance = document.createElement('h2');
        let amount = document.createElement('h2');
        balance.textContent = "Balance: "
        amount.textContent = userData.balance + " cr";
        amount.style.color = "#000000";
        let topScores = document.createElement('div');
        sideBar.appendChild(currentUser);
        sideBar.appendChild(nav);
        sideBar.appendChild(balance);
        sideBar.appendChild(amount);
   } else {
        currentUser.textContent = "Sign in or Create an Account";
        sideBar.appendChild(currentUser);
   }
}


async function getUserData() { //may want to encapsulate in a class
    let userDetails;
    if(currentUser) {
        userDetails = await database.getUserDataByUID(currentUser.uid);
    }
    return userDetails;
}

$(function(){
    loadHome();
    document.getElementById('side-bar').style.width = '0';
});
