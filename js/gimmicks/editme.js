(function ($) {
    'use strict';
    var editmeGimmick = {
        name: 'editme',
        once: function () {
            $.md.linkGimmick(this, 'editme', editMe);
        },
    };
    $.md.registerGimmick(editmeGimmick);

    function editMe($links, opt, text) {
        text = text || 'Edit this page';
        var page = opt.page || 'mdwiki-editor.html';
        var target = opt.target || $.md.mainHref;
        var params = $.param({
            m: opt.method || 'POST',
            a: opt.action || '.',
        });
        return $links.each(function (i, link) {
            $(link)
                .text(text)
                .attr('href', page + '?' + params + '#!' + target)
                .addClass('editme')
                .prepend('<i class="material-icons" style="font-size:15px; margin-right: 2px;">edit</i> ');
        });
    }
}(jQuery));
