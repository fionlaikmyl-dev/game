// 2D Walking Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const promptDiv = document.getElementById('prompt');

// Map grid: 0 = path, 1 = wall, 2 = department store, 3 = convenience store, 4 = post office, 5 = bank, 6 = bakery, 7 = jewellery shop, 8 = clinic, 9 = sports centre, 10 = supermarket, 11 = train station, 12 = health and beauty store, 13 = learning centre, 14 = hospital
const map = [
  [1,1,1,1,1,1,1],
  [1,5,0,15,0,9,1],
  [1,12,0,15,0,8,1],
  [1,13,0,0,0,4,1],
  [1,6,0,15,0,2,1],
  [1,0,0,0,0,0,1],
  [1,14,0,15,0,0,1],
  [1,0,0,0,0,0,1],
  [1,0,0,15,0,0,1],
  [1,1,1,1,1,1,1,1]
];
const tileSize = 40;
canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize;

// Player state
let player = {
  x: 2,
  y: 2,
  dir: 0 // 0=right, 1=down, 2=left, 3=up
};

const directions = ['right', 'down', 'left', 'up'];

const placeNames = {
  0: 'a path',
  1: 'a wall',
  2: 'the Department Store',
  3: 'the Convenience Store',
  4: 'the Post Office',
  5: 'the Bank',
  6: 'the Bakery',
  7: 'the Jewellery Shop',
  8: 'the Clinic',
  9: 'the Sports Centre',
  10: 'the Supermarket',
  11: 'the Train Station',
  12: 'the Health and Beauty Store',
  13: 'the Learning Centre',
  14: 'the Hospital',
  15: 'a Zebra Crossing'
};

const placeActions = {
  2: 'buy furniture',
  3: '',
  4: 'post a letter / post a parcel',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: 'buy groceries',
  11: '',
  12: '',
  13: 'take a course',
  14: ''
};

const placeShortNames = {
  2: 'Dept Store',
  3: 'Convenience',
  4: 'Post Office',
  5: 'Bank',
  6: 'Bakery',
  7: 'Jewellery',
  8: 'Clinic',
  9: 'Sports',
  10: 'Supermarket',
  11: 'Train Stn',
  12: 'Health & Beauty',
  13: 'Learning Ctr',
  14: 'Hospital'
};

const placeColors = {
  2: '#ffd600',
  3: '#00e676',
  4: '#ff5722',
  5: '#2196f3',
  6: '#ff9800',
  7: '#9c27b0',
  8: '#e91e63',
  9: '#4caf50',
  10: '#00bcd4',
  11: '#607d8b',
  12: '#795548',
  13: '#3f51b5',
  14: '#f44336',
  15: '#ffffff'
};

function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === 1) ctx.fillStyle = '#bdbdbd';
      else if (map[y][x] === 0) ctx.fillStyle = '#fffde7';
      else if (map[y][x] === 15) ctx.fillStyle = '#ffffff';
      else ctx.fillStyle = placeColors[map[y][x]] || '#fff';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      if (map[y][x] === 15) {
        ctx.fillStyle = '#000';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(x * tileSize + i * 8, y * tileSize + 8, 4, tileSize - 16);
        }
      }
      ctx.strokeStyle = '#aaa';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

      if (map[y][x] > 1 && map[y][x] !== 15) {
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let label = placeShortNames[map[y][x]] || placeNames[map[y][x]].replace('the ', '');
        if (label.length > 10) label = label.slice(0, 10) + '...';
        ctx.fillText(label, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
      }
    }
  }
  // Draw player
  ctx.save();
  ctx.translate(player.x * tileSize + tileSize/2, player.y * tileSize + tileSize/2);
  ctx.rotate(player.dir * Math.PI/2);
  ctx.fillStyle = '#1976d2';
  ctx.beginPath();
  ctx.arc(0, 0, tileSize/3, 0, 2*Math.PI);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(tileSize/6, 0, tileSize/8, 0, 2*Math.PI);
  ctx.fill();
  ctx.restore();
}

