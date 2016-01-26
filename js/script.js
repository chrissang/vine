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
		//console.log(win);

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

		//Underscore template
		var compiled = _.template($('#issues_template').html());

		for (var i = startingIndex; i < win.issuesArray.length; i++) {
			counter++

			// Get Output
			var output = getOutput(win.issuesArray[i]);

			// Display Results
			var d = compiled({items:output});

			$('#results').append(d);

			// Limit results per page
			if (counter == 25) {
				break;
			} 
		};
		$('li').click(function(event) {

			var detailItems = [
				{
					detail_issue_title: win.issuesArray[$(this).index()].title,
					detail_issue_state: win.issuesArray[$(this).index()].state,
					detail_issue_labels: getLabels(win.issuesArray[$(this).index()].labels),
					detail_issue_user_name: win.issuesArray[$(this).index()].user.login,
					detail_issue_user_avatar_url: win.issuesArray[$(this).index()].user.avatar_url,
					detail_issue_full_body: win.issuesArray[$(this).index()].body,
					detail_issue_comments_number: win.issuesArray[$(this).index()].comments,
					detail_issue_comments_url: getComments(win.issuesArray[$(this).index()].comments_url)
				}
			]
			//console.log(win.issuesArray[$(this).index()]);
			//console.log(detailItems);
			sessionStorage.setItem('details', JSON.stringify(detailItems));
			
			window.open('details.html');
		});

		counter = 0;
		},
		getDetailOutput: function () {
			console.log('getDetailOutput');
			var dataDetails = sessionStorage.getItem('details');
			var viewData = $.parseJSON(dataDetails);

			var dataDetailComments = sessionStorage.getItem('detailComments');
			var viewDataDetailComments = $.parseJSON(dataDetailComments);
			console.log(viewDataDetailComments);
			//console.log(viewData);
			//console.log(viewData[0].detail_issue_comments_url);

			var compiledDetails = _.template($('#details_template').html());
			var details = compiledDetails({items:viewData});

			$('#details').append(details);
		}
	};

	function getComments(url){
		$.get(
		url,{
		q: q},
		function(data){
			var comments = [];
			for (var i = 0; i < data.length; i++) {
				//console.log(data[i].body);	
				comments.push(data[i].body);
			}
			//console.log(comments);
			sessionStorage.setItem('detailComments', JSON.stringify(comments));
			//return comments;
		});
	}

	// Build Output
	function getOutput(item){

		var items = [
			{
				issue_number: item.number,
				issue_title: item.title,
				issue_labels: getLabels(item.labels),
				user_name: item.user.login,
				user_avatar_url: item.user.avatar_url,
				body: charlimit(item.body)
			}
		]
		return items;		
	}
	
	// Get first 140 characters of the body
	function charlimit(str) {
		if (str.length > 140) {
	    	str = str.substring(0, 140);
	    	str = str.substr(0, Math.min(str.length, str.lastIndexOf(" "))) + " ...";
	    	return str;
		}
	}

	// Get labels
	function getLabels(labels) {
		if (labels.length > 0) {
			var labelArray = [];
			for (var i = 0; i < labels.length; i++) {
				//console.log(labels[i].name);	
				labelArray.push(labels[i].name);
			}
			return labelArray;
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

