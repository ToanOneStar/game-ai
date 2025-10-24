// Đất Nước Vươn Mình - The Rising Nation Quiz Game
// Vietnamese RPG Quiz Game with Timer and Score History

class RisingNationGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'difficulty'; // 'difficulty', 'playing', 'gameOver', 'history'
        this.difficulty = null;
        this.timeLeft = 60;
        this.score = 0;
        this.gameRunning = false;
        this.keys = {};
        this.currentZone = null;
        this.showQuiz = false;
        this.quizData = null;
        this.visitedZones = [];
        this.gameStartTime = null;
        this.timerInterval = null;
        
        // Player character
        this.player = {
            x: 400,
            y: 300,
            width: 20,
            height: 20,
            speed: 3,
            color: '#e74c3c',
            direction: 'down'
        };
        
        // Map areas with quiz questions
        this.mapAreas = [
            { 
                x: 0, y: 0, width: 200, height: 150, 
                color: '#27ae60', name: 'Nông nghiệp', 
                sector: 'agriculture',
                questions: [
                    {
                        text: "Công nghệ IoT trong nông nghiệp giúp gì?",
                        options: ["Tăng năng suất cây trồng", "Giảm chất lượng sản phẩm", "Làm chậm quá trình sản xuất"],
                        correct: 0
                    },
                    {
                        text: "Nông nghiệp thông minh sử dụng công nghệ gì?",
                        options: ["Cảm biến và AI", "Chỉ dùng phân bón", "Không cần công nghệ"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 200, y: 0, width: 200, height: 150, 
                color: '#3498db', name: 'Công nghệ', 
                sector: 'technology',
                questions: [
                    {
                        text: "Trí tuệ nhân tạo giúp ích gì trong chuyển đổi số?",
                        options: ["Tăng tốc xử lý dữ liệu", "Làm chậm hệ thống", "Giảm năng suất"],
                        correct: 0
                    },
                    {
                        text: "Blockchain có ứng dụng gì trong chính phủ số?",
                        options: ["Tăng tính minh bạch", "Giảm bảo mật", "Làm chậm giao dịch"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 400, y: 0, width: 200, height: 150, 
                color: '#f39c12', name: 'Giáo dục', 
                sector: 'education',
                questions: [
                    {
                        text: "Giáo dục số hóa mang lại lợi ích gì?",
                        options: ["Tiếp cận học tập mọi lúc mọi nơi", "Giảm chất lượng giảng dạy", "Tăng chi phí học tập"],
                        correct: 0
                    },
                    {
                        text: "E-learning giúp học sinh như thế nào?",
                        options: ["Học tập linh hoạt", "Giảm khả năng tư duy", "Tăng áp lực học tập"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 600, y: 0, width: 200, height: 150, 
                color: '#f1c40f', name: 'Năng lượng', 
                sector: 'energy',
                questions: [
                    {
                        text: "Năng lượng tái tạo có ưu điểm gì?",
                        options: ["Thân thiện với môi trường", "Gây ô nhiễm cao", "Chi phí vận hành đắt"],
                        correct: 0
                    },
                    {
                        text: "Điện mặt trời giúp gì cho Việt Nam?",
                        options: ["Giảm phụ thuộc nhiên liệu hóa thạch", "Tăng ô nhiễm môi trường", "Giảm hiệu quả sản xuất"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 0, y: 150, width: 200, height: 150, 
                color: '#e74c3c', name: 'Công nghiệp', 
                sector: 'industry',
                questions: [
                    {
                        text: "Công nghiệp 4.0 tập trung vào gì?",
                        options: ["Tự động hóa và kết nối", "Sản xuất thủ công", "Giảm chất lượng sản phẩm"],
                        correct: 0
                    },
                    {
                        text: "Smart factory có lợi ích gì?",
                        options: ["Tăng hiệu quả sản xuất", "Giảm chất lượng sản phẩm", "Tăng chi phí vận hành"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 200, y: 150, width: 200, height: 150, 
                color: '#9b59b6', name: 'Văn hóa', 
                sector: 'culture',
                questions: [
                    {
                        text: "Bảo tồn văn hóa truyền thống quan trọng vì sao?",
                        options: ["Giữ gìn bản sắc dân tộc", "Cản trở phát triển", "Tăng chi phí xã hội"],
                        correct: 0
                    },
                    {
                        text: "Số hóa di sản văn hóa có lợi ích gì?",
                        options: ["Bảo tồn và phổ biến", "Làm mất giá trị truyền thống", "Giảm sự quan tâm"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 400, y: 150, width: 200, height: 150, 
                color: '#95a5a6', name: 'Hạ tầng', 
                sector: 'infrastructure',
                questions: [
                    {
                        text: "Hạ tầng số có vai trò gì?",
                        options: ["Kết nối và phát triển kinh tế", "Làm chậm giao thông", "Tăng chi phí vận hành"],
                        correct: 0
                    },
                    {
                        text: "5G giúp gì cho hạ tầng thông tin?",
                        options: ["Tăng tốc độ kết nối", "Giảm chất lượng dịch vụ", "Tăng chi phí sử dụng"],
                        correct: 0
                    }
                ]
            },
            { 
                x: 600, y: 150, width: 200, height: 150, 
                color: '#2c3e50', name: 'Trung tâm', 
                sector: 'center',
                questions: [
                    {
                        text: "Trung tâm quốc gia cần có gì?",
                        options: ["Hệ thống quản lý hiện đại", "Công nghệ lạc hậu", "Quy trình thủ công"],
                        correct: 0
                    },
                    {
                        text: "Chính phủ số mang lại lợi ích gì?",
                        options: ["Tăng hiệu quả quản lý", "Giảm minh bạch", "Tăng chi phí vận hành"],
                        correct: 0
                    }
                ]
            }
        ];
        
        this.setupEventListeners();
        this.init();
    }
    
    init() {
        this.showDifficultyScreen();
    }
    
    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(e.target.dataset.difficulty);
            });
        });
        
        // Start game
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                // Handle quiz answers first
                if (e.key >= '1' && e.key <= '3' && this.showQuiz) {
                    this.answerQuestion(parseInt(e.key) - 1);
                    return;
                }
                
                this.keys[e.key.toLowerCase()] = true;
                this.keys[e.code] = true;
                
                // ESC to exit
                if (e.key === 'Escape') {
                    this.gameRunning = false;
                    this.showGameOver();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.gameState === 'playing') {
                this.keys[e.key.toLowerCase()] = false;
                this.keys[e.code] = false;
            }
        });
    }
    
    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // Update button styles
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.style.opacity = '0.5';
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).style.opacity = '1';
        
        // Set time based on difficulty
        switch(difficulty) {
            case 'easy':
                this.timeLeft = 60;
                break;
            case 'medium':
                this.timeLeft = 45;
                break;
            case 'hard':
                this.timeLeft = 30;
                break;
        }
        
        // Show start button
        document.getElementById('startBtn').style.display = 'block';
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameRunning = true;
        this.score = 0;
        this.visitedZones = [];
        this.gameStartTime = Date.now();
        
        // Hide difficulty screen, show game screen
        document.getElementById('difficultyScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Start timer
        this.startTimer();
        
        // Start game loop
        this.gameLoop();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            document.getElementById('score').textContent = this.score;
            
            if (this.timeLeft <= 0) {
                this.showGameOver();
            }
        }, 1000);
    }
    
    update() {
        if (!this.gameRunning || this.showQuiz) return;
        
        // Handle player movement
        let newX = this.player.x;
        let newY = this.player.y;
        
        // WASD and Arrow keys
        if (this.keys['w'] || this.keys['ArrowUp']) {
            newY -= this.player.speed;
            this.player.direction = 'up';
        }
        if (this.keys['s'] || this.keys['ArrowDown']) {
            newY += this.player.speed;
            this.player.direction = 'down';
        }
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            newX -= this.player.speed;
            this.player.direction = 'left';
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            newX += this.player.speed;
            this.player.direction = 'right';
        }
        
        // Boundary collision detection
        if (newX >= 0 && newX <= this.width - this.player.width) {
            this.player.x = newX;
        }
        if (newY >= 0 && newY <= this.height - this.player.height) {
            this.player.y = newY;
        }
        
        // Check for zone entry
        this.checkZoneEntry();
    }
    
    checkZoneEntry() {
        const currentZone = this.getCurrentZone();
        if (currentZone && currentZone !== this.currentZone) {
            this.currentZone = currentZone;
            
            // Check if zone was already visited
            if (!this.visitedZones.includes(currentZone.sector)) {
                this.showQuiz = true;
                this.showQuizPopup(currentZone);
            }
        }
    }
    
    getCurrentZone() {
        for (let area of this.mapAreas) {
            if (this.player.x >= area.x && this.player.x <= area.x + area.width &&
                this.player.y >= area.y && this.player.y <= area.y + area.height) {
                return area;
            }
        }
        return null;
    }
    
    showQuizPopup(zone) {
        // Get random question from zone
        const randomQuestion = zone.questions[Math.floor(Math.random() * zone.questions.length)];
        this.quizData = randomQuestion;
        
        // Show popup
        document.getElementById('quizQuestion').textContent = randomQuestion.text;
        
        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = '';
        
        randomQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionDiv.addEventListener('click', () => this.answerQuestion(index));
            optionsContainer.appendChild(optionDiv);
        });
        
        document.getElementById('quizPopup').style.display = 'flex';
    }
    
    answerQuestion(optionIndex) {
        if (!this.quizData) return;
        
        const isCorrect = optionIndex === this.quizData.correct;
        
        if (isCorrect) {
            this.score += 10;
            this.visitedZones.push(this.currentZone.sector);
            this.playSound('correct');
        } else {
            this.timeLeft = Math.max(0, this.timeLeft - 5);
            this.playSound('wrong');
        }
        
        // Hide quiz popup
        document.getElementById('quizPopup').style.display = 'none';
        this.showQuiz = false;
        this.quizData = null;
    }
    
    playSound(type) {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        } else if (type === 'wrong') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw map areas
        this.mapAreas.forEach(area => {
            let color = area.color;
            
            // Make visited areas brighter
            if (this.visitedZones.includes(area.sector)) {
                const rgb = this.hexToRgb(area.color);
                color = `rgb(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)})`;
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(area.x, area.y, area.width, area.height);
            
            // Draw area borders
            this.ctx.strokeStyle = this.visitedZones.includes(area.sector) ? '#f1c40f' : '#2c3e50';
            this.ctx.lineWidth = this.visitedZones.includes(area.sector) ? 3 : 2;
            this.ctx.strokeRect(area.x, area.y, area.width, area.height);
        });
        
        // Draw player character with glow effect
        this.ctx.shadowColor = '#e74c3c';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.shadowBlur = 0;
        
        // Draw player direction indicator
        this.ctx.fillStyle = '#ffffff';
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        
        switch (this.player.direction) {
            case 'up':
                this.ctx.fillRect(centerX - 2, this.player.y, 4, 6);
                break;
            case 'down':
                this.ctx.fillRect(centerX - 2, this.player.y + this.player.height - 6, 4, 6);
                break;
            case 'left':
                this.ctx.fillRect(this.player.x, centerY - 2, 6, 4);
                break;
            case 'right':
                this.ctx.fillRect(this.player.x + this.player.width - 6, centerY - 2, 6, 4);
                break;
        }
    }
    
    showGameOver() {
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        
        // Save score to history
        this.saveScore();
        
        // Show game over popup
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverPopup').style.display = 'flex';
    }
    
    saveScore() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        const gameRecord = {
            id: Date.now(),
            difficulty: this.difficulty,
            score: this.score,
            date: new Date().toLocaleDateString('vi-VN'),
            time: new Date().toLocaleTimeString('vi-VN')
        };
        
        gameHistory.push(gameRecord);
        gameHistory.sort((a, b) => b.score - a.score); // Sort by score descending
        
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    }
    
    showHistory() {
        this.gameState = 'history';
        document.getElementById('gameOverPopup').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('historyScreen').style.display = 'block';
        
        this.loadHistory();
    }
    
    loadHistory() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';
        
        if (gameHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #7f8c8d;">Chưa có lịch sử chơi</td></tr>';
            return;
        }
        
        gameHistory.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${this.getDifficultyText(record.difficulty)}</td>
                <td>${record.score}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    getDifficultyText(difficulty) {
        switch(difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return 'Không xác định';
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Global functions for HTML buttons
function restartGame() {
    document.getElementById('gameOverPopup').style.display = 'none';
    document.getElementById('historyScreen').style.display = 'none';
    document.getElementById('difficultyScreen').style.display = 'block';
    
    // Reset game state
    if (window.game) {
        window.game.gameState = 'difficulty';
        window.game.gameRunning = false;
        if (window.game.timerInterval) {
            clearInterval(window.game.timerInterval);
        }
    }
}

function showHistory() {
    if (window.game) {
        window.game.showHistory();
    }
}

function showDifficultyScreen() {
    document.getElementById('historyScreen').style.display = 'none';
    document.getElementById('difficultyScreen').style.display = 'block';
    
    // Reset difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.style.opacity = '1';
    });
    document.getElementById('startBtn').style.display = 'none';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new RisingNationGame();
});