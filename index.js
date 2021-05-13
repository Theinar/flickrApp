let modalIsShowing = false;
let modalHasOpened = false;
let jumpDone = false
let imgSize = 'q';

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
        getUserinput();
    }
});

async function getUserinput() {

    let searchFrase = document.getElementById("textArea").value;   
    let sortArg = document.getElementById("sort").value;
    let hitsPerPage = document.getElementById("imgPerPage").value;

    if (searchFrase == "" | sortArg == "" | hitsPerPage == "" ){
        
        let alert = document.createElement("h1");        
        let aDiv = document.getElementById("aDiv");
        alert.setAttribute("class", "alert");
        
        console.log("a field(s) is empty");

        alert.innerHTML = "- Please provide content for all three fields -"; 
        aDiv.appendChild(alert);


    }else{
        let theAlert = document.querySelectorAll(".alert");
        let oldResults = document.querySelectorAll(".imgResult");
        if ( theAlert != null){
            console.log("alert inte null")
            theAlert.forEach(element => {
                element.remove();
            });
        }
        if ( oldResults != null){
            console.log("imgResult inte null")
            oldResults.forEach(element => {
                element.remove();
            });
        }
        jumpDone = Jump();
        console.log("hej");
        
        console.log("searchfrase " + searchFrase);
        console.log("sortArg " + sortArg);
        console.log("hitsPerPage " + hitsPerPage);


        buildResultsOnToPage(await getImages(searchFrase, 1, sortArg, hitsPerPage), imgSize);
        

    }

}

function Test(){
    console.log("Test");
}
function newFrase(){
    
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

async function getImages(searchFrase, pageIndex, sortArg, hitsPerPage ){

    const apiKey = "7d22d22981732cf9eb8d3d8920f60f89"
    //searchFrase = searchFrase.replace(" ","%20");

    const URL_2 = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${apiKey}&text=${searchFrase}&page=${pageIndex}&per_page=${hitsPerPage}&sort=${sortArg}&format=json&nojsoncallback=1`;

    

    const response = await fetch(URL_2);
    
    const data = await response.json();
  
    console.log(data);
  
    const photoArray = data.photos.photo;

    return photoArray;



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

    let imgArray = await getImages(20,searchFrase);
    let pickedIMGURL = ramdomBgPicker(imgArray, 'c');
    console.log(pickedIMGURL)
    return pickedIMGURL
};

function buildResultsOnToPage(photoArray, imgSize){

    console.log(photoArray);
    let imgSizeOnThisPage = imgSize;
    let imgIndexOnPage = 1;
    
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
      imgObject.setAttribute("id", imgIndexOnPage);
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

      imgIndexOnPage++;
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
