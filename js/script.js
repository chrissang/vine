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

		var total_number_issues = win.issuesArray.length;
		var number_pages = Math.ceil(total_number_issues/25);

		modularpattern.displayPages(1);
		showPagingButtons(number_pages);

		$('.paging-button').click(function(event) {
			modularpattern.displayPages($(this).text());
			
			$('.paging-button').removeClass("paging-button-active");
			
			$(this).addClass("paging-button-active");
		});
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
			counter = 0;

			// Click function to launch detail page of issue clicked
			$('li').click(function(event) {
				//console.log(win.issuesArray[$(this).index()+startingIndex].user.login);
				//console.log(win.issuesArray[$(this).index()]);
				//console.log(startingIndex);
				
				console.log(win.issuesArray);
				//console.log(win.issuesArray.length);
				//console.log(win.issuesArray[$(this).index()]);
				console.log($(this).index());

				var detailItems = [
					{
						detail_issue_title: win.issuesArray[$(this).index()+startingIndex].title,
						detail_issue_state: win.issuesArray[$(this).index()+startingIndex].state,
						detail_issue_labels: getLabels(win.issuesArray[$(this).index()+startingIndex].labels),
						detail_issue_user_name: win.issuesArray[$(this).index()+startingIndex].user.login,
						detail_issue_user_avatar_url: win.issuesArray[$(this).index()+startingIndex].user.avatar_url,
						detail_issue_full_body: win.issuesArray[$(this).index()+startingIndex].body,
						detail_issue_comments_number: win.issuesArray[$(this).index()+startingIndex].comments,
						detail_issue_comments_url: getComments(win.issuesArray[$(this).index()+startingIndex].comments_url)
					}
				]

				var dataDetailComments = sessionStorage.getItem('detailComments');
				var viewDataDetailComments = $.parseJSON(dataDetailComments);

				detailItems[0].detail_issue_comments = viewDataDetailComments;

				//Stores data of issue clicked to display on details page
				sessionStorage.setItem('details', JSON.stringify(detailItems));
				
				window.open('details.html');
			});
		},
		// Gets stored data to display on details page
		getDetailOutput: function () {
			var compiledDetails = _.template($('#details_template').html());
			var dataDetails = sessionStorage.getItem('details');
			var viewData = $.parseJSON(dataDetails);
			var details = compiledDetails({items:viewData});

			$('#details').append(details);
		}
	};
	// Get comments
	function getComments(url){
		$.ajax({ 
		url: url, 
		async: false,
		dataType: 'json',
			success: function(data) {
				var comments = [];
				for (var i = 0; i < data.length; i++) {
					comments.push(
						{
							commentName: data[i].user.login,
							commentAvatar: data[i].user.avatar_url,
							commentUserLink: data[i].user.html_url,
							commentBody: data[i].body
						}
					);
				}
				sessionStorage.setItem('detailComments', JSON.stringify(comments));
			}
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
				labelArray.push(labels[i].name);
			}
			return labelArray;
		}
	}

	// Build the buttons
	function showPagingButtons(pages){
		var totalPages = {
			pages: pages
		}
		var compiledPagingButtons = _.template($('#pagingButtons_template').html());
		var buttons = compiledPagingButtons({items:totalPages});
		$('#buttons').append(buttons);
	}
})();

