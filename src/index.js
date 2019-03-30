const config = {
  width: 1000, //screen.width
  height: 600
};

// Define the canvas
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", config.width)
  .attr("height", config.height);

// Adding a title
svg
  .append("text")
  .text("US educational map")
  .attr("id", "title")
  .attr("font-size", "50px")
  .attr("y", 40)
  .attr("x", 200);

// Adding a description
svg
  .append("text")
  .text("Shows data, fucking hell")
  .attr("id", "description")
  .attr("font-size", "30px")
  .attr("y", 70)
  .attr("x", 250);

// Define projection
const projection = d3.geoAlbers();
const scale = scaleFactor => {
  return d3.geoTransform({
    point: function(x, y) {
      this.stream.point(x * scaleFactor, y * scaleFactor);
    }
  });
};
const path = d3.geoPath().projection(scale(0.8));

// Define x axis and scale

// const x = d3
//   .scaleLinear()
//   .domain([2.6, 75.1])
//   .rangeRound([600, 860]);

// Urls for maps
const USAMAP =
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
const DATA =
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

// Fetch data

const promise1 = d3.json(DATA).then(data => data);
const promise2 = d3.json(USAMAP).then(data => data);

Promise.all([promise1, promise2]).then(data => {
  const map = data[1];

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("transform", "translate(0, 50)");
  // .on("mouseover", d => {
  //   console.log(d);
  // });

  // .on("mouseover", function(d) {
  //     d3.select(this).style("fill", d3.select(this).attr('stroke'))
  //         .attr('fill-opacity', 0.3);
  //   })
});
