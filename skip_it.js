chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "HateThisVideo")
		waitTillPageLoadesAndSkipAnnoyingSongs();
      //sendResponse({farewell: "goodbye"});
  });

waitTillPageLoadesAndSkipAnnoyingSongs();
  
function waitTillPageLoadesAndSkipAnnoyingSongs(){
	console.log("Setting timeout");
	window.setTimeout(skipAnnoyingSongs, 3000);	
}

function skipAnnoyingSongs(){	
	console.log('executing');
	var songTitle = $("#watch-headline-title h1.watch-title-container span.watch-title").text();
	var title = songTitle.toLowerCase();

	var keywordsToSkip = 
	[
	'bieber',
	'meghan trainor'
	];

	var songShouldBeSkipped = false;

	$(keywordsToSkip).each(function(i, item){
		if(title.indexOf(item) !== -1){
			songShouldBeSkipped = true;
		}
	});

	if(songShouldBeSkipped){
		console.log("---- CONTROLS ----");
		var controls = $(".ytp-chrome-controls");
		console.log(controls);
		console.log("---- END CONTROLS ----");
		
		console.log("---- LEFT CONTROLS ----");
		var leftControls = $(".ytp-chrome-controls .ytp-left-controls");
		console.log(leftControls);
		console.log("---- END LEFT CONTROLS ----");
		
		console.log("---- NEXT BUTTON ----");
		var nextButton = $(".ytp-chrome-controls .ytp-left-controls .ytp-next-button");
		console.log(nextButton);
		console.log("---- NEXT BUTTON ----");
		
		
		var nextSongUrl = $(nextButton).attr('href');
		console.log(nextSongUrl);
		console.log("this song should be skipped to url: " + nextSongUrl);
		chrome.runtime.sendMessage({redirect: nextSongUrl});
	}else{
		console.log("this song is absolutely ok");
	}
}
