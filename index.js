/*--------------------------------------------------------------------------------------------------

JS-file for web Flickr App by Einar Ólafsson - SUT20

The app is an assignment was given by frontend development teacher Marcus Johansson (http://mji.se/)

the assignment was to make an flickr.com search-app using the flick API.

The should haves was:

 - using HTML, CSS (incl flexbox) and vanilla JS
 - make an image search using “text search”
 - display the search result in a nice gallery form
 - show clicked image in larger size (eg lightbox effect)

the could haves was:

 - more functionality based on the method's arguments, ex. sorting hits per page
 - pagnation functionality where you can browse between different pages of search results
 - error handling where the error code is communicated to the user

 I added a few like animations and styling for estetics

                                ///Kind regards Einar Ólafsson - https://github.com/Theinar


-----Start variables----------------------------------------------------------*/

let modalIsShowing = false;
let modalHasOpened = false;
let jumpDone = false
let imgSizeResult = 'q';
let searchFrase;
let sortArg;
let hitsPerPage;
let pageIndex = 1;
let response;
let data;

/*-----EventListeners and onclick functions------------------------------------*/

/*clickForward and clickBack are click events for page switch buttons */

async function clickForward(event){

    // Selecting element
    let pageUtilarrowLeft = document.getElementById("pageUtilarrowLeft");       
    
    // Cleares result area from eather old results or 
    clearResultArea();

    // A next paige search should onley be possible if there ar more results to fetch 
    if(pageIndex < data.photos.pages) {
        pageIndex++;
        pageUtilarrowLeft.style.display = "flex"; // Shows button if it was hidden befour

        // Fethches and builds ne search results
        buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);
    }
    // Hides button if there are no next page too fethch
    if (pageIndex >= data.photos.pages) {
       event.target.style.display = "none";
    }

}
async function clickBack(event){

    // Selecting elemen
    let pageUtilarrowRight = document.getElementById("pageUtilarrowRight");   

    // Cleares result area from eather old results or 
    clearResultArea();

    // A previous paige search should onley be possible if there ar more results to fetch 
    if(pageIndex > 1) {
        pageIndex--;
        pageUtilarrowRight.style.display = "flex";
        buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);
    }
    // Hides button if there are no previous page too fethch
    if (pageIndex <= 1) {
       event.target.style.display = "none";
    }
}

/*MouseIn and MouseOut are hoverover effects for PageUtilArea */

function mouseIn( event ) {

    // Some inline styling triggered on event
    event.target.style.transition = "0.5s";
    event.target.style.color = "brown";
    event.target.style.background = "rgba(0, 0, 0, 0.8)";
    console.log("mouseenter");
}
function mouseOut( event ) {
    
    // Some inline styling triggered on event
    event.target.style.transition = "0.5s";
    event.target.style.color = "rgba(0, 0, 0, 0.2)";
    event.target.style.background = "rgba(0, 0, 0, 0.1)"
    console.log("mouseout");
}

//Selecting element to add event listener to
let closeModalClick = document.querySelector("html");

// A eventlistener that listens to click all over the page but only triggers when lightbox is visible
closeModalClick.addEventListener("click", function(){

    console.log("Before if in closeModalClick.addEventListener");

    // Code to ensure if LightBox is open or closed and acting oppon that
    if (modalIsShowing == true & modalHasOpened == true){
    closeModal();
    }else if (modalIsShowing == true){
        modalHasOpened = true;
    }else if(modalIsShowing == false){
        return;
    }
 });

 // Event listener for key press "Enter" to submit results
document.querySelector('#textArea').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        console.log("enter pressed");
        getUserInput();
    }
});

/*-----Methodes for geting and validating user input---------------------------*/

