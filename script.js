const board = document.getElementById('board');
const playerCountSelect = document.getElementById('player-count');
const startBtn = document.getElementById('start-btn');
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');
const exitBtn = document.getElementById('exit-btn');
const turnInfo = document.getElementById('turn-info');
const scoresDiv = document.getElementById('scores');
const diceResultSpan = document.getElementById('dice-result');
const winnerDiv = document.getElementById('winner');
const menu = document.getElementById('menu');
const game = document.getElementById('game');

const questionBox = document.getElementById('question-box');
const questionText = document.getElementById('question-text');
const choicesDiv = document.getElementById('choices');

const maxPosition = 40;
let playerCount = 0;
let positions = [];
let scores = [];
let currentPlayerIndex = 0;
let isQuestionActive = false;

// Tangga dan ular (posisi awal → posisi akhir)
const ladders = {
  1: 7,
  4: 14,
  9: 18,
  21: 28,
  36: 40
};

const snakes = {
  10: 5,
  16: 8,
  26: 12,
  34: 24,
  39: 31
};

// Contoh 40 soal TKJ pilihan ganda (singkat)
const questions = [
  { question: "Apa fungsi Access Point?", choices: ["Menghubungkan perangkat nirkabel", "Menyimpan data", "Menghubungkan kabel", "Menyalakan komputer"], answer: 0 },
  { question: "Apa itu IP Address?", choices: ["Alamat fisik perangkat", "Alamat logis perangkat", "Nama perangkat", "Port perangkat"], answer: 1 },
  { question: "Port standar HTTP adalah?", choices: ["80", "21", "443", "8080"], answer: 0 },
  { question: "Apa itu DHCP?", choices: ["Protokol pengalamatan otomatis", "Pengirim email", "Protokol transfer file", "Server web"], answer: 0 },
  { question: "Apa fungsi firewall?", choices: ["Melindungi jaringan", "Mempercepat jaringan", "Menghubungkan jaringan", "Memantau listrik"], answer: 0 },
  { question: "Jenis kabel untuk jaringan LAN?", choices: ["Coaxial", "UTP", "HDMI", "USB"], answer: 1 },
  { question: "Perangkat yang menghubungkan beberapa jaringan?", choices: ["Switch", "Router", "Hub", "Modem"], answer: 1 },
  { question: "Apa itu DNS?", choices: ["Mengubah IP ke nama domain", "Mengirim data", "Menyimpan data", "Mengatur jaringan"], answer: 0 },
  { question: "Protokol email?", choices: ["SMTP", "FTP", "HTTP", "SNMP"], answer: 0 },
  { question: "Apa itu VPN?", choices: ["Jaringan pribadi virtual", "Protokol jaringan", "Server web", "Firewall"], answer: 0 },
  { question: "Apa kepanjangan dari CPU?", choices: ["Central Processing Unit", "Computer Processing Unit", "Central Power Unit", "Computer Power Unit"], answer: 0 },
  { question: "Sistem operasi yang bersifat open source?", choices: ["Windows", "Linux", "macOS", "iOS"], answer: 1 },
  { question: "Perangkat lunak antivirus?", choices: ["Hardware", "Software", "Firmware", "Middleware"], answer: 1 },
  { question: "Apa itu SSD?", choices: ["Hard disk tradisional", "Solid State Drive", "Jenis RAM", "Software"], answer: 1 },
  { question: "Bahasa pemrograman Python digunakan untuk?", choices: ["Web", "Data science", "Game", "Semua benar"], answer: 3 },
  { question: "Apa itu HTML?", choices: ["Bahasa pemrograman", "Bahasa markup", "Software", "Hardware"], answer: 1 },
  { question: "Apa itu CSS?", choices: ["Bahasa pemrograman", "Bahasa styling", "Software", "Hardware"], answer: 1 },
  { question: "Apa fungsi switch?", choices: ["Menghubungkan perangkat dalam satu jaringan", "Menghubungkan jaringan berbeda", "Menghubungkan internet", "Mempercepat sinyal"], answer: 0 },
  { question: "Apa itu Modem?", choices: ["Penghubung internet", "Perangkat penyimpan", "Server", "Klien"], answer: 0 },
  { question: "IP Address versi 4 berjumlah?", choices: ["32 bit", "64 bit", "128 bit", "16 bit"], answer: 0 },
  { question: "Firewall bekerja di layer?", choices: ["Network", "Data Link", "Transport", "Physical"], answer: 0 },
  { question: "Apa itu protokol TCP?", choices: ["Protokol komunikasi andal", "Protokol tidak andal", "Protokol transfer file", "Protokol jaringan"], answer: 0 },
  { question: "Apa fungsi DNS?", choices: ["Memetakan domain ke IP", "Memetakan IP ke MAC", "Mengirim data", "Menerima data"], answer: 0 },
  { question: "Apa itu subnet mask?", choices: ["Pembagi jaringan", "Alamat IP", "Port", "Firewall"], answer: 0 },
  { question: "Apa kegunaan router?", choices: ["Mengarahkan paket data", "Menyimpan data", "Menerima email", "Membuat jaringan"], answer: 0 },
  { question: "Kabel UTP biasa dipakai untuk?", choices: ["Jaringan LAN", "Audio", "Video", "USB"], answer: 0 },
  { question: "Apa itu LAN?", choices: ["Jaringan lokal", "Jaringan luas", "Internet", "Modem"], answer: 0 },
  { question: "Jenis kabel yang digunakan untuk jaringan fiber?", choices: ["Optic fiber", "Coaxial", "UTP", "HDMI"], answer: 0 },
  { question: "Apa itu HTTP?", choices: ["Protokol web", "Protokol email", "Protokol jaringan", "Protokol transfer file"], answer: 0 },
  { question: "Port HTTPS adalah?", choices: ["443", "80", "21", "22"], answer: 0 },
  { question: "Apa itu FTP?", choices: ["Transfer file", "Firewall", "Jaringan", "Server"], answer: 0 },
  { question: "Apa itu IP statis?", choices: ["IP tetap", "IP berubah", "IP sementara", "IP acak"], answer: 0 },
  { question: "Perangkat untuk menghubungkan kabel?", choices: ["Switch", "Hub", "Router", "Modem"], answer: 1 },
  { question: "Apa fungsi DHCP server?", choices: ["Memberi IP otomatis", "Menyimpan data", "Menghubungkan perangkat", "Mengatur jaringan"], answer: 0 },
  { question: "Apa itu MAC address?", choices: ["Alamat fisik perangkat", "Alamat logis perangkat", "Nama pengguna", "Port perangkat"], answer: 0 },
  { question: "Apa fungsi proxy?", choices: ["Perantara akses internet", "Penyimpan data", "Firewall", "Server web"], answer: 0 },
  { question: "Apa itu cloud computing?", choices: ["Komputasi awan", "Penyimpanan lokal", "Server", "Firewall"], answer: 0 },
  { question: "Bahasa pemrograman untuk web?", choices: ["JavaScript", "Python", "C++", "Assembly"], answer: 0 },
  { question: "Apa itu software open source?", choices: ["Sumber terbuka", "Sumber tertutup", "Gratis", "Berbayar"], answer: 0 }
];

