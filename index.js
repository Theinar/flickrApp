let modalIsShowing = false;
let modalHasOpened = false;

function Jump(){
    let jumper = document.getElementById("jumper");
    jumper.setAttribute("id", "jumpUp");
    return true;
}

async function getUserinput() {
    let input = document.getElementById("textArea").value;       
    let jumpDone = Jump();
    console.log("hej");
    searchFrase = document.getElementById("textArea").value;
    btn.setAttribute("value", "undo")
    console.log(searchFrase)
    buildResultsOnToPage(await getImages(20, "cat", 1), imgSize);
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


let imgSize = 'q';


let closeModalClick = document.querySelector("html");

closeModalClick.addEventListener("click", async function(){
    if (modalIsShowing == true & modalHasOpened == true){
    closeModal();
    }else if (modalIsShowing == true){
        modalHasOpened = true;
    }else if(modalIsShowing == false){
        return;
    } 
 });
const btn = document.querySelector(".material-icons");

// btn.addEventListener("click", async function(){







// });

async function getImages(IMGsPerPage, searchFrase, pageIndex){

    const apiKey = "7d22d22981732cf9eb8d3d8920f60f89"
    //searchFrase = searchFrase.replace(" ","%20");

    const URL_2 = `https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=${apiKey}&text=${searchFrase}&page=${pageIndex}&per_page=20&sort=relevance&format=json&nojsoncallback=1`;

    

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
    photoArray.forEach(photo => {


      let imgURL = imgUrlBuilder(photo, imgSizeOnThisPage);

      let aDiv = document.getElementById("aDiv");

      const imgObject = document.createElement("IMG");
      imgObject.setAttribute("src", imgURL);
      imgObject.setAttribute("class", "imgResult")
      imgObject.setAttribute("id", imgIndexOnPage);
     // if ( document.getElementById("theModal").style.display == "none"){
       // imgObject.setAttribute("onclick", `openModal(${imgIndexOnPage})`);
      //}
      //else{
       // console.log(imgURL);
        imgObject.setAttribute("onclick", `openModal(${imgURL})`);
      //}
      console.log(imgObject);
      aDiv.appendChild(imgObject);

      imgIndexOnPage++;
    });
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


    return imgURL;

}

// Open the Modal
function openModal(imgIndexOnPage) {

    





    document.getElementById("theModal").style.display = "flex";
    console.log("modal showing")
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
