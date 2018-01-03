/* Utility functions for the search result pages.
 * ----------------------------------------------
 */

HARMONIZOME.setupDataTable = function() {

	var $table = $('.data-table').first();
	
	var config = {
        bPaginate: true,
        bSort: false,
        iDisplayLength: 20,
        oLanguage: {
            sSearch: "Filter"
        },
        fnInitComplete: function() {
        	$table.fadeIn();
        }
    };

	$table.dataTable(config);
};
