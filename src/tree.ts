module powerbi.extensibility.visual {


  export class BarChart implements IVisual {
    private static xMap;
    private static yMap;
    private element: HTMLElement;
    private newTest;

    /**
     * Creates instance of BarChart. This method is only called once.
     *
     * @constructor
     * @param {VisualConstructorOptions} options - Contains references to the element that will
     *                                             contain the visual and a reference to the host
     *                                             which contains services.
     */
    constructor(options: VisualConstructorOptions) {

      this.element = options.element;

    }






    /**
     * Updates the state of the visual. Every sequential databinding and resize will call update.
     *
     * @function
     * @param {VisualUpdateOptions} options - Contains references to the size of the container
     *                                        and the dataView which contains all the data
     *                                        the visual had queried.
     */
    public update(options: VisualUpdateOptions) {
      //debugger;

      //Check if we got any data.
      let categoriesExists = (options.dataViews) &&
        (options.dataViews.length > 0) &&
        (options.dataViews[0].categorical) &&
        (options.dataViews[0].categorical.categories) &&
        (options.dataViews[0].categorical.categories.length > 0) &&
        (options.dataViews[0].categorical.categories[0]) &&
        (options.dataViews[0].categorical.categories[0].values) ? true : false;

      if (categoriesExists) {
        var elemntToremove = document.getElementById('idanTest');
        if (elemntToremove) {
          this.element.removeChild(elemntToremove);
          this.newTest = null;
        }


        var data = [{}];
        var ids = options.dataViews[0].categorical.categories[0].values;
        var labels = options.dataViews[0].categorical.categories[1].values;
        var Xs = options.dataViews[0].categorical.values[0].values;
        var Ys = options.dataViews[0].categorical.values[1].values;

        for (var i = 0; i < labels.length; i++) {
          data[i] = {
            "ids": ids[i],
            "label": labels[i],
            "X": Xs[i],
            "Y": Ys[i]
          }
        }
      }

      var data1 = this.myKNN(data);
      data = data1;
     // debugger

      var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      /* 
      * value accessor - returns the value to encode for a given data object.
      * scale - maps value to a visual display encoding, such as a pixel position.
      * map function - maps from data value to display value
      * axis - sets up axis
      */

      // setup x 
      var xValue = function (d) { return d.X; }, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function (d) { return xScale(xValue(d)); }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

      BarChart.xMap = xMap;


      // setup y
      var yValue = function (d) { return d["Y"]; }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function (d) { return yScale(yValue(d)); }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

      BarChart.yMap = yMap;

      // setup fill color
      var cValue = function (d) { return d.newLabel; },
        color = d3.scale.category10();

      this.newTest = d3.select(this.element)
        .append('svg').attr({
          viewBox: "0 0 960 500",
          id: "idanTest"
        });

      var svg = this.newTest
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      // // add the tooltip area to the webpage
      var tooltip = svg.append("rect")
        .attr("width", 10)
        .attr("height", 5)
        .style("fill", "black")
        .attr("class", "blabla")
        .style("opacity", 0);
      // load data


      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
      yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

      // x-axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Calories");

      // y-axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Protein (g)");

      // draw dots
      svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function (d) { return 2 + 10 * (d.label >= 0 ? 0.1 : 0.5); })
        .attr("cx", xMap)
        .attr("opacity", function (d) { return 0.15 + (d.label >= 0 ? 0 : 0.5); })
        .attr("cy", yMap)
        .style("fill", function (d) { return color(cValue(d)); })
        .on("mouseover", function (d) {
          //debugger;
          var positionX = BarChart.xMap(d);
          var positionY = BarChart.yMap(d);
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)
            .attr("x", positionX + 5)
            .attr("y", positionY + 10);
          //   tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
          //     + ", " + yValue(d) + ")")
          //        .style("left", (positionX + 5) + "px")
          //        .style("top", (positionY  - 28) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      // draw legend
      var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      // draw legend text
      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; })


      debugger;


    }


    /**
     * Destroy runs when the visual is removed. Any cleanup that the visual needs to
     * do should be done here.
     *
     * @function
     */
    public destroy(): void {
      // Perform any cleanup tasks here
    }

    public myKNN(data) {

      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].label < 0)
      //     data[i].newLabel = (i % 2);
      //   else
      //     data[i].newLabel = data[i].label;

      // }
      debugger;

      var datasetTrain =[];
      var trainLabels =[];
      var datasetTest =[];
      var indexesTest =[];
      var sizeTrain = 0;
      var sizeTest = 0;
      var dataNew = [];
      

      for (var i = 0; i < data.length; i++) {
        if (data[i].label < 0)
        {
          datasetTest.push([data[i].X, data[i].Y]);
          indexesTest.push(i);
        }
        else
        {
          datasetTrain.push([data[i].X, data[i].Y]);
          trainLabels.push(data[i].label);
          data[i].newLabel = data[i].label;
        }
      }

       
      var knn = new KNN(datasetTrain, trainLabels);
      var ans = knn.predict(datasetTest);

      for (var i = 0; i < indexesTest.length; i++) {
        data[indexesTest[i]].newLabel = ans[i]; 
        dataNew.push(data[indexesTest[i]]);
      }

      //knn
      // var dataset = [[0, 0, 0], [0, 1, 1], [1, 1, 0], [2, 2, 2], [1, 2, 2], [2, 1, 2]];
      // var predictions = [0, 0, 0, 1, 1, 1];
      // var knn = new KNN(dataset, predictions);
      // var dataset = [[0, 0, 0],
      // [2, 2, 2]];
      // var ans = knn.predict(dataset);
      // console.log(ans)



      return dataNew;

    }

  }
}