function getUserInput() {

    console.log("First in getUserInput")

    //Saves input from user in variables
    searchFrase = document.getElementById("textArea").value;
    sortArg = document.getElementById("sort").value;
    hitsPerPage = document.getElementById("imgPerPage").value;

    // Validates info from user and sends Message if info is incomplete
    if (searchFrase == "" | sortArg == "" | hitsPerPage == "") {

        let alert = document.createElement("h1");
        let aDiv = document.getElementById("aDiv");
        alert.setAttribute("class", "alert");

        console.log("a field(s) is empty");

        alert.innerHTML = "- Please provide content for all three fields -";
        aDiv.appendChild(alert);


    } else {

        // Sends validated info to next function in chain
        useUserInput(searchFrase, sortArg, hitsPerPage);
    }
}

// useUserInput clears searchresult area and triggers animation and starts fetching and building the results 
async function useUserInput(searchFrase, sortArg, hitsPerPage) {

    clearResultArea();

    // triggers Jump animation, jump returns boolean to ensure this only happens ones
    jumpDone = Jump();

    console.log("searchfrase " + searchFrase);
    console.log("sortArg " + sortArg);
    console.log("hitsPerPage " + hitsPerPage);


    buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);

}

/*-----Methodes for clearing, fetching and building content------------------------------*/

// guess what is does
function clearResultArea(){

    let theAlert = document.querySelectorAll(".alert");
    let oldResults = document.querySelectorAll(".imgResult");
    if (theAlert != null) {
        console.log("alert inte null")
        theAlert.forEach(element => {
            element.remove();
        });
    }
    if (oldResults != null) {
        console.log("imgResult inte null")
        oldResults.forEach(element => {
            element.remove();
        });
    }
}


// Uses the input form user and takes API key to build URL, fetch results, parses it to JSON whitch gest returned 
async function getImages(){

    const apiKey = "7d22d22981732cf9eb8d3d8920f60f89"

    const URL_2 = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${apiKey}&text=${searchFrase}&page=${pageIndex}&per_page=${hitsPerPage}&sort=${sortArg}&format=json&nojsoncallback=1`;



    response = await fetch(URL_2);

    data = await response.json();

    console.log(data);

    return data;

};

// Uses the JSON object from getImages and builds separate URLs for each img and builds it on to page
// Sets info in pageUtilElements and hides/shows button according to circumstances 
function buildResultsOnToPage(searchJSONObject, imgSize, hitsPerPage){

    // saves only the photo array element for simplicity
    const photoArray = searchJSONObject.photos.photo;
    console.log(photoArray);
    // counter for number of elements in results
    let objectIndexOnPage = 1;

    //Selects elements which contains text info in pageUtilArea
    let pageUtil = document.getElementById("pageUtil");
    let pageUtilUnder = document.getElementById("pageUtilUnder");

    // Updates text info according to search results
    pageUtil.innerHTML = `${hitsPerPage * searchJSONObject.photos.page - hitsPerPage + 1 }-
    ${hitsPerPage * searchJSONObject.photos.page - hitsPerPage + photoArray.length }<br/>of ${searchJSONObject.photos.total} photos<br>`;
    
    pageUtilUnder.innerHTML = `page: ${searchJSONObject.photos.page} of ${searchJSONObject.photos.pages} `
    
    // Shows pageUtilArea if hidden
    pageUtilArea.style.display = "flex";

    // Shows Right button if there are more results after this page
    if (searchJSONObject.photos.total > hitsPerPage) {

        console.log(searchJSONObject.photos.page);

        let pageUtilarrowRight = document.getElementById("pageUtilarrowRight");

        pageUtilarrowRight.style.display = "flex";
        console.log(pageUtilArea);
    }

    // Displays message to user if the results came up empty
    if(photoArray.length == 0){

        let noResult = document.createElement("h1");
        let aDiv = document.getElementById("aDiv");
        noResult.setAttribute("class", "alert");

        console.log("noResult");

        noResult.innerHTML = "- Sorry, your search came up empty -";
        aDiv.appendChild(noResult);

    }else{

    // If there are results to show elements gets created and displayed
    photoArray.forEach(photo => {

        // Builds specific url based on api results
      let imgURL = imgUrlBuilder(photo, imgSize);

      // selects where imgs will be appended
      let aDiv = document.getElementById("aDiv");

      // saves new element in variable
      const imgObject = document.createElement("IMG");

      // setting atributes to newly created element
      imgObject.setAttribute("src", imgURL);
      imgObject.setAttribute("class", "imgResult")
      imgObject.setAttribute("id", objectIndexOnPage);
      imgObject.setAttribute("onclick", `openModal(${imgURL})`);
      console.log(imgObject);

      // creates EventListener to eatch element so that each img is clickeble
      imgObject.addEventListener("click", function(){

        // logic for opening or closing Lightbox/modal and sub,itting speciffic URL
        if (modalIsShowing == true & modalHasOpened == true){
            closeModal();
            console.log("modalIsShowing == true & modalHasOpened == true");
        }else if (modalIsShowing == true){
            modalHasOpened = true;
            console.log("modalIsShowing == true");
        }else if(modalIsShowing == false){
            console.log("openModal");
        openModal(imgURL);
        }

        });

      aDiv.appendChild(imgObject);

      objectIndexOnPage++;
    });}
};

// takes photo JSON and imgsize to build specific URL  
function imgUrlBuilder(photo, imgSize){

    const id = photo.id;
    const farmId = photo.farm;
    const serverId = photo.server;
    const secret = photo.secret;
    const imgURL = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${imgSize}.jpg`;

    console.log("befour return imgURL, imgURLBuilder");

    return imgURL;

}

