/* Utility functions for dataset pages.
 * ------------------------------------
 */

HARMONIZOME.datasetPage = {
		
	setupDataTable: function() {
		var $table = $('.data-table').first();
		
		var config = {
	        bPaginate: true,
	        bSort: true,
	        iDisplayLength: 20,
	        oLanguage: {
	            sSearch: "Filter"
	        },
	        fnInitComplete: function() {
	        	$table.fadeIn();
	        }
	    };

		$table.dataTable(config);
	},
	
	trackDownloads: function(url) {
		$('#download-links').click(function(evt) {
			var downloadId = $(evt.target).attr('download-id');
			$.ajax({
				method: 'POST',
				url: url,
				data: {
					downloadId: downloadId
				}
			});
		});
	}
};
