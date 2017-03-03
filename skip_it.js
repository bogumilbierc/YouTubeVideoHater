chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "HateThisVideo"){
		waitTillPageLoadesAndSkipAnnoyingSongs();
	}
  });

waitTillPageLoadesAndSkipAnnoyingSongs();
  
function waitTillPageLoadesAndSkipAnnoyingSongs(){
	window.setTimeout(skipAnnoyingSongs, 1000);	
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
		var nextButton = $(".ytp-chrome-controls .ytp-left-controls .ytp-next-button");
		
		if(nextButton != null && nextButton != undefined){
			var nextSongUrl = $(nextButton).attr('href');
			chrome.runtime.sendMessage({redirect: nextSongUrl});
		}else{
			waitTillPageLoadesAndSkipAnnoyingSongs();
		}
	}
}
