// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let obj = metadata.filter(obj => obj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(obj).forEach(([key, value]) => {
      d3.select('#sample-metadata').append('p').text(key.toString().toUpperCase() + ": " + value.toString());
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let obj = samples.filter(obj => obj.id == sample)[0];
    console.log(obj);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = obj.otu_ids;
    let otu_labels = obj.otu_labels;
    let sample_values = obj.sample_values;

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }

    let bubble_data = [trace1]

    // Render the Bubble Chart
    let bubble_layout = {
      title: {text: 'Bacteria Cultures Per Sample'},
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = {
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h' 
    };

    let bar_data = [trace2]

    // Render the Bar Chart
    let bar_layout = {
      text: {title: "Top 10 Bacteria Cultures Found"},
      xaxis: {title: "Number of Bacteria"}
    };

    Plotly.newPlot("bar", bar_data, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });
    // Get the first sample from the list
    let first_sample = names[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
