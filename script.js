google.charts.load("current", { packages: ["gauge"] });

google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRew3cVdYepsxnU7Icyoc_PjfT6AUatvXE5Bbwhyt7oRj0mGRzKrgR3heGwJDkFaEmS1h4djrehafU/pub?gid=227058039&single=true&output=csv";

  try {
    const response = await fetch(sheetUrl);

    const csvData = await response.text();

    // Split the CSV data into rows and then cells

    const rows = csvData.split("\n");

    const data = rows.map((row) => row.split(",")); // Split by comma for CSV

    // Assuming your metrics are in row 12, column 21 and row 14, column 21 (CSV is 0-indexed, and Google Sheets' "column 22" is index 21)
    const metric1Text = data[11][20];
    const metric2Text = data[13][20];

    const metric1Value = parseFloat(metric1Text.replace("%", "")) || 0;

    let metric2Value = parseFloat(metric2Text);

    if (isNaN(metric2Value)) {
      const dateParts = metric2Text.split("/");

      if (dateParts.length === 3) {
        metric2Value = parseInt(dateParts[0]);
      } else {
        metric2Value = 0;
      }
    }

    const data1 = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["", metric1Value],
    ]);

    const options1 = {
      width: 781,
      height: 312,
      redFrom: 0,
      redTo: 60,
      yellowFrom: 60,
      yellowTo: 80,
      greenFrom: 80,
      greenTo: 100,
      minorTicks: 5,
      majorTicks: [],
    };

    const data2 = google.visualization.arrayToDataTable([
      ["Label", "Value"],
      ["", metric2Value],
    ]);

    const options2 = {
      width: 781,
      height: 312,
      greenFrom: 0,
      greenTo: 100,
      minorTicks: 5,
      max: 365,
      majorTicks: [],
    };

    const chart1 = new google.visualization.Gauge(
      document.getElementById("chart_div1")
    );

    chart1.draw(data1, options1);

    const chart2 = new google.visualization.Gauge(
      document.getElementById("chart_div2")
    );

    chart2.draw(data2, options2);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}
