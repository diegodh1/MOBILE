$(document).ready(function () {
	var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
    content = screen - header - footer - contentCurrent;
$(".ui-content").height(content);
});