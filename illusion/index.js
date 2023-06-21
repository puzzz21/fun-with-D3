/**
 * IMPORTANT NOTICE:
 *
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided and stored as the graphs nodes and links.
 * Check out the console to see the data structure:
 */

const width = 1200;
const height = 900;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height)
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
const svg = d3.select('g#vis-g')

const visHeight = height - margin.top - margin.bottom

var rangeVal = 0
const rectHeight = 20
const rectWidth = 30

update()

d3.select("#range").on("input", function () {
    console.log("The value is " + this.value);
    rangeVal = this.value
    update()
});

function update() {

    d3.select("g#vis-g").selectAll("rect").remove()

    for (let j = 1; j < 10; j += 1) {
        let random = rangeVal > 0 ? Math.round(Math.random() * rangeVal) + rectWidth : 0

        for (let i = 0; i < 25; i += 2) {
            svg.append('rect')
                .attr('x', rectWidth * i + random)
                .attr('y', rectHeight * j)
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('stroke', '#808080')
                .attr('stroke-dasharray', "50,50,150")
                .attr('fill', 'black');
        }
        for (let i = 1; i < 25; i += 2) {
            svg.append('rect')
                .attr('x', rectWidth * i + random)
                .attr('y', rectHeight * j)
                .attr('width', rectWidth)
                .attr('height', rectHeight)
                .attr('stroke', '#808080')
                .attr('stroke-dasharray', "50,50,150")
                .attr('fill', 'white');
        }
    }
}
