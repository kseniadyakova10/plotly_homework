//dropdown menu options
function init() {
    var selector = d3.select("#selDataset");

    //get sample names into options
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;

        //loop through each option
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

//get new information every time value of data is changed in dropdown menu
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}

function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        //console.log(data);
    
        var samples = data.samples;
        var results = samples.filter(row => row.id == sample);
        console.log(results);
        var result = results[0];
        console.log(result);

        //variables for charts
        var otuIDS = result.otu_ids;
        var otuLABELS = result.otu_lebels;
        var sampleVALUES = result.sample_values;

        //bar chart
        var yTICKS = otuIDS.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var trace1 = {
            x: sampleVALUES,
            y: yTICKS,
            type:"bar",
            orientation:"h"
        };
        var barCHART = [trace1];
        var barlayout = {
            title: "Top 10 Bacteria"
        };
        Plotly.newPlot("bar", barCHART, barlayout);

        //bubble chart
        var trace2 = {
            x: otuIDS,
            y: sampleVALUES,
            text: otuLABELS,
            mode:"markers",
            marker: {
                size: sampleVALUES,
                color: otuIDS,
                colorscale: "Earth"
            }
        };

        var bubData = [trace2];

        var bubLayout = {
            title: "Bacteria per sample",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", bubData, bubLayout);


    
    });

}

//demographic info
function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
init();