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
// const scale = scaleFactor => {
//   return d3.geoTransform({
//     point: function(x, y) {
//       this.stream.point(x * scaleFactor, y * scaleFactor);
//     }
//   });
// };
const path = d3.geoPath(); //.projection(scale(0.9));

// Define color scale

const colorScale = d3.scaleOrdinal(d3.schemePurples[4]);

// Define the legend

const legendData = [1, 2, 3, 4];
const legendConf = { width: 50, y: 70 };

const legend = svg
  .append("g")
  .attr("id", "legend")
  .selectAll("rect")
  .data(legendData)
  .enter()
  .append("rect")
  .attr("fill", d => colorScale(d))
  .attr("width", legendConf.width)
  .attr("height", 30)
  .attr("y", legendConf.y)
  .attr("x", d => d * legendConf.width + 600)
  .attr("stroke", "Corn")
  .attr("stroke-width", 1);

legendText = svg
  .append("g")
  .selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .attr("y", legendConf.y + 20)
  .attr("x", d => d * legendConf.width + 600 + 20)
  .attr("font-size", "20px")
  .text(d => d);

// Define a tooltip

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("display", "none");

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
  const educData = data[0];
  const thisCounty = d => educData.filter(county => county.fips == d.id)[0];

  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(map, map.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("transform", "translate(0, 50)")
    .attr("data-fips", county => thisCounty(county).fips)
    .attr("data-education", county => thisCounty(county).bachelorsOrHigher)
    .attr("fill", d => colorScale(thisCounty(d).bachelorsOrHigher))
    .on("mouseover", (d, i) => {
      const selectedState = thisCounty(d);
      var mouse = d3.mouse(d3.event.currentTarget);
      tooltip
        .attr("data-education", selectedState.bachelorsOrHigher)
        .style("display", "block")
        .style("top", mouse[1] - 15 + "px")
        .style("left", mouse[0] + "px")
        .style("background-color", "rgba(255,255,255,0.7)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .append("text")
        .text(`County: ${selectedState.area_name}`)
        .style("display", "block")
        .append("text")
        .text(`Bachelors or Higher: ${selectedState.bachelorsOrHigher}`)
        .style("display", "block");
    })
    .on("mouseout", (d, i) => {
      tooltip.style("display", "none").text("");
    });
});