function walkStraightAhead() {
  let dx = [1,0,-1,0][player.dir];
  let dy = [0,1,0,-1][player.dir];
  let nx = player.x + dx;
  let ny = player.y + dy;
  if (nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length) {
    promptDiv.textContent = 'Cannot walk straight ahead, outside map bounds.';
    return;
  }
  if (map[ny][nx] === 1) {
    promptDiv.textContent = 'Cannot walk straight ahead, the way is blocked by a wall.';
    return;
  }
  if (map[ny][nx] === 15) {
    promptDiv.textContent = 'Cannot walk straight ahead: zebra crossing must be crossed with "Walk Across".';
    return;
  }
  player.x = nx;
  player.y = ny;
  showPrompt();
  drawMap();
}

function walkAcross() {
  let dx = [1,0,-1,0][player.dir];
  let dy = [0,1,0,-1][player.dir];
  let firstX = player.x + dx;
  let firstY = player.y + dy;
  let secondX = player.x + dx * 2;
  let secondY = player.y + dy * 2;
  if (firstX < 0 || firstX >= map[0].length || firstY < 0 || firstY >= map.length) {
    promptDiv.textContent = 'Cannot walk across, no ground in front.';
    return;
  }
  if (map[firstY][firstX] !== 15) {
    promptDiv.textContent = 'Cannot walk across: zebra crossing is required.';
    return;
  }
  if (secondX < 0 || secondX >= map[0].length || secondY < 0 || secondY >= map.length || map[secondY][secondX] === 1) {
    promptDiv.textContent = 'Cannot finish walk across, destination is blocked.';
    return;
  }
  player.x = secondX;
  player.y = secondY;
  showPrompt();
  drawMap();
}

function turnLeft() {
  player.dir = (player.dir + 3) % 4;
  showPrompt();
  drawMap();
}

function turnRight() {
  player.dir = (player.dir + 1) % 4;
  showPrompt();
  drawMap();
}

function showPrompt() {
  let currentCode = map[player.y][player.x];
  let current = placeNames[currentCode];
  let prompt = `You are at ${current}.`;
  if (currentCode > 1) {
    let action = placeActions[currentCode];
    if (action) prompt += ` You can ${action}.`;
  }
  // Check directions
  let dirs = [
    {name: 'in front of you', d: 0},
    {name: 'on your left', d: 3},
    {name: 'on your right', d: 1},
    {name: 'behind you', d: 2}
  ];
  for (let d of dirs) {
    let dir = (player.dir + d.d) % 4;
    let dx = [1,0,-1,0][dir];
    let dy = [0,1,0,-1][dir];
    let nx = player.x + dx;
    let ny = player.y + dy;
    if (nx >=0 && nx < map[0].length && ny >=0 && ny < map.length && map[ny][nx] >1) {
      let place = placeNames[map[ny][nx]];
      prompt += ` The ${place} is ${d.name}.`;
    }
  }
  // Check diagonals for "next to"
  let diagonals = [
    {dx:1, dy:1},
    {dx:1, dy:-1},
    {dx:-1, dy:1},
    {dx:-1, dy:-1}
  ];
  for (let diag of diagonals) {
    let nx = player.x + diag.dx;
    let ny = player.y + diag.dy;
    if (nx >=0 && nx < map[0].length && ny >=0 && ny < map.length && map[ny][nx] >1) {
      let place = placeNames[map[ny][nx]];
      prompt += ` The ${place} is next to you.`;
    }
  }
  // Check opposite
  let frontDir = player.dir;
  let oppDx = [1,0,-1,0][frontDir] * 2;
  let oppDy = [0,1,0,-1][frontDir] * 2;
  let oppNx = player.x + oppDx;
  let oppNy = player.y + oppDy;
  if (oppNx >=0 && oppNx < map[0].length && oppNy >=0 && oppNy < map.length && map[oppNy][oppNx] >1) {
    let place = placeNames[map[oppNy][oppNx]];
    prompt += ` The ${place} is opposite you.`;
  }
  // Check if at corner
  let leftDir = (player.dir + 3) % 4;
  let rightDir = (player.dir + 1) % 4;
  let leftDx = [1,0,-1,0][leftDir];
  let leftDy = [0,1,0,-1][leftDir];
  let leftNx = player.x + leftDx;
  let leftNy = player.y + leftDy;
  let rightDx = [1,0,-1,0][rightDir];
  let rightDy = [0,1,0,-1][rightDir];
  let rightNx = player.x + rightDx;
  let rightNy = player.y + rightDy;
  if ((leftNx >=0 && leftNx < map[0].length && leftNy >=0 && leftNy < map.length && map[leftNy][leftNx] !== 1) &&
      (rightNx >=0 && rightNx < map[0].length && rightNy >=0 && rightNy < map.length && map[rightNy][rightNx] !== 1)) {
    let leftPlace = placeNames[map[leftNy][leftNx]] || 'a path';
    let rightPlace = placeNames[map[rightNy][rightNx]] || 'a path';
    if (map[leftNy][leftNx] > 1 && map[rightNy][rightNx] > 1) {
      prompt += ` You are at the corner of ${leftPlace} and ${rightPlace}.`;
    } else {
      prompt += ` You are at a corner.`;
    }
  }
  // Check if at end of road
  let endDx = [1,0,-1,0][player.dir];
  let endDy = [0,1,0,-1][player.dir];
  let endNx = player.x + endDx;
  let endNy = player.y + endDy;
  if (endNx >=0 && endNx < map[0].length && endNy >=0 && endNy < map.length && map[endNy][endNx] === 1) {
    prompt += ` You are at the end of the road.`;
  }
  promptDiv.textContent = prompt;
}

