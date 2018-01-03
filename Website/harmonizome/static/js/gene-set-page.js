/* Utility functions for gene set pages.
 * -------------------------------------
 */

HARMONIZOME.setupDataTable = function(isContinuousValued) {

	var $tableUp = $('.data-table').eq(0),
		$tableDown = $('.data-table').eq(1);
	
	setup($tableUp, true);
	if ($tableDown.length) {
		setup($tableDown, false);
	}
	
	function setup($table, sortDesc) {
		var config = {
	        bPaginate: true,
	        bSort: false,
	        iDisplayLength: 20,
	        oLanguage: {
	            sSearch: "Filter"
	        },
	        fnInitComplete: function() {
	        	if (isContinuousValued) {
	        		var $th = $table.find('thead th').eq(2);
	        		$th.append(' <span class="glyphicon glyphicon-question-sign"></span>');
	        		var $span = $th.find('span');
	        		$span.attr('data-toggle', 'tooltip');
	        		$span.attr('title', 'Indicates the relative strength of the functional associations. Standardized values are related to empirical p-values as abs(standardized value) = -log10(p-value) and are only available for initially continuous-valued datasets.');
	        		$span.tooltip();
	        	}
	        	$table.fadeIn();
	        }
	    };
		
		$table.dataTable(config);
	}
};
