// Jogo: Conexão Campo-Cidade

let player;
let cityX = 700;
let cityY = 250;
let gameState = 'start';
let fieldItems = [];
let itemsCollected = 0;
let score = 0;
let tocou = false;
let obstacles = []; // Array para os obstáculos (animais)
let difficultyTimer;
let difficultyInterval = 10000; // Adicionar um obstáculo a cada 10 segundos

let trilha;
let Collect;

function preload () {
  trilha = loadSound("Dubstep-1.mp3");
  Collect = loadSound("Collect.mp3")
}

function setup() {
  createCanvas(800, 400);
  trilha.loop ();
  
  player = {
    x: 50,
    y: height / 2,
    size: 20,
    speed: 3
  };
  generateFieldItems(5);
  generateObstacles(3); // Começar com 3 obstáculos
  difficultyTimer = millis();
}

function MostrarTexto() {
    text('Colisão detectada, clique espaço 2 vezes  para continuar', width/4, height / 2);
  textSize(25);
}

function draw() {
  fill(0)
  console.log("GameState:", gameState); // Para acompanhamento

  if (gameState === 'end') {
    drawEndScreen();
    return; // Importante: sair da função draw()
  } else if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    background(135, 206, 235); // Céu azul

    drawField();
    drawCity();
    drawFieldItems();
    drawPlayer();
    drawObstacles(); // Desenhar os obstáculos
    handleMovement();
    checkItemCollection();
    checkCityDelivery();
    checkCollision(); // Verificar colisão com obstáculos
    increaseDifficulty(); // Aumentar a dificuldade com o tempo

    // Desenho temporário da caixa de colisão do jogador
    noFill();
    stroke(255, 0, 0); // Vermelho
    rect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

    // Desenho temporário das caixas de colisão dos obstáculos
    stroke(0, 0, 255); // Azul
    for (let obs of obstacles) {
      rect(obs.x, obs.y, obs.width, obs.height);
    }
    noStroke();
    fill(0);
    textSize(16);
    textAlign(RIGHT);
    text(`Coletados: ${itemsCollected}`, width - 10, 20);
    text(`Pontos: ${score}`, width - 10, 40);
    textAlign(LEFT);
   if (tocou == true) {
    MostrarTexto()
  }
  }
}

function drawStartScreen() {
  background(100);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Festa da Conexão", width / 2, height / 2 - 50);
  textSize(18);
  text("Pressione ESPAÇO para começar", width / 2, height / 2 + 20);
  textAlign(CENTER);
  textSize(18);
  text("Use As Flechas Para Movimentar", width / 2, height / 2.5 + 20);
}

function drawEndScreen() {
  background(100);
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Você esbarrou em um animal!", width / 2, height / 2 - 50);
  textSize(18);
  text(`Sua Pontuação: ${score}`, width / 2, height / 2);
  text("Pressione ESPAÇO para reiniciar", width / 2, height / 2 + 40);
  textAlign(LEFT);
}

function drawField() {
  fill(34, 139, 34); // Verde escuro para o campo
  rect(0, 0, 150, height);
  fill(124, 252, 0); // Verde claro dentro do campo
  rect(10, 10, 130, height - 20);
  textSize(16);
  fill(0);
  text("🌾 Campo", 30, 30);
}

function drawCity() {
  fill(169, 169, 169); // Cinza para a cidade
  rect(cityX, cityY, 100, 150);
  fill(255, 215, 0); // Amarelo para destacar a área da festa
  rect(cityX + 10, cityY + 10, 80, 130);
  textSize(16);
  fill(0);
  text("🎉 Cidade", cityX + 20, cityY - 10);
}

function drawPlayer() {
  fill(255, 0, 0);
  rect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

function handleMovement() {
  if (keyIsDown(LEFT_ARROW)) player.x -= player.speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += player.speed;
  if (keyIsDown(UP_ARROW)) player.y -= player.speed;
  if (keyIsDown(DOWN_ARROW)) player.y += player.speed;

  // Limitar o jogador à tela
  player.x = constrain(player.x, player.size / 2, width - player.size / 2);
  player.y = constrain(player.y, player.size / 2, height - player.size / 2);
}

function generateFieldItems(numItems) {
  for (let i = 0; i < numItems; i++) {
    fieldItems.push({
      x: random(20, 140),
      y: random(20, height - 20),
      size: 10,
      color: color(random(255), random(255), random(255))
    });
  } // CHAVE ADICIONADA
}

function drawFieldItems() {
  for (let item of fieldItems) {
    fill(item.color);
    ellipse(item.x, item.y, item.size);
  } // CHAVE ADICIONADA
}

function checkItemCollection() {
  for (let i = fieldItems.length - 1; i >= 0; i--) {
    let item = fieldItems[i];
    if (dist(player.x, player.y, item.x, item.y) < player.size / 2 + item.size / 2) {
      fieldItems.splice(i, 1);
      itemsCollected++;
    }
  }
}

function checkCityDelivery() {
  // Checar se o jogador está perto da cidade (na horizontal)
  if (player.x > cityX && player.x < cityX + 100) {
    // E se coletou pelo menos um item
    if (itemsCollected > 0) {
      score += itemsCollected; // Adiciona os itens coletados à pontuação
      itemsCollected = 0;      // Reseta a contagem de itens coletados
      fieldItems = [];         // Remove os itens antigos
      generateFieldItems(5);   // Gera novos itens no campo
    }
  }
}

function generateObstacles(numObstacles) {
  for (let i = 0; i < numObstacles; i++) {
    obstacles.push({
      x: random(150, cityX), // Entre o campo e a cidade
      y: random(0, height),
      width: 20,
      height: 15,
      speed: random(1, 3) * (random() > 0.5 ? 1 : -1) // Movimento horizontal aleatório
    });
  }
}

function drawObstacles() {
  fill(101, 67, 33); // Cor marrom para os animais
  for (let obs of obstacles) {
    rect(obs.x, obs.y, obs.width, obs.height);
    // Movimentar os obstáculos horizontalmente
    obs.x += obs.speed;
    // Fazer com que os obstáculos voltem ao aparecerem na borda
    if (obs.x > width + obs.width / 2) {
      obs.x = -obs.width / 2;
    } else if (obs.x < -obs.width / 2) {
      obs.x = width + obs.width / 2;
    }
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    // Checar se há sobreposição entre o jogador e o obstáculo
    if (player.x < obs.x + obs.width &&
      player.x + player.size > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.size > obs.y) {
      console.log("COLISÃO DETECTADA!");
      tocou = true
      gameState = 'end';
      noLoop();
    }
  }
}

function increaseDifficulty() {
  if (gameState === 'playing' && millis() > difficultyTimer + difficultyInterval) {
    generateObstacles(1); // Adicionar um novo obstáculo
    difficultyTimer = millis();
  }
}

function keyPressed() {
  if (gameState === 'start' && keyCode === 32) {
    gameState = 'playing';
    loop();
    difficultyTimer = millis(); // Reiniciar o timer de dificuldade ao começar
  } else if (gameState === 'end' && keyCode === 32) {
    Collect.play();
    tocou = false;
    gameState = 'playing';
    loop();
    itemsCollected = 0;
    score = 0;
    fieldItems = [];
    generateFieldItems(5);
    obstacles = [];
    generateObstacles(3);
    difficultyTimer = millis(); // Reiniciar o timer de dificuldade ao reiniciar
  } else if (gameState === 'playing' && key === 'e') { // Para teste da tela de fim (remover depois)
    gameState = 'end';
    noLoop();
  }
}