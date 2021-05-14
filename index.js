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

/*-----EventListeners----------------------------------------------------------*/

/*-----Methodes for geting and validating user input---------------------------*/

/*-----Methodes for fetching and building content------------------------------*/

/*-----Methodes for fetching content-------------------------------------------*/



async function clickForward(event){

    let pageUtilarrowLeft = document.getElementById("pageUtilarrowLeft");    
    
    
    clearResultArea();
    if(pageIndex < data.photos.pages) {
        pageIndex++;
        pageUtilarrowLeft.style.display = "flex";
        buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);
    }
    if (pageIndex >= data.photos.pages) {
       event.target.style.display = "none";
    }

}
async function clickBack(event){
    clearResultArea();
    if(pageIndex > 1) {
        pageIndex--;
        buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);
    }
    if (pageIndex <= 1) {
       event.target.style.display = "none";
    }
}

let pageUtilarrowLeft = document.getElementById("pageUtilarrowLeft");

function mouseIn( event ) {
    event.target.style.transition = "1s";
    event.target.style.color = "brown";
    event.target.style.background = "rgba(0, 0, 0, 0.8)";
    console.log("mouseenter");
    console.log(event.target.style.transition);
    console.log(event.target.style.background);
    console.log(event.target.style.color);

}
function mouseOut( event ) {
    event.target.style.transition = "1s";
    event.target.style.color = "rgba(0, 0, 0, 0.2)";
    event.target.style.background = "rgba(0, 0, 0, 0.1)"
    console.log("mouseenter");
    console.log(event.target.style.transition);
    console.log(event.target.style.background);
    console.log(event.target.style.color);

}

// pageUtil.addEventListener("mouseenter", function( event ) {
//     event.target.style.transition = "1s";
//     event.target.style.color = "rgb(255, 255, 255)";
//     console.log("mouseenter");
//     console.log(event.target.style.transition);
//     console.log(event.target.style.background);
//     console.log(event.target.style.color);



// });

// pageUtil.addEventListener("mouseout", function( event ) {
//     event.target.style.transition = "1s";
//     event.target.style.color = "rgba(0, 0, 0, 0.2)";
//     console.log("mouseout");
//     console.log(event.target.style.transition);
//     console.log(event.target.style.background);
//     console.log(event.target.style.color);



// });

function Jump() {
    if(jumpDone ==false) {
            let jumper = document.getElementById("jumper");
            jumper.setAttribute("id", "jumpUp");
            return true;
    }
}

document.querySelector('#textArea').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        console.log("enter pressed");
        getUserInput();
    }
});

function getUserInput() {

    console.log("First in getUserInput")
    searchFrase = document.getElementById("textArea").value;
    sortArg = document.getElementById("sort").value;
    hitsPerPage = document.getElementById("imgPerPage").value;
    console.log("asdfdg")

    if (searchFrase == "" | sortArg == "" | hitsPerPage == "") {

        let alert = document.createElement("h1");
        let aDiv = document.getElementById("aDiv");
        alert.setAttribute("class", "alert");

        console.log("a field(s) is empty");

        alert.innerHTML = "- Please provide content for all three fields -";
        aDiv.appendChild(alert);


    } else {
        useUserInput(searchFrase, sortArg, hitsPerPage);
    }
}

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

async function useUserInput(searchFrase, sortArg, hitsPerPage) {
    console.log("asdfdg2")

    clearResultArea();

    jumpDone = Jump();
    console.log("hej");

    console.log("searchfrase " + searchFrase);
    console.log("sortArg " + sortArg);
    console.log("hitsPerPage " + hitsPerPage);


    buildResultsOnToPage(await getImages(searchFrase, pageIndex, sortArg, hitsPerPage), imgSizeResult, hitsPerPage);

}

// async function setBGimg(){
//     let imgUrl = await choseBGImg();
//     console.log(imgUrl);
//     return imgUrl;
// }

// let bgImgUrl = setBGimg();
// console.log(bgImgUrl);
// let main = document.getElementsByTagName("main");

// console.log(main);
//main.setAttribute("background-image", `${choseBGImg()}`) ;
//main.style.backgroundImage = `url('${choseBGImg()}')`;





let closeModalClick = document.querySelector("html");

closeModalClick.addEventListener("click", function(){

    console.log("Before if in closeModalClick.addEventListener");

    if (modalIsShowing == true & modalHasOpened == true){
    closeModal();
    }else if (modalIsShowing == true){
        modalHasOpened = true;
    }else if(modalIsShowing == false){
        return;
    }
 });

