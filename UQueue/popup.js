//get button references 
let play = document.getElementById('play');
let deleteQueue = document.getElementById('deleteQueue');
let skip = document.getElementById('skip');


requestQueue(true); //get queue from VideoManager

play.onclick = function (element) {
  if(videoQueue.length > 0){
    chrome.runtime.sendMessage({greeting: "Pop", newTab: true}, function(){})
  }
};

deleteQueue.onclick = function (element) {
  chrome.runtime.sendMessage({greeting: "Purge"}, function(){})
  close();
};
  

skip.onclick = function (element) {
  if(videoQueue.length > 0){
    chrome.runtime.sendMessage({greeting: "Pop", newTab: false}, function(){})
    close();
  }
}

//get queue from VideoManager
function requestQueue(repopQueue){
    chrome.runtime.sendMessage({greeting: "RequestingQueue"}, function(response){
        if(response.farewell == "QueueSent"){
            videoQueue = response.queue;
            if(repopQueue)
                populateVideoScroller(videoQueue);
        }
    });
}

//thumbnail style sheet
//For when we had buttons:
/* 
const cssT = `
      height: 75px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 10px;
      position: relative;
      left: 50px;`
*/

//style sheet for thumbnails listed in queue
const cssT = `
height: 75px;
margin-left: auto;
margin-right: auto;
margin-bottom: 10px;
position: relative;
left: 20px;`


//Arrow buttons are depreciated in version 9.0...

//Arrow button style sheet
const upStyle = `
      width: 22px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2px;
      position: relative;
      right: 82px;
      bottom: 62px;
      opacity: 0.75;`

//Arrow button style sheet
const downStyle = `
      width: 22px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2px;
      position: relative;
      right: 104px;
      bottom: 40px;
      opacity: 0.75;`
  



//add youtube thumbnails to the video scroller div 
function populateVideoScroller(videoQueue){
   
   //clear the current contents 
   //vidscroller was for just the array buttons, now we use a UL for drag and drop.
   //let vidScroller = document.getElementById("videoBox");
   //vidScroller.innerHTML = "";   

   var ul = document.getElementById("image-list1");
   $(ul).empty();
   //clear list first before jumping into loop
   
  for(videoURL in videoQueue){

    //Creating video thumbnail button
    let elem = document.createElement("input");
    elem.setAttribute("style", cssT);
    elem.setAttribute("type", "image");
    elem.setAttribute("href", videoQueue[videoURL]);
    elem.src = urlToThumbail(videoQueue[videoURL]);

    //show delete icon when hovered 
    elem.onmouseenter = function(event) {
      elem.src = "images/remove.png";
    }
    
    //reset image on mouse leave 
    elem.onmouseleave = function(event) {
      elem.src = urlToThumbail(elem.getAttribute("href"));
    }

    //delete the clicked video from the queue 
    elem.onclick = function(event) {
      chrome.runtime.sendMessage({greeting: "Delete", url : elem.getAttribute("href")}, function(){});
      elem.parentElement.remove();
      requestQueue(false);
    }

    //Creating up and down arrow buttons
    
    let upArr = document.createElement("input");
    upArr.setAttribute("style", upStyle);
    upArr.setAttribute("type", "image");
    upArr.src = "images/Up.png";
    let downArr = document.createElement("input");
    downArr.setAttribute("style", downStyle);
    downArr.setAttribute("type", "image");
    downArr.src = "images/Down.png";
    

    //changing opacities when hovering over arrows
    upArr.onmouseenter = function(event){ upArr.style.opacity = 1; }
    upArr.onmouseleave = function(event){ upArr.style.opacity = 0.75; }
    downArr.onmouseenter = function(event){ downArr.style.opacity = 1; }
    downArr.onmouseleave = function(event){ downArr.style.opacity = 0.75; }

    //Moving video in queue when clicking an arrow
    upArr.onclick = function(event){
      chrome.runtime.sendMessage({greeting: "Move", dir: "Up", link: elem.getAttribute("href")}, function(response){
        if(response.farewell == "Swapped"){
          requestQueue(true);
        }
      });
    }
    
    
    downArr.onclick = function(event){
      chrome.runtime.sendMessage({greeting: "Move", dir: "Down", link: elem.getAttribute("href")}, function(response){
        if(response.farewell == "Swapped"){
          requestQueue(true);
        }
      });
    }
    

    //When we were using buttons.
    //Appending elements to the video scroller
    //let vidCont = document.createElement("VideoCont");
    //vidCont.appendChild(elem);
    //vidCont.appendChild(upArr);
    //vidCont.appendChild(downArr);
    //vidScroller.appendChild(vidCont);

    //appending to list for drag and drop
    
    var li = document.createElement("li");
    var textL = elem.getAttribute("href");
    li.id = textL;
    li.appendChild(elem);
    li.appendChild(upArr); //adding arrows with drag and drop
    li.appendChild(downArr); //adding arrows with drag and drop
    //ul.insertBefore(li, ul.firstChild); For inserting at the end (maybe option in future?)
    ul.appendChild(li);

  } //end of for loop

}



//to handle the user finished sorting
var sortFinishedHandler = function(event, ui){
  var tempQueue = $(".sortable-list").sortable('toArray'); //toArray takes all the links stored in the id field of the list items and puts it in a queue 
  //to send to video manager.
  chrome.runtime.sendMessage({greeting: "GivingQueueLinks", queue: tempQueue});

};

$(function() {
  $(".sortable-list").sortable({
    update: sortFinishedHandler, //when user is done sorting, call the handler
    cursorAt: { left: 10}
  });
  $(".sortable-list").disableSelection();
});



//converts a youtube video url to a url that references the thumbnail image 
function urlToThumbail(youtubeUrl){
  let head = "http://img.youtube.com/vi/"
  let tail ="/0.jpg";
  let link = ""
  let numEquals = 0;
  for(i = 0; i < youtubeUrl.length && numEquals < 2; i++){
    if(youtubeUrl[i] == "=" || youtubeUrl[i] == "&"){
      numEquals++;
    } else if(numEquals == 1){
      link+= youtubeUrl[i];
    }
  }
  return head + link + tail;
}


/*
//thumbnail style sheet 
const cssT = `
      height: 75px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 10px;
      position: relative;
      left: 40px;`

//Arrow button style sheet
const upStyle = `
      width: 20px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2px;
      position: relative;
      left: 50px;
      bottom: 44px;`

//Arrow button style sheet
const downStyle = `
      width: 20px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2px;
      position: relative;
      left: 30px;
      bottom: 22px;`
*/