function createBoard() {
  board.innerHTML = "";
  // Buat 40 kotak dengan nomor dan ikon tangga/ular
  for(let i = maxPosition; i >= 1; i--) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.pos = i;

    const numberDiv = document.createElement('div');
    numberDiv.classList.add('number');
    numberDiv.textContent = i;
    cell.appendChild(numberDiv);

    // Jika ada tangga di posisi ini
    if(ladders[i]) {
      const ladderIcon = document.createElement('div');
      ladderIcon.classList.add('ladder-icon');
      ladderIcon.title = `Tangga ke ${ladders[i]}`;
      ladderIcon.textContent = '⬆️';
      cell.appendChild(ladderIcon);
    }

    // Jika ada ular di posisi ini
    if(snakes[i]) {
      const snakeIcon = document.createElement('div');
      snakeIcon.classList.add('snake-icon');
      snakeIcon.title = `Ular ke ${snakes[i]}`;
      snakeIcon.textContent = '🐍';
      cell.appendChild(snakeIcon);
    }

    board.appendChild(cell);
  }
}

function updateTokens() {
  // Hapus token lama
  document.querySelectorAll('.token').forEach(t => t.remove());

  // Tambah token baru sesuai posisi pemain
  positions.forEach((pos, i) => {
    const cell = board.querySelector(`.cell[data-pos="${pos}"]`);
    if(cell) {
      const token = document.createElement('div');
      token.classList.add('token', `player-${i}`);
      // Tempatkan token berbeda posisi untuk tiap pemain agar tidak tumpang tindih
      token.style.right = `${5 + i*25}px`;
      cell.appendChild(token);
    }
  });
}

function updateScores() {
  let html = '';
  for(let i=0; i<playerCount; i++) {
    html += `Pemain ${i+1} <span style="color:${getPlayerColor(i)};">●</span>: ${scores[i]} poin<br>`;
  }
  scoresDiv.innerHTML = html;
}