async function getImages(){

    const apiKey = "7d22d22981732cf9eb8d3d8920f60f89"
    //searchFrase = searchFrase.replace(" ","%20");

    const URL_2 = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${apiKey}&text=${searchFrase}&page=${pageIndex}&per_page=${hitsPerPage}&sort=${sortArg}&format=json&nojsoncallback=1`;



    response = await fetch(URL_2);

    data = await response.json();

    console.log(data);

    return data;

};

async function choseBGImg(){

    const dateNow = new Date();
    const thisMounth = dateNow.getMonth();
    const today = dateNow.getDay();
    let searchFrase = "";

    if(thisMounth < 3){
        searchFrase = "background vinter";
    }else if(thisMounth < 6){
        searchFrase = "background spring";
    }else if(thisMounth < 9){
        searchFrase = "background summer";
    }else if(thisMounth > 11){
        searchFrase  = "background fall";
    }else{
        searchFrase  = "background christmas";
    }

    let imgArray = await getImages(5,searchFrase);
    let pickedIMGURL = ramdomBgPicker(imgArray, 'c');
    console.log(pickedIMGURL)
    return pickedIMGURL
};

function buildResultsOnToPage(searchJSONObject, imgSize, hitsPerPage){


    const photoArray = searchJSONObject.photos.photo;
    console.log(photoArray);
    let imgSizeOnThisPage = imgSize;
    let objectIndexOnPage = 1;

    let pageUtil = document.getElementById("pageUtil");
    let pageUtilUnder = document.getElementById("pageUtilUnder");

    pageUtil.innerHTML = `${hitsPerPage * searchJSONObject.photos.page - hitsPerPage + 1 }-
    ${hitsPerPage * searchJSONObject.photos.page - hitsPerPage + photoArray.length }<br/>of ${searchJSONObject.photos.total} photos<br>`;
    
    pageUtilUnder.innerHTML = `page: ${searchJSONObject.photos.page} of ${searchJSONObject.photos.pages} `
    
    pageUtilArea.style.display = "flex";

    if (searchJSONObject.photos.total > hitsPerPage) {

        console.log(searchJSONObject.photos.page);

        let pageUtilarrowLeft = document.getElementById("pageUtilarrowLeft");
        let pageUtilarrowRight = document.getElementById("pageUtilarrowRight");

        //pageUtilarrowLeft.style.display = "flex";
        pageUtilarrowRight.style.display = "flex";
        console.log(pageUtilArea);
    }

    if(photoArray.length == 0){

        let noResult = document.createElement("h1");
        let aDiv = document.getElementById("aDiv");
        noResult.setAttribute("class", "alert");

        console.log("noResult");

        noResult.innerHTML = "- Sorry, your search came up empty -";
        aDiv.appendChild(noResult);

    }else if(photoArray.length == 0){

    }else{
    photoArray.forEach(photo => {

      let imgURL = imgUrlBuilder(photo, imgSizeOnThisPage);

      let aDiv = document.getElementById("aDiv");

      const imgObject = document.createElement("IMG");


      imgObject.setAttribute("src", imgURL);
      imgObject.setAttribute("class", "imgResult")
      imgObject.setAttribute("id", objectIndexOnPage);
      imgObject.setAttribute("onclick", `openModal(${imgURL})`);
      console.log(imgObject);


      imgObject.addEventListener("click", function(){

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


function ramdomBgPicker(imgArray, imgSize){

    console.log(imgArray);
    console.log(imgArray.length);
    console.log(imgSize);

    let random = Math.floor(Math.random() * 20);
    console.log(random);
    let imgURL = imgUrlBuilder(imgArray[random], imgSize);
    console.log(imgURL);
    return imgURL;

}

function imgUrlBuilder(photo, imgSize){

    const id = photo.id;
    const farmId = photo.farm;
    const serverId = photo.server;
    const secret = photo.secret;
    const imgURL = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}_${imgSize}.jpg`;

    console.log("befour return imgURL, imgURLBuilder");

    return imgURL;

}

// Open the Modal
function openModal(imgURL) {

    console.log(imgURL);

    bigImgURL = imgURL.replace("q.jpg", "c.jpg");

    console.log(bigImgURL);

    let modal = document.getElementById("theModal");

    console.log(modal);

    let modalImage = document.getElementById("insideModal");

    console.log(modalImage);

    modalImage.style.backgroundImage = `url(${bigImgURL})`;
    modal.style.display = "block";
    modalImage.style.display = "block";
    console.log(imgURL);
    modalIsShowing = true;
}

  // Close the Modal
  function closeModal() {
    document.getElementById("theModal").style.display = "none";
    console.log("modal closing")
    modalIsShowing = false;
    modalHasOpened = false;

}


// document.body.onload = addElement;

// function addElement () {
//   // create a new div element
//   const newDiv = document.createElement("div");

//   // and give it some content
//   const newContent = document.createTextNode("Hi there and greetings!");

//   // add the text node to the newly created div
//   newDiv.appendChild(newContent);

//   // add the newly created element and its content into the DOM
//   const currentDiv = document.getElementById("div1");
//   document.body.insertBefore(newDiv, currentDiv);
//}
//   const nameParagraph = document.querySelector(".name")
//   const eyeColorParagraph = document.querySelector(".eye-color")
//   const heightParagraph = document.querySelector(".height")
//   const massParagraph = document.querySelector(".mass")
//   const filmsList = document.querySelector(".films")

//   nameParagraph.innerText = data.name
//   eyeColorParagraph.innerText = data.eye_color
//   heightParagraph.innerText = data.height
//   massParagraph.innerText = data.mass

//   // for(let i = 0; i < data.films.length; i++){
//   //   const film = data.films[i]
//   // }
//   for(let film of data.films){
//     const li = document.createElement("li")
//     li.innerText = film
//     filmsList.append(li)
//  }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function demo() {
    await sleep(5000);

  }

  demo();

