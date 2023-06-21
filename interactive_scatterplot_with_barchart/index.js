/**
 * IMPORTANT NOTICE:
 *
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
 {
    "species": "Adelie",
    "island": "Torgersen",
    "culmen_length_mm": 39.1,
    "culmen_depth_mm": 18.7,
    "flipper_length_mm": 181,
    "body_mass_g": 3750,
    "sex": "MALE"
  } ....
 */


const width = 600;
const height = 600;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height)
var bar = d3.select('svg#barchart').attr('width', width).attr('height', height).append("g")
var brush_area = d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right

var allDimensions = Object.keys(data[0])
var cleanData = data.filter((d) => allDimensions.reduce((isClean, dim) => (d[dim] != undefined && isClean), true))

var numerics = allDimensions.filter(d => typeof cleanData[0][d] === 'number')
var categoricals = allDimensions.filter(d => typeof cleanData[0][d] === 'string')


//append a circle for each datapoint
// for cx, cy, fill and r we set dummy values for now 
var selection = d3.select('g#scatter-points').selectAll('circle').data(cleanData)
    .enter().append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 3)
    .attr('fill', 'black')

//add labels for x and y axis
var yLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
var xLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
    .attr('transform', 'translate(' + visWidth + ', ' + visHeight + ')')

var xScale = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d["culmen_length_mm"]))
    .range([0, visWidth])

d3.select('g#x-axis')
    .attr('transform', 'translate(0,' + visHeight + ')')
    .call(d3.axisBottom(xScale))
selection.attr('cx', d => xScale(d["culmen_length_mm"]))

var yScale = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d["culmen_depth_mm"]))
    .range([visHeight, 0])
d3.select('g#y-axis')
    .attr('transform', 'translate(' + 0 + ',0)')
    .call(d3.axisLeft(yScale))
selection
    .attr('cy', d => yScale(d["culmen_depth_mm"]))

var colorScale = d3.scaleOrdinal()
    .domain(new Set(cleanData.map(d => d["species"])))
    .range(d3.schemeCategory10);
selection
    .attr('fill', d => colorScale(d["species"]))


var sizeScale = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d["body_mass_g"]))
    .range([3, 7])
selection
    .attr('r', (d) => sizeScale(d["body_mass_g"]))


//TODO:
// define d3.brush (see https://github.com/d3/d3-brush)
// and define its event handling
// add brush selection to the predefined variable brush_area
d3.select('g#vis-g')
    .call(d3.brush()                 // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("start brush", updateChart)
        .on("end.snap", createBarchart)// Each time the brush selection changes, trigger the 'updateChart' function
    )

//TODO:
// add function to highlight the selected circles on brushstroke
// the circles are assigned with predefined styling classes (see index.css)
// convert all circles to non-brushed
// filter selection based on boolean function "isBrushed" (see next comment)
function updateChart(event) {
    extent = event.selection
    selection.classed("brushed", function (d) {
        let brushed = isBrushed(extent, xScale(d.culmen_length_mm), yScale(d.culmen_depth_mm))
        return brushed
    })
    selection.classed("non_brushed", function (d) {
        let brushed = isBrushed(extent, xScale(d.culmen_length_mm), yScale(d.culmen_depth_mm))
        return !brushed
    })

}

//TODO:
// create function to dynamically create a barchart in the barchart element (in index.html)
// remove unnecessary elements
// set the dimensions and margins of the graph
// set the scales and axis
// select all brushed elements
// use d3.rollup to prepare the data:
// the bars should display the culmen depth summed up for each species
//apply the correct color scale
// draw the axis and bars based on the data input
function createBarchart() {
    d3.selectAll("g#bar-chart").selectAll('.xaxis').remove()
    d3.selectAll("g#bar-chart").selectAll('.yaxis').remove()
    d3.selectAll("g#bar-chart").selectAll('.bar').remove()

    var d = d3.select('g#scatter-points').selectAll("circle.brushed").data()

    var rolledup = d3.rollups(d, d => d3.sum(d, d => d.culmen_depth_mm), d => d.species)
        .map(([k, v]) => ({'species': k, 'sum': v}))

    console.log(rolledup)

    var x_a = d3.scaleBand()
        .domain(d3.map(rolledup, function (d) {
            return (d['species'])
        }))
        .range([0, visWidth])
        .padding([0.3])

    d3.select('g#bar-chart').append("g").attr("class", "xaxis")
        .attr('transform', 'translate( ' + margin.left + ',' + visHeight + ')')
        .call(d3.axisBottom(x_a))

    var y_a = d3.scaleLinear()
        .domain([0, d3.max(rolledup, function (d) {
            return d['sum']
        })])
        .range([visHeight, 0]);

    d3.select('g#bar-chart').append("g").attr("class", "yaxis").attr('transform', 'translate(' + margin.left + ',0)')
        .call(d3.axisLeft(y_a));

    let species = ['Adelie', 'Chinstrap', 'Gentoo']

    var colors = d3.scaleOrdinal(d3.schemeCategory10).domain(species)

    d3.select('g#bar-chart').append("g")
        .selectAll()
        .data(rolledup)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x_a(d['species']);
        })
        .attr("y", function (d) {
            return y_a(d['sum']);
        })
        .attr("width", x_a.bandwidth())
        .attr("height", function (d) {
            return visHeight - y_a(d['sum']);
        })
        .attr("fill", d => colors(d['species']))
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
}


//TODO:
//create function which returns a boolean value...
//stating if the cx and cy is located within the brushed area
function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}
