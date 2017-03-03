chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "HateThisVideo"){
		waitTillPageLoadesAndSkipAnnoyingSongs();
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
        init();
});

init();

var keywordsToSkip = [];

function init(){
	getKeywordsToHateAndProceedWithPageAnalysis();	
}

function getKeywordsToHateAndProceedWithPageAnalysis(){
	chrome.storage.sync.get("hatedKeywords", function (obj) {
		if(obj !== null && obj.hasOwnProperty('hatedKeywords')){
			var hatedKeywordsJSON = obj['hatedKeywords'];
			keywordsToSkip = JSON.parse(hatedKeywordsJSON);
		}
		waitTillPageLoadesAndSkipAnnoyingSongs();
	});
}
 
function waitTillPageLoadesAndSkipAnnoyingSongs(){
	window.setTimeout(skipAnnoyingSongs, 1000);	
}

function skipAnnoyingSongs(){	
	
	var title = getVideoTitle();
	var videoShouldBeSkipped = checkIfVideoShouldBeSkipped(title);

	if(videoShouldBeSkipped){
		var nextButton = $(".ytp-chrome-controls .ytp-left-controls .ytp-next-button");
		
		if(nextButton != null && nextButton != undefined){
			var nextSongUrl = $(nextButton).attr('href');
			chrome.runtime.sendMessage({redirect: nextSongUrl});
		}else{
			waitTillPageLoadesAndSkipAnnoyingSongs();
		}
	}
}

/**
Returns title of YouTube video. Title is in lowerCase.
**/
function getVideoTitle(){
	var videoTitle = $("#watch-headline-title h1.watch-title-container span.watch-title").text();
	return videoTitle.toLowerCase();
}

/**
Checks whether Video of given title should be skipped.
**/
function checkIfVideoShouldBeSkipped(title){
	var videoShouldBeSkipped = false;

	$(keywordsToSkip).each(function(i, item){
		if(title.indexOf(item.toLowerCase()) !== -1){
			videoShouldBeSkipped = true;
		}
	});
	
	return videoShouldBeSkipped;
}
