// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultsArray = metadata.filter(obj => obj.id == sample);
    var results = resultsArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var samplePanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    samplePanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(results).forEach(([key,value])=> {
      samplePanel.append('h6').text(`${key}: ${value}`); 
    });
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samplesField = data.samples;

    // Filter the samples for the object with the desired sample number
    var selectedSample = samplesField.find(obj => obj.id == sample);
    console.log(selectedSample);
    //let currentSample = selectedSample[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otuID = selectedSample.otu_ids;
    console.log(otuID);
    var otuLabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;

    // Build and Render Bubble Chart
    let bubbleLay = {
      title: "Bacteria Cultures per Sample",
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      yaxis: {'title': "Number of Bacteria"},
      margin: { t: 30},
      height: 500, 
      width: 1000
    };

    let bubbleInfo = [
      {
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuID,
          colorscale: "Earth"
        }
      }
    ];

    
    Plotly.newPlot("bubble", bubbleInfo, bubbleLay);

  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let labels = selectedSample.otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    let trace = {
      x: selectedSample.sample_values.slice(0,10).reverse(),
      y: labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h',
      text: selectedSample.otu_labels.slice(0,10).reverse()
    };

    let layout = {
      title: "Top 10 Bacteria Cultures Found", 
      xaxis: {title: "Number of Bacteria"},
      yaxis: {title: "OTU ID", tickvals: labels.slice(0,10).reverse()}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar',[trace],layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var names = data.names;
    var dropdownMenu = d3.select("#selDataset");

    names.forEach((name) => {
      dropdownMenu.append("option").text(name).property("value", name);
    });

    dropdownMenu.on("change", function() {
      var selectedSample = dropdownMenu.property("value");
      optionChanged(selectedSample);
    });

    var firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();


