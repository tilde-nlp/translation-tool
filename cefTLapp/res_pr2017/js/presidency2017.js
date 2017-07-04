jQuery(document).ready(function () {
    setHeight();
});

jQuery(window).resize(function () {
    setHeight();
});

function setHeight() {
    if (jQuery('.contain').height() != null) {
        var old_height = jQuery(".contain").height();
        var new_height = (getWindowInnerHeight(38));

        if (old_height < new_height) {
            jQuery('.contain').height(new_height);
        } else {
            jQuery('.contain').height('auto');                   
        }
    }
}

function getWindowInnerHeight(notCount) {
    var myHeight = 0;
    myHeight = jQuery(window).height() - notCount;
    return myHeight;
}
