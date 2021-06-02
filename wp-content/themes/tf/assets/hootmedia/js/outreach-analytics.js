/**
 * Outreach analytics page js part
 * @author sabri taieb
 * @link https://delabon.com
 */
(function($){

    if( ! HOOT.body.hasClass('outreach-analytics') ) return;

    var analytics_el = $('#hoot-analytics');

    if( ! analytics_el.length ) return;
    
    /**
     * Add Ordinal Suffix
     * ex: 1st 2nd 3rd 4th 5th 6th 7th
     *
     * @param {int} num
     * @return {string}
     */
    function addOrdinalNumberSuffix( num ){
        if( ! ( (num % 100) === 11 || (num % 100) === 12 || (num % 100) === 13 ) ){
            switch (num % 10) {
                // Handle 1st, 2nd, 3rd
                case 1:  return num + 'st';
                case 2:  return num + 'nd';
                case 3:  return num + 'rd';
            }
        }
        return num + 'th';
    }

    // Add ordinal suffix
    var i = 1;
    $('.performance-panel__single:not(.__hidden) .counter').each(function(){
        $(this).text( addOrdinalNumberSuffix(i) );
        i += 1;
    });

    // Active class to first item counter
    $('.performance-panel__single:not(.__hidden):first .counter').addClass('active');
    
    /**
     * Ajax: Get analytics
     */
    function hoot_analytics (){

        $.post(
            HOOT_PARAMS.ajaxurl, 
            {
                action: 'hoot_get_analytics',
                nonce: HOOT_PARAMS.nonce,
            }, 
            function(response){
                // do nothing on error
            }
        );
    }
    
    HOOT.doc.ready(function(){
        hoot_analytics();
    });

    /**
     * View graphs
     */
    function viewGraphs(){

        var showGraph = $('.hoot-analytics-view-graph').hasClass('active');
        var view = $('.hoot-analytics-view-select').val();

        if( showGraph ){

            if( view === 'all' ){
                $('.hoot-analytics-chart-wrapper').removeClass('__hidden');
            }
            else{
                $('.hoot-analytics-chart-wrapper').addClass('__hidden');
                $('.hoot-analytics-chart-wrapper[data-slug="'+view+'"]').removeClass('__hidden');
            }
        }
        else{
            $('.hoot-analytics-chart-wrapper').addClass('__hidden');
        }
    }

    /**
     * Analytics view
     */
    $('.hoot-analytics-view-select').on('change', function(e){

        var view = $(this).val();

        if( view === 'all' ){
            $('.performance-panel__single').removeClass('__hidden');
        }
        else{
            $('.performance-panel__single').addClass('__hidden');
            $('.performance-panel__single[data-social="'+view+'"]').removeClass('__hidden');
        }

        $('.performance-panel__single .counter').removeClass('active');
        $('.performance-panel__single:not(.__hidden):first .counter').addClass('active');

        // Add ordinal suffix
        var i = 1;
        $('.performance-panel__single:not(.__hidden) .counter').each(function(){
            $(this).text( addOrdinalNumberSuffix(i) );
            i += 1;
        });

        viewGraphs();
    });

    /**
     * View graph
     */
    $('.hoot-analytics-view-graph').on('click', function(e){
        e.preventDefault();

        var $this = $(this);

        $this.toggleClass('active');

        if( $this.hasClass('active') ){
            $this.text('Hide Graph');
        }
        else{
            $this.text('Show Graph');
        }

        viewGraphs();
    });

    /**
     * Chart.js wrapper
     */
    var ChartClass = function( args ){

        this.selector = args.selector || null;
        this.labels = args.labels || null;
        this.datasets = args.datasets || null;
        this.slug = args.slug || null;

        if( ! this.selector ) return new Error('No selector.');
        if( ! this.labels ) return new Error('No charts labels');
        if( ! this.datasets ) return new Error('No charts datasets');
        if( ! this.slug ) return new Error('No charts slug');

        this.$ = {};
        this.$.selector = $(this.selector);
        
        if( ! this.selector.length ) return new Error('No selector found('+this.selector+').');

        this.$.canvas = this.$.selector.find('canvas');
        this.ctx = this.$.canvas.get(0).getContext("2d");

        // fill with gradient
        this.gradientFill = this.ctx.createLinearGradient(0, 750, 0, 200);
        this.gradientFill.addColorStop(0, "#fff");
        this.gradientFill.addColorStop(1, "#dff1f1");

        this.config = {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: this.prepareDatasets(),
            },
            options: {
                // Hide the dataset legend/label at the top
                legend: {
                    display: false
                },
                // Make responsive
                responsive: true,
                // Hide title
                title: {
                    display: false,
                },
                hover: {
                    mode: 'index',
                    intersect: false,
                },
                                // Tooltips
                tooltips: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    position: 'custom',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    titleFontFamily: "'Mark Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    titleFontStyle: 'normal',
                    titleFontColor: '#110F11',
                    bodyFontFamily: "'Mark Pro', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    bodyFontStyle: 'normal',
                    bodyFontColor: '#110F11',
                    xAlign: 'center',
                    xPadding: 10,
                    yPadding: 7,
                    caretPadding: 0,
                    caretSize: 0,
                    cornerRadius: 8,
                    displayColors: false,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3,
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    callbacks: {
                        title: function (title, object)
                        {
                            return '';
                        },
                        body: function (title, object)
                        {
                            return '';
                        },
                        beforeBody: function (title, object)
                        {
                            return '';
                        },
                        afterBody: function (title, object)
                        {
                            return '';
                        },
                        label: function(item, data) {
                            var label = data.datasets[item.datasetIndex].tooltipLabel;
                            var value = data.datasets[item.datasetIndex].data[item.index];

                            return value + ' ' + label;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                            drawBorder: true,
                            color: '#dcdada',
                            lineWidth: 1
                        },
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: CHART_X_MAX_TICKS ? CHART_X_MAX_TICKS : 11, // default 11
                            beginAtZero: true,
                            fontColor: '#110f11',
                            fontFamily: "'MarkPro', 'Arial', sans-serif"
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#110f11',
                            fontFamily: "'MarkPro', 'Arial', sans-serif",
                            callback: function (label, index, labels)
                            {
                                return label;
                            }
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Value'
                        }
                    }]
                }
            },
        };

        this.$.selector.attr('data-slug', this.slug );
        this.chart = new Chart(this.ctx, this.config);
    }

    ChartClass.prototype.prepareDatasets = function(){

        var datasets = [];

        for( var key in this.datasets ){
            var dataset = this.datasets[key];
            datasets.push(dataset);
        }

        return datasets;
    }
    
    /**
     * Charts show time
     */
    $(window).load(function(){

        // customize grid line on data point hover
        var originalLineDraw = Chart.controllers.line.prototype.draw;
        Chart.helpers.extend(Chart.controllers.line.prototype, {
            draw: function() {
                originalLineDraw.apply(this, arguments);
                var chart = this.chart;
                var ctx = chart.chart.ctx;
    
                if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
                    var activePoint = this.chart.tooltip._active[0];
                    var ctx = this.chart.ctx;
                    var x = activePoint.tooltipPosition().x;
                    var y = activePoint.tooltipPosition().y + 10;
                    var topY = this.chart.scales['y-axis-0'].top;
                    var bottomY = this.chart.scales['y-axis-0'].bottom;
        
                    if(bottomY - y > 10) {
                        // draw line
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, bottomY);
                        ctx.lineWidth = 0.5;
                        var gradient = ctx.createLinearGradient(0, 420, 0, 0);
                        gradient.addColorStop(0, "#dff1f1");
                        gradient.addColorStop(1, "#00676b");
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        });

        // custom positioner for tooltips
        Chart.Tooltip.positioners.custom = function(elements, position) {
            var x = elements[0]._view.x;
            var y = elements[0]._view.y;

            if (!elements.length) {
                return false;
            }

            var offsetY = 0;
            if (y < 50) {
                offsetY = 10;
            } else {
                offsetY = -30;
            }

            return {
                x: x,
                y: y + offsetY
            }
        }
        
        // Init all charts
        var allChars = {};
        for( var key in HOOT_ANALYTICS_DATA ){
    
            var chartData = HOOT_ANALYTICS_DATA[key];
            
            allChars[key] = new ChartClass({
                selector: '.hoot-analytics-chart-wrapper[data-id="'+key+'"]',
                labels: chartData.labels,
                datasets: chartData.datasets,
                slug: chartData.slug,
            });
    
            if( allChars[key] instanceof Error ){
                console.error(allChars[key]);
            }
        }
    });

    // Fancybox
    $('[data-fancybox="socials"]').fancybox({
        afterClose: function(){
            this.$content.show(0);
        },
        thumbs: {
            autoStart: true,
            axis: 'x'
        },
        'autoScale': true,
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'speedIn': 500,
        'speedOut': 300,
        'autoDimensions': true,
        'centerOnScroll': true,
    });
    
})(jQuery);
