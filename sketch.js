let table;
let rivers = [];
let minTemps = [];
let maxTemps = [];
let avgTemps = [];
let scrollOffset = 0;
let hoveredRiver = null;

function preload() {
  table = loadTable("data/rivers.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadDataFromCSV();
}

//sfondo canvas
function draw() {
  background(248, 254, 250);

  //scorrimento
  push();
  translate(0, scrollOffset);

  drawAxes();
  drawSegments();
  pop();

  //highlight hover
  if (hoveredRiver) {
    displayHoveredRiver();
  }

  //legenda
  drawLegend();
  drawLabels();
}


//itera su tutte le righe del dataset e salva i dati nei rispettivi array
function loadDataFromCSV() {
  for (let i = 0; i < table.getRowCount(); i++) {
    const riverName = table.getString(i, "name").trim();
    const minTemp = parseFloat(table.getString(i, "min_temp"));
    const maxTemp = parseFloat(table.getString(i, "max_temp"));
    const avgTemp = parseFloat(table.getString(i, "avg_temp"));

    if (!isNaN(minTemp) && !isNaN(maxTemp) && !isNaN(avgTemp)) {
      rivers.push(riverName);
      minTemps.push(minTemp);
      maxTemps.push(maxTemp);
      avgTemps.push(avgTemp);
    }
  }
}

function drawAxes() { //assi main
  stroke(0);
  strokeWeight(1);
  line(140, map(0, -50, 50, height - 50, 50), width - 100, map(0, -50, 50, height - 50, 50)); //asse X
  line(140, height - 50, 140, 50); //asse Y

  for (let t = -50; t <= 50; t += 10) {
    let y = map(t, -50, 50, height - 50, 50);
    stroke(200);
    line(130, y, 140, y);
    noStroke();
    fill(0);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(`${t}°C`, 125, y);
  }
}

function drawSegments() {
  let xSpacing = (width - 300) / rivers.length;
  hoveredRiver = null; //reset post-hover

  for (let i = 0; i < rivers.length; i++) {
    let x = 160 + i * xSpacing;

    //controllo se mouse copre segmento (hover)
    let isHovered = dist(mouseX, mouseY - scrollOffset, x, map(0, -50, 50, height - 50, 50)) < 10;

    //evidenzia se coperto da mouse (hover)
    let segmentWeight = isHovered ? 6 : 2;
    if (isHovered) {
      hoveredRiver = rivers[i];
    }

    //segmenti
    drawSingleRiverSegment(x, minTemps[i], avgTemps[i], maxTemps[i], segmentWeight);
  }
}

//"macrosegmento"
function drawSingleRiverSegment(x, minTemp, avgTemp, maxTemp, segmentWeight) {
  let yMin = map(minTemp, -50, 50, height - 50, 50);
  let yAvgLower = map(avgTemp - (avgTemp - minTemp) / 2, -50, 50, height - 50, 50);
  let yAvgUpper = map(avgTemp + (maxTemp - avgTemp) / 2, -50, 50, height - 50, 50);
  let yMax = map(maxTemp, -50, 50, height - 50, 50);

  strokeWeight(segmentWeight);

  // segmento temp MIN
  stroke("#60a8c4");
  line(x, yMin, x, yAvgLower);

  // segmento temp AVG
  stroke("#7ad5ea");
  line(x, yAvgLower, x, yAvgUpper);

  // segmento temp MAX
  stroke("#ffb3b3");
  line(x, yAvgUpper, x, yMax);
}

function displayHoveredRiver() {
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text(hoveredRiver, mouseX, mouseY - 20);
}

//legenda
function drawLegend() {
  let legendX = 50;
  let legendY = height - 100;
  let boxSize = 20;

  fill(246, 254, 248);
  noStroke();
  rect(legendX - 10, legendY - 40, 220, 120, 10); 

  fill("#60a8c4");
  rect(legendX, legendY, boxSize, boxSize);
  fill(0);
  textSize(12);
  text("min", legendX + boxSize + 20, legendY + boxSize / 2); 

  fill("#7ad5ea");
  rect(legendX, legendY + 30, boxSize, boxSize);
  fill(0);
  textSize(12);
  text("avg", legendX + boxSize + 20, legendY + 30 + boxSize / 2); 

  fill("#ffb3b3");
  rect(legendX, legendY + 60, boxSize, boxSize);
  fill(0);
  textSize(12);
  text("max", legendX + boxSize + 20, legendY + 60 + boxSize / 2); 
}

function drawLabels() {
  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("Rivers (hover)", width / 2, height - 20);
}

//scorrimento verticale
function mouseWheel(event) {
  scrollOffset -= event.delta;
  scrollOffset = constrain(scrollOffset, -400, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}