/* Utility functions for the download page.
 * ----------------------------------------
 */

setupDataTable = function() {

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
};
