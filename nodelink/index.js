/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided and stored as the graphs nodes and links.
 * Check out the console to see the data structure:
 */

const links = data.links
const nodes = data.nodes
console.log("Data Structure", data)

// constants
const width = 1200;
const height = 900;
const margin = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
};

// aggregates the data according to the attribute value
// there is NOTHING to do for you here
function aggregateData(unaggregated, attribute) {
    var newData = {}
    //grouping of nodes
    newData.nodes = Array.from(d3.group(unaggregated.nodes, d => d[attribute])).map((d,i) => {
        return {
        name: d[0],
        [attribute]: d[0],
        id: i,
        count: d[1].length
        }
    })

    newData.links = []
    //for each node combination, create a link
    newData.nodes.forEach((n, i) => {
        newData.nodes.slice(i+1).forEach((n2,i2) => {
        newData.links.push({
            source: i,
            target: i+1+i2,
            value: unaggregated.links.filter(d => (
            (d.source[attribute] == n.name && d.target[attribute] == n2.name) || 
            (d.source[attribute] == n2.name && d.target[attribute] == n.name))).map(d => d.value).reduce((curr, acc) => curr+acc, 0)
        })
        })
    })
    
    return newData;
}
 
d3.select('svg#chart').attr('width', width).attr('height', height)
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
var svg = d3.select('g#vis-g')

const visHeight = height - margin.top - margin.bottom
const visWidth = width - margin.left - margin.right


// TASK 
//define an ordinal color scale and define a color for each value of the 'house' attribute of the data
var colorScale = 




// TASK 
//attach an event handler on the checkbox, and call the updateGraph function
    //depending on the checkbox value, the data should be aggregated, or not

 


    
 //this function handles the creation of the graph, depending on the passed 'graphData'
 function updateGraph(graphData) {
 
    //TASK 
    //draw a line for each link
        //the color of the link should be green when  the value is greater than 0, red when below 0
        //if the value is below 0, add a dash-array to the stroke





 
 
    //TASK 
    //create a group element for each node
    //implement the drag ( https://github.com/d3/d3-drag ) behaviour to make the graph interactive
        //add a circle 
            // if aggregated, the radius of the circle should scale according to the count
            // color the circle according to the colorScale
        //add a text label
     
 
         






    // TASK
    // create a force Simulation ( https://github.com/d3/d3-force ) using the nodes and links
        //make sure the force is centered at the middle of your visualization 
        //and the nodes do not overlap
 

         





}
 
 
//initialize the graph with ungrouped data
updateGraph(data)
 
 
 
 