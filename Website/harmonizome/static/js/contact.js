$(function() {
	
	var validators = [
        {
        	isValid: function() {
        		var selection = $('select :selected').val();
        		return (selection !== 'Please select a topic');
        	},
        	getLabelElem: function() {
        		return $('label[for="topic"] span');
        	}
        },
	    {
	    	isValid: function() {
	    		var email = $('input[name="email"]').val();
	    		return isValidEmail(email);
	    	},
	    	getLabelElem: function() {
	    		return $('label[for="email"] span');
	    	}
	    },
	    {
	    	isValid: function() {
	    		var userMessage = $('textarea').val();
	    		return isNotEmptyMessage(userMessage);
	    	},
	    	getLabelElem: function() {
	    		return $('label[for="details"] span');
	    	}
	    }
	];

	$('#contact-form-btn').click(function(evt) {
		$.each(validators, function(i, obj) {
			if (!obj.isValid()) {
				evt.preventDefault();
				showRequiredTag(obj.getLabelElem());
			} else {
				removeRequiredTag(obj.getLabelElem());
			}
		});
	});
	
	function isValidEmail(email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	}
	
	function isNotEmptyMessage(message) {
		return /\S/.test(message);
	}
	
	function showRequiredTag($el) {
		$el.removeClass('hidden');
	}
	
	function removeRequiredTag($el) {
		$el.addClass('hidden');
	}
});