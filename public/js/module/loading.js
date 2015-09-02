define(['jquery'],function ($) {

    function Loading (conf) {
        this.init(conf);
    }
    Loading.prototype = {
        /*
         * 类型: 模块中/页面间
         */
        type: {
            module: "module",
            page: "page"
        },
        /*
         * typeClass的key对应type的value
         */
        typeClass: {
            module: "loading-module",
            page: "loading-page"
        },
        /*
         * {
         * target: $element, 目标节点
         * type: Loading.type,
         * }
         */
        init: function (conf) {
            var config = {
                target: $("body"),
                type: this.type.page
            };
            $.extend(config, conf);
            var $element = $(config.target);
            var typeClass = this.typeClass[config.type];
            if ( !$element.css("position") || $element.css("position") === "static") {
                $element.css("position", "relative");
            }
            var $loading = $element.find(".loading-wrapper");
            if ($loading.length === 0) {
                var html = '<div class="loading-wrapper"><div class="' + typeClass + '"><div class="loading-move">';
                var barClass = '';
                for (var i = 0; i < 360; i = i + 30) {
                    barClass = "loading-bar" + i;
                    html += '<span class="loading-bar ' + barClass + '"></span>';
                }
                html += '</div></div></div>';
                $loading = $(html);
                $loading.hide().appendTo($element);
                this.isHidden = true;
            }
            this.$loading = $loading;
        },
        /*
         * 显示
         */
        show: function () {
            if (this.isHidden) {
                this.$loading.show();
                this.isHidden = false;
            }
        },
        /*
         * 隐藏         
         */
        hide: function () {
            if (!this.isHidden) {
                this.$loading.hide();
                this.isHidden = true;
            }
        }
    };

    return Loading;
});
