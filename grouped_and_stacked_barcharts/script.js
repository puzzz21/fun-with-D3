// // constants
const grouped_width = 600;
const stacked_width = 1200;
//
const height = 700;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};
//
d3.select('svg#chart').attr('width', grouped_width).attr('height', height)
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
var svg = d3.select('g#vis-g')
//
d3.select('svg#chart2').attr('width', stacked_width).attr('height', height)
d3.select('g#vis-g2').attr('transform', 'translate(' + 50 + ', ' + margin.top + ')')
var svg2 = d3.select('g#vis-g2')
//
const visHeight = height - margin.top - margin.bottom
const grouped_visWidth = grouped_width - margin.left - margin.right
const stacked_visWidth = stacked_width - grouped_width - margin.right
//
var subgroups = ["clothing", "equipment", "accessories"]

var groups_a = d3.map(data, function(d){
    return(d.name)
})

var index = ["","clothing", "equipment", "accessories"]

var tool = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeCategory10)

var x_a = d3.scaleBand()
    .domain(groups_a)
    .range([0, grouped_visWidth])
    .padding([0.2])

svg.append("g")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(x_a));

var y_a = d3.scaleLinear()
    .domain([0,d3.max(data, function (d) {
        return d['clothing']
    })])
    .range([ visHeight, 0 ]);

svg.append("g")
    .call(d3.axisLeft(y_a));

var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x_a.bandwidth()])
    .padding([0.05])


svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", margin.left - 10)
    .attr("y", margin.top - 50)
    .text("revenue")

svg.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", grouped_width - 50)
    .attr("y", height - margin.bottom - 50)
    .text("department")

svg.append("text")
    .attr("class", "title")
    .attr("text-anchor", "end")
    .attr("x", 400)
    .attr("y", margin.top)
    .style("font-size", "34px")
    .text("Grouped BarChart")

svg.data(index)
    .enter()
    .append("text")
    .attr("x", 450)
    .attr("y", 0)
    .text(d => d)
    .style("color", d => {
        console.log(d)
        return color(d)
    })
    .append("br")

// for(var i = 0; i < 3; i++) {
//     svg.append("text")
//     .attr("x", 450)
//     .attr("y", 0 + (i* 20))
//     .text(subgroups[i])
//             .style("color", color(subgroups[i]))
//         .append("br")
// }


svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" + x_a(d.name) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {store: d["name"], key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return xSubgroup(d.key); })
    .attr("y", function(d) { return y_a(d.value); })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function(d) { return visHeight - y_a(d.value); })
    .attr("fill", function(d) { return color(d.key); })
    .on("mouseover", function(event,d) {
        console.log(d)
        tool.transition()
            .duration(200)
            .style("opacity", .9);
        tool.html("revenue: " + d.value + "<br/>" + "department: " + d.key+ "<br/>" + "store: " + d.store)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event,d) {
        tool.transition()
            .duration(500)
            .style("opacity", 0);
    });





var stackedData = d3.stack()
    .keys(subgroups)
    (data)

console.log(stackedData)

console.log("stacked data: ", stackedData)

svg2.data(index)
    .enter().append("text")
    .attr("dx", 0)
    .attr("dy",0)
    .text(d => d)
    .style("color", d => color(d))
    .append("br")

var x = d3.scaleBand()
    .domain(groups_a)
    .range([0, stacked_visWidth])
    .padding([0.2])

var y = d3.scaleLinear()
    .domain([0, 15000])
    .range([ visHeight, 0 ]);

svg2.append("g")
    .attr("transform", "translate(0," + 0 + ")")
    .call(d3.axisLeft(y));

svg2.append("g")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

svg2.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", margin.left)
    .attr("y", margin.top - 50)
    .text("revenue")

svg2.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", grouped_width)
    .attr("y", visHeight)
    .text("department")

svg2.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", d => x(d.data.name))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width",x.bandwidth())
    .on("mouseover", function(event,d, i) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        let val = ~~(d[1] - d[0])
        tool.transition()
            .duration(200)
            .style("opacity", .9);
        tool.html("revenue: " + val + "<br/>" + "store: " + d["data"]["name"] + "<br/>" + "department: " + subgroupName)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event,d) {
        tool.transition()
            .duration(500)
            .style("opacity", 0);
    });


svg2.append("text")
    .attr("class", "title")
    .attr("text-anchor", "end")
    .attr("x", 400)
    .attr("y", margin.top)
    .style("font-size", "34px")
    .text("Stacked BarChart")

// for(var i = 0; i < 3; i++) {
//     svg2.append("text")
//         .attr("x", 450)
//         .attr("y", 0 + (i* 20))
//         .text(subgroups[i])
//         .style("color", color(subgroups[i]))
//         .append("br")
// }
