var MINIMUM_LENGTH_OF_KEYWORD_TO_HATE = 3;
var HATED_KEYWORDS_TABLE_TBODY = "#hated-keywords-tbody";
var KEYWORD_TO_HATE_INPUT = "#keyword-to-hate";

var hatedKeywords = [];

$(document).ready(function(){
	$("#hate-new-button").click(function(){
		hateNewKeyword();
	});
	
	$(KEYWORD_TO_HATE_INPUT).keyup(function(event){
		if(event.keyCode == 13){
			hateNewKeyword();
		}
	});
	
	chrome.storage.sync.get("hatedKeywords", function (obj) {
		if(obj !== null && obj.hasOwnProperty('hatedKeywords')){
			var hatedKeywordsJSON = obj['hatedKeywords'];
			hatedKeywords = JSON.parse(hatedKeywordsJSON);
			fillHatedKeywordsTable();
		}
	});
	
	$(HATED_KEYWORDS_TABLE_TBODY).on("click", ".delete-button", function(event){
		var keywordToRemove = $(event.target).attr('data-keyword');
		deleteKeyword(keywordToRemove);
	});
});

function fillHatedKeywordsTable(){
	clearHatedKeywordsTable();
	
	$(hatedKeywords).each(function(i, item){
		var rowHtml = buildTableRowWithKeyword(item);
		addRowToHatedKeywordsTable(rowHtml);
	});
}

function hateNewKeyword(){
	var keywordToHate = $(KEYWORD_TO_HATE_INPUT).val();
	if(canThisKeywordBeHated(keywordToHate)){
		keywordToHate = keywordToHate.toLowerCase();
		var newKeywordRowHtml = buildTableRowWithKeyword(keywordToHate);
		addRowToHatedKeywordsTable(newKeywordRowHtml);
		hatedKeywords.push(keywordToHate);
		saveChanges();
		$(KEYWORD_TO_HATE_INPUT).val('');
	}

}

function clearHatedKeywordsTable(){
	$(HATED_KEYWORDS_TABLE_TBODY).empty();
}

function addRowToHatedKeywordsTable(rowHtml){
	$(HATED_KEYWORDS_TABLE_TBODY).append(rowHtml);
}

function buildTableRowWithKeyword(keyword){
	var rowHtml = '<tr class="keyword-row" data-keyword="' + keyword + '">';
	rowHtml += '<td class="keyword-text-td">' + keyword + '</td>';
	rowHtml += '<td><button data-keyword="' + keyword + '" class="delete-button">delete</button></td>';
	rowHtml += '</tr>';
	return rowHtml;
}

function canThisKeywordBeHated(keyword){
	if(keyword !== '' && keyword!==' ' && keyword.length >= MINIMUM_LENGTH_OF_KEYWORD_TO_HATE){
		return true;
	}
	alert("Keyword cannot be blank and must have at least 3 characters.");
	return false;
}

function deleteKeyword(keyword){
	var indexOfKeywordToRemove = hatedKeywords.indexOf(keyword);
	hatedKeywords.splice(indexOfKeywordToRemove, 1);
	saveChanges();
	fillHatedKeywordsTable();
}

function deleteTableRowWithKeyword(keyword){
	$(".keyword-row").each(function(i, item){
		var rowKeyword = $(item).attr('data-keyword');
		if(rowKeyword == keyword){
			$(item).remove();
		}
	});
}

function saveChanges() {
		// stringify all keywords that we want to hate
		var valueToSave = JSON.stringify(hatedKeywords);

        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'hatedKeywords': valueToSave}, function() {
            // Notify that we saved.
			console.log('Settings saved');
        });
}