/*-----Methodes for Modal/LightBox-------------------------------------------*/

// Open the Modal
function openModal(imgURL) {

    console.log(imgURL);

    // Changes URL to different sized picture URL to propperly fit Lightbox/modal
    bigImgURL = imgURL.replace("q.jpg", "c.jpg");

    console.log(bigImgURL);

    // selecting modal/lightbox element
    let modal = document.getElementById("theModal");

    console.log(modal);

    // selecting element where modal img will be shown
    let modalImage = document.getElementById("insideModal");

    console.log(modalImage);

    // Changes styling to nicely show lightBox with picture
    modalImage.style.backgroundImage = `url(${bigImgURL})`;
    modal.style.display = "block";
    modalImage.style.display = "block";
    console.log(imgURL);
    // boolean used by eventlisteners to determinat action
    modalIsShowing = true;

}

  // Close the Modal
  function closeModal() {
    document.getElementById("theModal").style.display = "none";
    console.log("modal closing")
    // booleans used by eventlisteners to determinat action
    modalIsShowing = false;
    modalHasOpened = false;

}

/*-----Jump animation func and other funcs to be continued next time--------------*/
function Jump() {
    if(jumpDone ==false) {
            let jumper = document.getElementById("jumper");
            jumper.setAttribute("id", "jumpUp");
            return true;
    }
}

//-------------------------not implemented in v1.0------------------------------
// // funcs whitch can be used th app evolves and needs a seasonal background images

// async function choseBGImg(){

//     const dateNow = new Date();
//     const thisMounth = dateNow.getMonth();
//     const today = dateNow.getDay();
//     let searchFrase = "";

//     if(thisMounth < 3){
//         searchFrase = "background vinter";
//     }else if(thisMounth < 6){
//         searchFrase = "background spring";
//     }else if(thisMounth < 9){
//         searchFrase = "background summer";
//     }else if(thisMounth > 11){
//         searchFrase  = "background fall";
//     }else{
//         searchFrase  = "background christmas";
//     }

//     let imgArray = await getImages(5,searchFrase);
//     let pickedIMGURL = ramdomBgPicker(imgArray, 'c');
//     console.log(pickedIMGURL)
//     return pickedIMGURL
// };




// function ramdomBgPicker(imgArray, imgSize){

//     console.log(imgArray);
//     console.log(imgArray.length);
//     console.log(imgSize);

//     let random = Math.floor(Math.random() * 20);
//     console.log(random);
//     let imgURL = imgUrlBuilder(imgArray[random], imgSize);
//     console.log(imgURL);
//     return imgURL;

// }