function checkDirection(type) {
  let result = '';
  let dir;
  if (type === 'left') dir = (player.dir + 3) % 4;
  else if (type === 'right') dir = (player.dir + 1) % 4;
  else if (type === 'opposite') dir = (player.dir + 2) % 4;

  if (type === 'next') {
    let neighbors = [];
    let checks = [
      {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}
    ];
    checks.forEach(c => {
      let nx = player.x + c.dx;
      let ny = player.y + c.dy;
      if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] > 1) {
        neighbors.push(placeNames[map[ny][nx]]);
      }
    });
    result = neighbors.length ? `Next to: ${neighbors.join(', ')}.` : 'No adjacent significant location next to you.';
    promptDiv.textContent = result;
    return;
  }

  if (dir !== undefined) {
    let nx = player.x + [1,0,-1,0][dir];
    let ny = player.y + [0,1,0,-1][dir];
    if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && map[ny][nx] > 1) {
      result = `${placeNames[map[ny][nx]]} is ${type.replace('opposite','opposite you').replace('left','on your left').replace('right','on your right')}.`;
    } else {
      result = `No significant place ${type} of you.`;
    }
    promptDiv.textContent = result;
    return;
  }
}

function checkCorner() {
  let leftDir = (player.dir + 3) % 4;
  let rightDir = (player.dir + 1) % 4;
  let leftNx = player.x + [1,0,-1,0][leftDir];
  let leftNy = player.y + [0,1,0,-1][leftDir];
  let rightNx = player.x + [1,0,-1,0][rightDir];
  let rightNy = player.y + [0,1,0,-1][rightDir];
  if (leftNx >=0 && leftNx < map[0].length && leftNy >=0 && leftNy < map.length && rightNx >=0 && rightNx < map[0].length && rightNy >=0 && rightNy < map.length) {
    let leftName = placeNames[map[leftNy][leftNx]] || 'a path';
    let rightName = placeNames[map[rightNy][rightNx]] || 'a path';
    promptDiv.textContent = `At the corner of ${leftName} and ${rightName}.`;
  } else {
    promptDiv.textContent = 'Not at a corner.';
  }
}

function checkEndOfRoad() {
  let frontX = player.x + [1,0,-1,0][player.dir];
  let frontY = player.y + [0,1,0,-1][player.dir];
  if (frontX >=0 && frontX < map[0].length && frontY >=0 && frontY < map.length && map[frontY][frontX] === 1) {
    promptDiv.textContent = 'You are at the end of the road.';
  } else {
    promptDiv.textContent = 'You are not at the end of the road.';
  }
}

drawMap();
showPrompt();

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') walkStraightAhead();
  else if (e.key === 'ArrowLeft') turnLeft();
  else if (e.key === 'ArrowRight') turnRight();
});
