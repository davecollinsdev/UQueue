//button css style 
const buttonCss = `font-weight: 800;
            font-size: 19px;
            background-color: red;
            color: white;
            z-index: 2000;
            opacity: 0.9;
            width: 32px;
            height: 32px;
            cursor: pointer;`

//skip button css style 			
const skipButtonCss = `font-weight: 800;
            font-size: 19px;
            background-color: red;
            color: white;
            z-index: 2000;
            opacity: 0.15;
            width: 50px;
            height: 32px;
			position: absolute;
			left: 0px;
			top: 0px;
            cursor: pointer;`

const timeInterval = 1500; //update interval between button checks 
const playerload = 1000; 
let buttonsOn = new Map(); //records what buttons have already been added


addButtons(); //add buttons on page load 

//every time out interval check for new buttons 
function timeOutEvent(){
    addButtons();
    window.setTimeout(timeOutEvent, timeInterval);
}

window.setTimeout(timeOutEvent, timeInterval);

function addButtons() {
    let links = document.getElementsByTagName('ytd-thumbnail');
    for (i in links) {
        
        if(buttonsOn.get(links[i]) != undefined){ //don't add a button to a video that we already processed 
            continue;
        }
        
        //create button and add it to the video 
        if (links[i].id != null) {
            let node = document.createElement("button");
            let bImage = document.createTextNode("+");
            node.appendChild(bImage);
            node.setAttribute("style", buttonCss);
            node.setAttribute("href", links[i].getElementsByTagName('a')[0].href);
            node.onclick = function (event) { //add video to the queue 
                chrome.runtime.sendMessage({ greeting: "VideoAdded", link: this.getAttribute("href") }, function () { });
            }
            links[i].appendChild(node);
            buttonsOn.set(links[i], true); 
        }
    }
}

//sends message to skip the current video 
function skipVideo(){
	chrome.runtime.sendMessage({greeting : "Pop"}, function(){});
}


//add a skip button to the youtube player
function addSkipButton(){ 
	var youtubeVideoPlayer = document.getElementsByClassName('style-scope ytd-watch-flexy');
	youtubeVideoPlayerLarge = youtubeVideoPlayer[6]; //6 theater and full screen viewer
    youtubeVideoPlayerSmall = youtubeVideoPlayer[11]; //11 normal sized viewer 
    
    youtubeVideoPlayerMini = youtubeVideoPlayer[14];
	
	//button 1 
	let bImageLarge = document.createTextNode(">>");
	let skipButtonLarge = document.createElement("button");
	skipButtonLarge.appendChild(bImageLarge);
	skipButtonLarge.setAttribute("style", skipButtonCss);
	skipButtonLarge.onclick = skipVideo;
	skipButtonLarge.onmouseenter = function(event) {skipButtonLarge.style.opacity = 1;}
	skipButtonLarge.onmouseleave = function(event) {skipButtonLarge.style.opacity = 0.15;}
	youtubeVideoPlayerLarge.appendChild(skipButtonLarge); 
	
	//button 2
	let bImageSmall = document.createTextNode(">>");
	var skipButtonSmall = document.createElement("button");
	skipButtonSmall.appendChild(bImageSmall);
	skipButtonSmall.setAttribute("style", skipButtonCss);
	skipButtonSmall.onclick = skipVideo;
	skipButtonSmall.onmouseenter = function(event) {skipButtonSmall.style.opacity = 1;}
	skipButtonSmall.onmouseleave = function(event) {skipButtonSmall.style.opacity = 0.15;}
    youtubeVideoPlayerSmall.appendChild(skipButtonSmall);
    
    //button 3 (mini)
    
    let bImageSmallx = document.createTextNode(">>");
	var skipButtonSmallx = document.createElement("button");
	skipButtonSmallx.appendChild(bImageSmallx);
	skipButtonSmallx.setAttribute("style", skipButtonCss);
	skipButtonSmallx.onclick = skipVideo;
	skipButtonSmallx.onmouseenter = function(event) {skipButtonSmallx.style.opacity = 1;}
	skipButtonSmallx.onmouseleave = function(event) {skipButtonSmallx.style.opacity = 0.15;}
    youtubeVideoPlayerMini.appendChild(skipButtonSmallx); 
    
    
}

//Wait for page to load before adding the skip buttons 
window.setTimeout(addSkipButton, playerload); 


//detects when a video ends 
var video = document.getElementsByTagName("video")[0];
if(video != null) {
  video.addEventListener("ended", function() {
  	chrome.runtime.sendMessage({greeting : "Pop"}, function(){});
  });
}

/*
    Protocol 

    1. Popup.js request queue from content.js
    2. Content.js responds with the queue and then clears the queue 
    3. Popup.js appends requested videos to internal queue 
*/