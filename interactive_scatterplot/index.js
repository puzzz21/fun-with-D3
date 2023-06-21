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

console.log("Initial Data", data)

// constants
const width = 600;
const height = 600;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height)
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right

//TASK: get all dimensions in the dataset
var allDimensions = Object.keys(data[0])

console.log("Dimensions of the dataset: ", allDimensions)

//TASK: Data cleaning
// filter out any datapoints where a value is undefined
// 334 datapoints should remain
var cleanData = data.filter(function (d) {
    let tempBool = true
    allDimensions.forEach(x => {
        if (typeof d[x] === "undefined") {
            tempBool = false
        }
    })
    return tempBool
})


//TASK: seperate numeric and ordinal dimensions
var numerics = allDimensions.filter(function (dim) {
    return !isNaN(data[0][dim])
})

var categoricals = allDimensions.filter(function (dim) {
    return isNaN(data[0][dim])
})

console.log("numerical dimensions", numerics)
console.log("categorical dimensions", categoricals)

//append a circle for each datapoint
// for cx, cy, fill and r we set dummy values for now 
var selection = d3.select('g#scatter-points').selectAll('circle').data(cleanData)
    .enter().append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 3)
    .attr('fill', 'black')
//add labels for x and y axis
var yLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label').text(' ')
var xLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
    .attr('transform', 'translate(' + visWidth + ', ' + visHeight + ')')
    .text(' ')


//TASK: add options to the select tags:
// for all <select>'s we have to add <options> for each data dimension
// the select for the x-axis, y-axis and size should only have numeric dimensions as options
// the select for the color should only have categorical dimensions as options
// add an event listener to the <select> tag
//    call the appropriate change function (xAxisChange(newDim), yAxisChange(newDim), colorChange(newDim) or sizeChange(newDim))
let xAxisSelector = d3.select("#x-axis-select");
numerics.forEach(function (num) {
    xAxisSelector
        .append("option")
        .text(num)
        .property("value", num);
})


let yAxisSelector = d3.select("#y-axis-select");
numerics.forEach(function (num) {
    yAxisSelector
        .append("option")
        .text(num)
        .property("value", num);
})

let sizeSelector = d3.select("#size-select");
numerics.forEach(function (num) {
    sizeSelector
        .append("option")
        .text(num)
        .property("value", num);
})

let colorSelector = d3.select("#color-select");
categoricals.forEach(function (cat) {
    colorSelector
        .append("option")
        .text(cat)
        .property("value", cat);
})

xAxisSelector.on("change", function (event, d) {
    dim = event.currentTarget.value
    xAxisChange(dim)
});

yAxisSelector.on("change", function (event, d) {
    dim = event.currentTarget.value
    yAxisChange(dim)
});

sizeSelector.on("change", function (event, d) {
  dim = event.currentTarget.value
  sizeChange(dim)
});

colorSelector.on("change", function (event, d) {

  dim = event.currentTarget.value
  colorChange(dim)
});


// TASK: x axis update:
// Change the x Axis according to the passed dimension
// update the cx value of all circles  
// update the x Axis label
xAxisChange = (newDim) => {
    d3.select('svg#chart').selectAll(".x-axis").remove()
    d3.select('svg#chart').selectAll(".x-label").remove()

    var x = d3.scaleLinear()
        .domain(d3.extent(cleanData, function (d) {
            return d[newDim]
        }))
        .range([0, visWidth])

      let yTranslate = height - margin.bottom
      let xTranslate = margin.left
      d3.select('svg#chart').append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate( " + xTranslate+"," + yTranslate + ")")
        .call(d3.axisBottom(x))

    selection.attr("cx", function (d) {
        return x(d[newDim])
    })

  d3.select('svg#chart').append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", yTranslate)
        .text(newDim)
}

// TASK: y axis update:
// Change the y Axis according to the passed dimension
// update the cy value of all circles  
// update the y Axis label 
yAxisChange = (newDim) => {
    d3.select('svg#chart').selectAll(".y-axis").remove()
    d3.select('svg#chart').selectAll(".y-label").remove()

    var y = d3.scaleLinear()
        .domain([d3.max(cleanData, (d) => d[newDim]), d3.min(cleanData, (d) => d[newDim])]
        )
        .range([0, visHeight])


    d3.select('svg#chart').append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + " , " + margin.bottom +")")
        .call(d3.axisLeft(y))

    selection.attr("cy", function (d) {
        return y(d[newDim])
    })

  d3.select('svg#chart').append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", margin.left + 100 )
      .attr("y", margin.top)
      .text(newDim)
}


// TASK: color update:
// Change the color (fill) according to the passed dimension
// update the fill value of all circles  
//
// add a <span> for each categorical value to the legend div 
// (see #color-select-legend in the html file)
// the value text should be colored according to the color scale 
colorChange = (newDim) => {
  console.log("new dim: ", newDim)
  d3.select("#color-select-legend").selectAll("span").remove()
  selection
      .attr('fill', d => colorScale(d[newDim]))

  var arr = []

  var changeColor = d3.selectAll("#color-select-legend").selectAll(".select-container")

  changeColor.data(cleanData).enter()
      .filter(function (d) {
        if (!(arr.includes(d[newDim]))) {
          arr.push(d[newDim])
          return d[newDim]
        }
      }).append("span").text((val) => {
    console.log(val)
    return val[newDim]
  }).style("color", d => colorScale(d[newDim])).append("br")
}

const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);


// TASK: size update:
// Change the size according to the passed dimension
//    if the dimension contains numbers, use ScaleLinear
//    if the dimension contains strings, use ScaleOrdinal 
// update the r value of all circles

sizeChange = (newDim) => {
  // Add a scale for bubble size
  var maxd = d3.max(cleanData, function(d){
    return d[newDim]
  })
  var mind = d3.min(cleanData, function(d){
    return d[newDim]
  })
  var size = d3.scaleLinear()
      .domain([mind,maxd])
      .range([1, 7])

  selection.attr("r", d => size(d[newDim]))
}

//initialize the scales
xAxisChange('culmen_length_mm')
yAxisChange('culmen_depth_mm')
colorChange('species')
sizeChange('body_mass_g')
