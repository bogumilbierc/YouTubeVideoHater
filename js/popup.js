var MINIMUM_LENGTH_OF_KEYWORD_TO_HATE = 3;
var HATED_KEYWORDS_TABLE_TBODY = "#hated-keywords-tbody";
var KEYWORD_TO_HATE_INPUT = "#keyword-to-hate";

$(document).ready(function(){
	$("#hate-new-button").click(function(){
		hateNewKeyword();
	});
});

function hateNewKeyword(){
	var keywordToHate = $(KEYWORD_TO_HATE_INPUT).val();
	if(keywordToHate !== '' && keywordToHate!==' ' && keywordToHate.length > MINIMUM_LENGTH_OF_KEYWORD_TO_HATE){
		var newKeywordRowHtml = buildTableRowWithKeyword(keywordToHate);
		addRowToHatedKeywordsTable(newKeywordRowHtml);
	}
}

function addRowToHatedKeywordsTable(rowHtml){
	$(HATED_KEYWORDS_TABLE_TBODY).append(rowHtml);
}

function buildTableRowWithKeyword(keyword){
	var rowHtml = '<tr>';
	rowHtml += '<td>' + keyword + '<td>';
	rowHtml += '<td><button>delete</button><td>';
	rowHtml += '</tr>';
	return rowHtml;
}
