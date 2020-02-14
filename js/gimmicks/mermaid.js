/* # mermaid gimmick
 *
 * Create diagrams with [mermaid][mermaid].
 *
 * ## Usage
 *
 *     [gimmick:mermaid](@uml "<mermaid syntax>")
 *
 * ## Options
 *
 * ## Author
 *
 * Copyright 2020 Soichiro SAHARA
 *
 * <https://github.com/sahara3/>
 *
 * ## License
 *
 * Licensed under the [GNU Lesser General Public License][LGPL].
 *
 * [mermaid]: https://github.com/mermaid-js/mermaid
 * [LGPL]: https://www.gnu.org/copyleft/lesser.html
 */
(function ($) {
    'use strict';

    var log = $.md.getLogger();
    var count = 0;

    function generateMermaidTag($links, opt, text) {
        var default_options = {
        };
        var options = $.extend({}, default_options, opt);

        return $links.each(function (i, e) {
            var $this = $(e);
            var data = $this.attr('title');

            var $div = $('<div />').addClass('mermaid').data('id', count)
                .css('visibility', 'hidden').text(data);
            $this.replaceWith($div);
            count++;
        });
    }

    var mermaidGimmick = {
        name: 'mermaid',
        version: $.md.version,
        once: function () {
            log.debug('[mermaid] gimmick once');
            $.md.linkGimmick(this, 'mermaid', generateMermaidTag);
            $.md.registerScript(this, '', {
                license: 'LGPL',
                loadstage: 'postgimmick',
                finishstage: 'all_ready'
            });
        },
        load: function () {
            log.debug('[mermaid]: gimmick load');
            $.md.stage('postgimmick').subscribe(function (done) {
                log.debug('[mermaid] postgimmick');

                // load mermaid.js script.
                var script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/mermaid@8.4.6/dist/mermaid.min.js');
                script.onload = function () {
                    log.debug('[mermaid] script onload event');
                    /* global mermaid */
                    mermaid.mermaidAPI.initialize({
                        // logLevel: 1,
                        startOnLoad: false,
                    });

                    $('.mermaid').each(function (i, e) {
                        var $this = $(e);
                        var id = '--md-mermaid-' + $this.data('id');
                        var text = $this.text();

                        var svg = mermaid.mermaidAPI.render(id, text, undefined, $this[0]);
                        $this.html(svg).css('visibility', 'visible');
                    });
                };
                document.body.appendChild(script);

                done();
            });
        }
    };

    $.md.registerGimmick(mermaidGimmick);

}(jQuery));
