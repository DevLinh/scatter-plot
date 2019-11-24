var urlSource =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

//define svg
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//define the div for tooltip
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);
//get dataset by d3.json
d3.json(urlSource, function(data) {
  // add title
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Dopping in Professional Bicycle Racing");

  //add subtitle
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2 + 25)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("35 Fastest times up Alpe d'Huez");
  // create Scale
  var xMin = d3.min(data, function(d) {
    return d.Year - 1;
  });
  var xMax = d3.max(data, function(d) {
    return d.Year + 1;
  });
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, width]);

  //convert Time from string into Date format (ex new Date (2019, 10, 23, 0, 55, 4 ) -> Sat Nov 23 2019 00:55:04)
  data.forEach(function(d) {
    var parsedTime = d.Time.split(":");
    d.Time = new Date(2019, 10, 23, 0, parsedTime[0], parsedTime[1]);
  });
  var timeFormat = d3.timeFormat("%M:%S");
  var yScale = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function(d) {
        return d.Time;
      })
    )
    .range([0, height]);
  // create axis
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); //d - decimal notation, rounded to integer.
  var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  // append axis to svg
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", "translate(0, " + height + ")")
    .attr("x", -6);
  svg
    .append("g")
    .attr("class", "axis")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".7em")
    .style("text-anchor", "end")
    .style("color", "black")
    .text("Best Time(minutes)");

  // visualize the data in scatter plot
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  //d3.scaleOrdinal Give them a bunch of “things” and a bunch of values, and they will consistently return the same value for the same thing. Even better, you don't have to know in advance which things the scale will encounter, as that correspondance can be built incrementally with incoming data.
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", function(d) {
      return xScale(d.Year);
    })
    .attr("cy", function(d) {
      return yScale(d.Time);
    })
    .attr("data-xvalue", function(d) {
      return d.Year;
    })
    .attr("data-yvalue", function(d) {
      return d.Time.toISOString();
    })
    .style("fill", function(d) {
      // fill color by doping
      return color(d.Doping === "");
    })
    .on("mouseover", function(d) {
      div.style("opacity", 0.9);
      div.attr("data-year", d.Year);
      div
        .html(
          d.Name +
            ": " +
            d.Nationality +
            "<br/>" +
            "Year: " +
            d.Year +
            ", Time: " +
            timeFormat(d.Time) +
            (d.Doping ? "<br/><br/>" + d.Doping : "")
        )
        .style("left", d3.event.pageX + 5 + "px")
        .style("top", d3.event.pageY - 30 + "px");
    })
    .on("mouseout", function(d) {
      div.style("opacity", 0);
    });

  //add descriptive
  var legend = svg
    .selectAll(".lengend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("id", "legend")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height / 2 - i * 22) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 20)
    .attr("height", 20)
    .attr("width", 20)
    .style("fill", color);
  legend
    .append("text")
    .attr("x", width - 26)
    .attr("y", 10)
    .attr("dy", "0.3em")
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) return "Riders with doping allegations";
      else return "No doping allegations";
    });
});
