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
					detail_issue_labels: win.issuesArray[$(this).index()].labels,
					detail_issue_user_name: win.issuesArray[$(this).index()].user.login,
					detail_issue_user_avatar_url: win.issuesArray[$(this).index()].user.avatar_url,
					detail_issue_full_body: win.issuesArray[$(this).index()].body,
					detail_issue_full_comments: win.issuesArray[$(this).index()].comments
				}
			]
			// console.log($(this).index());
			console.log(win.issuesArray[$(this).index()]);
			// console.log(win.issuesArray[$(this).index()].title);
			// console.log(win.issuesArray[$(this).index()].state);
			// console.log(win.issuesArray[$(this).index()].labels);
			// console.log(win.issuesArray[$(this).index()].user.login);
			// console.log(win.issuesArray[$(this).index()].user.avatar_url);
			// console.log(win.issuesArray[$(this).index()].body);
			// console.log(win.issuesArray[$(this).index()].comments);

			
			//window.open(location);
			var popup = window.open('details.html');
			$(popup.document).load(function() {
    			console.log(('loaded'));
    			// do other things
			});
			//modularpattern.displayDetailPages(detailItems);
		});

		counter = 0;
		}
	};

	// Build Output
	function getOutput(item){

		var items = [
			{
				issue_number: item.number,
				issue_title: item.title,
				issue_labels: item.labels,
				user_name: item.user.login,
				user_avatar_url: item.user.avatar_url,
				body: charlimit(item.body)
			}
		]
		return items;		
	}

	// Build Output
	function getDetailOutput(){

		
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

$(document).ready(function() {
    $('#list_item').click(function() {
        alert("Hello");
    })
});

