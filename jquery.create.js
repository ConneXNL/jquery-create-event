// based in pluggin by eric hynds (erichynds.com)
// that was updated to support text nodes by hans oksendahl (hansoksendahl.com)
// http://www.erichynds.com/jquery/jquery-create-event/
// full rewrite by Emilio Llamas (yumok@yahoo.com)
// version 1.5 - 5/10/2011

(function($, _domManip, _html){
	var selectors = [], gen = [], guid = 0, old = {};

	$.event.special.create = {
		add: function( data ){
			selectors.push( data.selector );
		},

		// won't fire in 1.4.2 http://dev.jquery.com/ticket/6202
		remove: function( data ){
			var len = selectors.length;

			while( len-- ){
				if( selectors[len] === data.selector ){
					selectors.splice(len, 1);
					break;
				}
			}
		}
	};

	// deal with 99% of DOM manip methods
	$.fn.domManip = function( args, table, callback )
	{
		var true_callback = callback;

		///////////////////////////////////////

		arguments[2] = function (elem)
		{
			//alert("stop callback");

			var ret = true_callback.apply(this,arguments);

			var numSelectors = selectors.length;
			if( !$.data( elem, "jqcreateevt") )
			{
//				console.log("checking selectors");
				for( var x=0; x<numSelectors; x++ )
				{
//						console.log("checking selector:",selectors[x],elem);
						if( $(elem).is(selectors[x]) )
						{
							// double check to make sure the event hasn't already fired.
							// can happen with wrap()
							if( !$.data( elem, "jqcreateevt") )
							{
								$.data(elem, "jqcreateevt", true);
							 	$.event.trigger("create", {}, elem);
							}
						}

				}
			}

			return ret;
		};

		///////////////////////////////////////

		return _domManip.apply( this, arguments );
	};

	// deal with the remaining 1% (html method)
	$.fn.html = function( value )
	{

		// if no create events are bound, html() is being called as a setter,
		// or the value is a function, fire the original and peace out.  only string values use innerHTML;
		// function values use append() which is covered by $.fn.domManip
		if( !selectors.length || $.isFunction(value) || typeof value === "undefined" || !value.length ){
			return _html.apply( this, arguments );
		}

		// me salto el paso de intentar usar innerHTML... por lo que saltara el domanip
		//console.log("saltando innerHTML:",value);
		this.empty().append( value );
		return this;

	};


})(jQuery, jQuery.fn.domManip, jQuery.fn.html);

