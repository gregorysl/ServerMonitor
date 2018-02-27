/*!
 * jquery.svgDoughnutChart.js
 * Version: 0.1(Beta)
 * Inspired by Chart.js(http://www.chartjs.org/)
 *
 * Copyright (c) 2016 Jordi Corbilla
 * https://github.com/JordiCorbilla/jquery.svgDoughnutChart.js
 * The MIT License (MIT)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function ($) {

    $.fn.doughnutChart = function (options) {
        var settings = $.extend({
            positiveColor: 'rgb(175, 207, 236)',
            negativeColor:  'rgb(217, 238, 248)',
            backgroundColor: "white",
            percentage : 68,
            size: 100,
            doughnutSize: 0.35,
            innerText: "68%",
            innerTextOffset: 12,
            Title: "Travelling Time",
            positiveText: "176 days travelling",
            negativeText : "84 days home"
        }, options);

        //Main Layout
        var svgns = "http://www.w3.org/2000/svg";
        var chart = document.createElementNS(svgns, "svg:svg");
        chart.setAttribute("width", (settings.size * 3));
        chart.setAttribute("height", settings.size);
        var center = (settings.size / 2);
        chart.setAttribute("viewBox", "0 0 " + (settings.size * 3) + " " + settings.size);
        var back = document.createElementNS(svgns, "circle");
        back.setAttributeNS(null, "cx", center);
        back.setAttributeNS(null, "cy", center);
        back.setAttributeNS(null, "r", center);
        back.setAttributeNS(null, "fill", settings.negativeColor);
        chart.appendChild(back);

        // primary slice
        var path = document.createElementNS(svgns, "path");
        var unit = (Math.PI * 2) / 100;
        var startangle = 0;
        var endangle = settings.percentage * unit - 0.001;
        var x1 = center + center * Math.sin(startangle);
        var y1 = center - center * Math.cos(startangle);
        var x2 = center + center * Math.sin(endangle);
        var y2 = center - center * Math.cos(endangle);
        var big = 0;
        if (endangle - startangle > Math.PI) {
            big = 1;
        }
        //https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
        //Draw the main path
        var d = "M " + center + "," + center +      // Start at circle center
            " L " + x1 + "," + y1 +                 // Draw line to (x1,y1)
            " A " + center + "," + center +         // Draw an arc of radius r
            " 0 " + big + " 1 " +                   // Arc details...
            x2 + "," + y2 +                         // Arc goes to (x2,y2)
            " Z";                                   // Close path back to (cx,cy)
        path.setAttribute("d", d); 
        path.setAttribute("fill", settings.positiveColor);
        chart.appendChild(path); // Add slice to chart

        // foreground circle
        var front = document.createElementNS(svgns, "circle");
        front.setAttributeNS(null, "cx", center);
        front.setAttributeNS(null, "cy", center);
        front.setAttributeNS(null, "r", (settings.size * settings.doughnutSize)); 
        front.setAttributeNS(null, "fill", settings.backgroundColor);
        chart.appendChild(front);

        //Inner text
        var newText = document.createElementNS(svgns, "text");
        newText.setAttributeNS(null, "x", center-settings.innerTextOffset);
        newText.setAttributeNS(null, "y", 55);
        newText.setAttribute("font-weight", "bold");
        newText.setAttribute("font-size", "large");
        var textNode = document.createTextNode(settings.innerText);
        newText.appendChild(textNode);
        chart.appendChild(newText);

        //Positive rectangle
        var rect = document.createElementNS(svgns, "rect");
        rect.setAttributeNS(null, "x", 122);
        rect.setAttributeNS(null, "y", 38);
        rect.setAttributeNS(null, "height", '15');
        rect.setAttributeNS(null, "width", '15');
        rect.setAttributeNS(null, "fill", settings.positiveColor);
        rect.setAttributeNS(null, "stroke-width", "1");
        rect.setAttributeNS(null, "stroke", "rgb(0,0,0)");
        chart.appendChild(rect);

        //Negative rectangle
        var rect2 = document.createElementNS(svgns, "rect");
        rect2.setAttributeNS(null, "x", 122);
        rect2.setAttributeNS(null, "y", 62);
        rect2.setAttributeNS(null, "height", '15');
        rect2.setAttributeNS(null, "width", '15');
        rect2.setAttributeNS(null, "fill", settings.negativeColor);
        rect2.setAttributeNS(null, "stroke-width", "1");
        rect2.setAttributeNS(null, "stroke", "rgb(0,0,0)");
        chart.appendChild(rect2);

        //Graph Title
        var newText2 = document.createElementNS(svgns, "text");
        newText2.setAttributeNS(null, "x", 120);
        newText2.setAttributeNS(null, "y", 20);
        newText2.setAttribute("font-weight", "bold");
        var textNode2 = document.createTextNode(settings.Title);
        newText2.appendChild(textNode2);
        chart.appendChild(newText2);

        //Positive text
        var newText3 = document.createElementNS(svgns, "text");
        newText3.setAttributeNS(null, "x", 145);
        newText3.setAttributeNS(null, "y", 50);
        var textNode3 = document.createTextNode(settings.positiveText);
        newText3.appendChild(textNode3);
        chart.appendChild(newText3);

        //Negative text
        var newText4 = document.createElementNS(svgns, "text");
        newText4.setAttributeNS(null, "x", 145);
        newText4.setAttributeNS(null, "y", 75);
        var textNode4 = document.createTextNode(settings.negativeText);
        newText4.appendChild(textNode4);
        chart.appendChild(newText4);

        $(this).append(chart);
        this
        return this;
    };

}(jQuery));