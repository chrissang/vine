function search(){
	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	// Run GET Request on API
	$.get(
		"https://api.github.com/repos/npm/npm/issues",{
		q: q},
		function(data){

			console.log(data);

			$.each(data, function(i, item){
				// console.log(item);
				var output = getOutput(item);
			});
		}
	);
}

search();

// Next Page Function
function nextPage(){
	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	
	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyBknbsUfzaw5EBPn-uYV1URQhGXGCvljXs'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;
				
				// Log Data
				console.log(data);
				
				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);
					
					// Display Results
					$('#results').append(output);
				});
				
				var buttons = getButtons(prevPageToken, nextPageToken);
				
				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}


// Prev Page Function
function prevPage(){
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	
	// Get Form Input
	q = $('#query').val();
	
	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyBknbsUfzaw5EBPn-uYV1URQhGXGCvljXs'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;
				
				// Log Data
				console.log(data);
				
				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);
					
					// Display Results
					$('#results').append(output);
				});
				
				var buttons = getButtons(prevPageToken, nextPageToken);
				
				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}

// Build Output
function getOutput(item){
	var issue_number = item.number;
	var issue_title = item.title;
	var issue_labels = item.labels;
	var user_name = item.user.login;
	var user_avatar_url = item.user.avatar_url;
	console.log(item.body);

	
}

// Build the buttons
function getButtons(prevPageToken, nextPageToken){
	if(!prevPageToken){
		var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>' +
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}
	
	return btnoutput;
}







