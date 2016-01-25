var modularpattern = (function () {
	// Clear Results
	$('#results').html('');
	$('#buttons').html('');
	this.issuesArray = [];
	// Get Form Input
	q = $('#query').val();
	// Run GET Request on API
	var win = this;
	$.get(
		"https://api.github.com/repos/npm/npm/issues",{
		q: q},
		function(data){
			var issues = [];
			$.each(data, function(i, item){
				issues.push(item);
			});
		win.issuesArray = issues;
		console.log(win);
		var total_number_issues = win.issuesArray.length;
		var number_pages = Math.ceil(total_number_issues/25);
		modularpattern.displayPages(1);
		showPagingButtons(number_pages);
	});
	
	return {
		displayPages: function (page_number) {

		var counter = 0;
		var startingIndex = (page_number - 1) * 25;
		$('#results').html("");

		for (var i = startingIndex; i < win.issuesArray.length; i++) {
			counter++

			// Get Output
			var output = getOutput(win.issuesArray[i]);

			// Display Results
			$('#results').append(output);

			if (counter == 25) {
				break;
			} 
		};
		counter = 0;
		}
	};

	// Build Output
	function getOutput(item){
		var issue_number = item.number;
		var issue_title = item.title;
		var issue_labels = item.labels;
		var user_name = item.user.login;
		var user_avatar_url = item.user.avatar_url;
		var body = charlimit(item.body);

		//Build Output String
		var output = '<a>' + 
		'<li>' +
		'<div class="list-left">' +
		'<h3>'+user_name+'</h3>' +
		'<img src="'+user_avatar_url+'">' +
		'</div>' +

		'<div class="list-right">' +
		'<h3>'+issue_title+'</h3>' +
		'<small>Issue Number: '+issue_number+'</small><br/>' +
		'<small>Labels: '+issue_labels+'</small><br/>' +
		'<small>Issue: '+body+'</small><br/>' +
		'</div>' +
		'</li>' +
		'</a>' +
		'<div class="clearfix"></div>' +
		'';
		
		return output;
	}

	// Build Output
	function getDetailOutput(item){
		var issue_title = item.title;
		var issue_labels = item.labels;
		var user_name = item.user.login;
		var user_avatar_url = item.user.avatar_url;
		var body = item.body;
		var state = item.state;

		console.log(user_name);

		//Build Output String
		// var detailOutput = '<li>' +
		// '<div class="list-left">' +
		// '<h3>'+user_name+'</h3>' +
		// '<img src="'+user_avatar_url+'">' +
		// '</div>' +

		// '<div class="list-right">' +
		// '<h3>'+issue_title+'</h3>' +
		// '<small>State: '+state+'</small><br/>' +
		// '<small>Labels: '+issue_labels+'</small><br/>' +
		// '<small>Issue: '+body+'</small><br/>' +
		// '</div>' +
		
		// '<div class="clearfix"></div>' +
		// '';
		
		// return detailOutput;
	}
	
	// Get first 140 characters of the body
	function charlimit(str) {
		if (str.length > 140) {
	    	str = str.substring(0, 140);
	    	str = str.substr(0, Math.min(str.length, str.lastIndexOf(" "))) + " ...";
	    	return str;
		}
	}

	// Build the buttons
	function showPagingButtons(pages){
		for (var i = 1; i <= pages; i++) {
			var buttons = '<div>'+'<button class="paging-button" onclick="modularpattern.displayPages('+i+')">'+i+'</button></div>';
			$('#buttons').append(buttons);
		};
	}
})();

