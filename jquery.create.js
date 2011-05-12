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

	// puede llamarse sobre los elementos creados con .innerHTML o otros metodos externos a jquery
	$.fn.triggerCreateEvent = function ()
	{
		var $elem = this;

		var numSelectors = selectors.length;
//			console.log("checking selectors");
		for( var x=0; x<numSelectors; x++ )
		{
//					console.log("checking selector:",selectors[x],elem);
			if( $elem.is(selectors[x]) )
			{
				// double check to make sure the event hasn't already fired.
				// can happen with wrap()
				if( !$.data( $elem, "jqcreateevt") )
				{
					$.data($elem, "jqcreateevt", true);
				 	$.event.trigger("create", {}, $elem);
				}
			}

			$elem.find(selectors[x]).each(function()
			{
				// double check to make sure the event hasn't already fired.
				// can happen with wrap()
				if( !$.data( this, "jqcreateevt") )
				{
					$.data(this, "jqcreateevt", true);
				 	$.event.trigger("create", {}, this);
				}

			});

		}

	}

	// deal with 99% of DOM manip methods
	$.fn.domManip = function( args, table, callback )
	{
		var true_callback = callback;

		///////////////////////////////////////

		arguments[2] = function (elem)
		{
			// [this] es el objeto sobre el que se esta haciendo el append, html, etc...  y [elem] es el item 'creado'

			//alert("stop callback");


			// aplicamos el callback, para que termine de hacer el append o lo que sea y el selector funcione correctamente
			//   (ej. si el selector es ".parentclass > .childclass", y estamos haciendo append de un nodo .childclass dentro
			//     de un nodo .parentclass, no cumple el selector hasta que se hace efectivo el append)
			var ret = true_callback.apply(this,arguments);


			$(elem).triggerCreateEvent();

/*
			var numSelectors = selectors.length;
//			console.log("checking selectors");
			for( var x=0; x<numSelectors; x++ )
			{
//					console.log("checking selector:",selectors[x],elem);
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

					$(elem).find(selectors[x]).each(function()
					{
						// double check to make sure the event hasn't already fired.
						// can happen with wrap()
						if( !$.data( this, "jqcreateevt") )
						{
							$.data(this, "jqcreateevt", true);
						 	$.event.trigger("create", {}, this);
						}

					});

			}
*/

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