function getPlayerColor(index) {
  const colors = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50'];
  return colors[index] || '#999';
}

function showQuestion(pos) {
  const qIndex = (pos - 1) % questions.length;
  const q = questions[qIndex];
  questionText.textContent = q.question;
  choicesDiv.innerHTML = '';
  q.choices.forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.classList.add('choice-btn');
    btn.onclick = () => answerQuestion(idx, q.answer);
    choicesDiv.appendChild(btn);
  });
  questionBox.style.display = 'block';
  isQuestionActive = true;
  rollBtn.disabled = true;
}

function answerQuestion(selected, correct) {
  if(!isQuestionActive) return;
  isQuestionActive = false;
  const buttons = choicesDiv.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if(idx === correct) btn.classList.add('correct');
    if(idx === selected && selected !== correct) btn.classList.add('wrong');
  });

  if(selected === correct) {
    scores[currentPlayerIndex]++;
    turnInfo.textContent = `Jawaban benar! Pemain ${currentPlayerIndex + 1} mendapat 1 poin.`;
  } else {
    turnInfo.textContent = `Jawaban salah! Pemain ${currentPlayerIndex + 1} tidak mendapat poin.`;
  }
  updateScores();

  // Setelah 2 detik, sembunyikan soal dan lanjut giliran
  setTimeout(() => {
    questionBox.style.display = 'none';
    nextTurn();
  }, 2000);
}

function rollDice() {
  if(isQuestionActive) return;
  const dice = Math.floor(Math.random() * 6) + 1;
  diceResultSpan.textContent = dice;
  movePlayer(dice);
}

function movePlayer(dice) {
  let newPos = positions[currentPlayerIndex] + dice;
  if(newPos > maxPosition) newPos = maxPosition; // Tidak lewat max posisi

  // Cek tangga
  if(ladders[newPos]) {
    newPos = ladders[newPos];
    turnInfo.textContent = `Pemain ${currentPlayerIndex + 1} naik tangga ke ${newPos}!`;
  }

  // Cek ular
  if(snakes[newPos]) {
    newPos = snakes[newPos];
    turnInfo.textContent = `Pemain ${currentPlayerIndex + 1} turun ular ke ${newPos}!`;
  }

  positions[currentPlayerIndex] = newPos;
  updateTokens();

  // Tampilkan soal di posisi baru
  showQuestion(newPos);

  // Jika sudah sampai akhir
  if(newPos === maxPosition) {
    winnerDiv.textContent = `Pemain ${currentPlayerIndex + 1} memenangkan permainan dengan skor ${scores[currentPlayerIndex]}! 🎉`;
    rollBtn.disabled = true;
  }
}

function nextTurn() {
  if(positions[currentPlayerIndex] === maxPosition) return; // Game selesai

  currentPlayerIndex = (currentPlayerIndex + 1) % playerCount;
  turnInfo.textContent = `Giliran Pemain ${currentPlayerIndex + 1}`;
  diceResultSpan.textContent = '-';
  rollBtn.disabled = false;
}

function startGame() {
  playerCount = Number(playerCountSelect.value);
  if(playerCount < 2 || playerCount > 4) {
    alert('Pilih jumlah pemain antara 2 hingga 4!');
    return;
  }

  positions = Array(playerCount).fill(1);
  scores = Array(playerCount).fill(0);
  currentPlayerIndex = 0;
  winnerDiv.textContent = '';
  turnInfo.textContent = `Giliran Pemain 1`;
  diceResultSpan.textContent = '-';
  rollBtn.disabled = false;
  questionBox.style.display = 'none';

  createBoard();
  updateTokens();
  updateScores();

  menu.style.display = 'none';
  game.style.display = 'flex';
}

function resetGame() {
  positions = Array(playerCount).fill(1);
  scores = Array(playerCount).fill(0);
  currentPlayerIndex = 0;
  winnerDiv.textContent = '';
  turnInfo.textContent = `Giliran Pemain 1`;
  diceResultSpan.textContent = '-';
  rollBtn.disabled = false;
  questionBox.style.display = 'none';

  updateTokens();
  updateScores();
}

function exitGame() {
  menu.style.display = 'block';
  game.style.display = 'none';
  resetGame();
}

// Event Listeners
startBtn.addEventListener('click', startGame);
rollBtn.addEventListener('click', rollDice);
resetBtn.addEventListener('click', resetGame);
exitBtn.addEventListener('click', exitGame);
