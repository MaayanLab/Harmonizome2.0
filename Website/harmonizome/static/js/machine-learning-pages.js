/* Utility functions for the machine learning pages.
 * -------------------------------------------------
 */

HARMONIZOME.setupDataTable = function(probabilityColumnIdx) {

	var $table = $('.data-table').first();
	
	var config = {
        bPaginate: true,
        // The DataTables API does not appear to let you sort a column by its
        // name. Just pass in the appropriate probability column index to
        // sort all ML tables by probability.
        order: [[ probabilityColumnIdx, "desc" ]],
        iDisplayLength: 100,
        oLanguage: {
            sSearch: "Filter"
        },
        fnInitComplete: function() {
        	$table.fadeIn();
        }
    };

	$table.DataTable(config);
};
