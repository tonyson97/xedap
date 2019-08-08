ajaxify = function(settings) {
	settings = settings || {}
	var linkParent = settings.linkParent || '.pagination'
	var parentContainer = settings.parentContainer || '#MainContent'
	var endlessScrollContainer = settings.endlessScrollContainer || '.EndlessScroll'
	var endlessClickContainer = settings.endlessClickContainer || '.EndlessClick'
	var endlessOffset = settings.endlessOffset || 0
	var ajaxinateContainer = settings.ajaxinateContainer || '.Ajaxinate'
	var ajaxinateLink = settings.ajaxinateLink || '.page a'
	var fade = settings.fade || 'fast'
	var textChange = settings.textChange || 'Đang tải...'
	var linkElem;
	var contentContainer;
	var pageNumber;
	var pageType;
	var action;
	var moreURL;
	$.loadMore = function() {
		if (moreURL.length){
			$.ajax({
				type: 'GET',
				dataType: 'html',
				url: moreURL,
				success: function(data) {
					if (pageType == 'ajax') {
						$(ajaxinateContainer).not('[data-page="'+pageNumber+'"]').hide();
						history.pushState({}, pageNumber, moreURL);
					} else {
						$(linkElem).fadeOut(fade);
					}
					var filteredData = $(data).find(contentContainer);
					$(filteredData).appendTo( $(contentContainer).parent() ).hide().fadeIn(fade);
					awe_lazyloadImage();
					if (pageType == 'endlessScroll') {
						$.endlessScroll();
					} else if (pageType == 'ajax') {
						$.ajaxinationClick();
					} else if (pageType == 'endlessClick') {
						$.endlessClick();
					}
				}
			});
		}
	}
	$.endlessScroll = function() {
		action = 'scroll load resize';
		$(window).on( action, function() {
			contentContainer = endlessScrollContainer;
			moreURL = $(contentContainer+':last-of-type '+linkElem).attr('href');
			pageType = 'endlessScroll';
			$(linkElem).text(textChange);
			if ($(contentContainer+':last-of-type '+linkElem).length){
				var bottom = $( parentContainer ).outerHeight();
				var docTop = ($(document).scrollTop() + $(window).height() + endlessOffset);
				if( docTop > bottom ) {
					$(window).off(action);
					$.loadMore();
				}
			}
		});
	}
	$.endlessClick = function() {
		$(linkElem).on( 'click', function(e) {
			e.preventDefault();
			action = 'click';
			contentContainer = endlessClickContainer;
			moreURL = $(this).attr('href');
			pageType = 'endlessClick';
			$(linkElem).text(textChange);
			$(linkElem).off(action);
			$.loadMore();
		});
	}
	$.ajaxinationClick = function() {
		$(linkElem).on( 'click', function(e) {
			e.preventDefault();
			action = 'click';
			contentContainer = ajaxinateContainer;
			moreURL = $(this).attr('href');
			pageNumber = $(this).attr('data-number');
			pageType = 'ajax';
			if( $(contentContainer+'[data-page="'+pageNumber+'"]').length ) {
				$(contentContainer).not('[data-page="'+pageNumber+'"]').hide();
				$(contentContainer+'[data-page="'+pageNumber+'"]').fadeIn(fade);
				history.pushState({}, pageNumber, moreURL);
			} else {
				$(linkElem).off(action);
				$.loadMore();
			}
			$('html, body').animate({ scrollTop: $(parentContainer).offset().top }, 300 );
		});
	}
	if ( $( endlessClickContainer ).length ) {
		linkElem = linkParent+' a';
		$.endlessClick();
	}
	if ( $( ajaxinateContainer ).length ) {
		linkElem = ajaxinateLink;
		$.ajaxinationClick();
	}
	if ( $( endlessScrollContainer ).length ) {
		linkElem = linkParent+' a';
		$.endlessScroll();
	}

}