/* Utility functions for the analytics page.
 * -----------------------------------------
 */

HARMONIZOME.setupDataTable = function() {

	var $table = $('.data-table');
	
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
};
