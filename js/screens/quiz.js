/* Atlas Tamghrabit — Quiz Screen */
'use strict';

const QuizScreen = (() => {
    let questions = [];
    let state = {
        screen: 'home', // 'home', 'question', 'feedback', 'result'
        filteredQuestions: [],
        currentQuestionIndex: 0,
        score: 0,
        bestScore: parseInt(localStorage.getItem('atlas_quiz_best') || '0', 10),
        filters: {
            difficulty: 'all',
            city: 'all'
        },
        timer: 30,
        timerInterval: null,
        userAnswer: null,
        cityStats: {}
    };

    const difficulties = ['all', 'facile', 'moyen', 'difficile'];
    const cities = ['all', 'marrakech', 'fes', 'chefchaouen', 'essaouira', 'meknes', 'tanger'];

    function loadData(callback) {
        fetch('data/quiz.json')
            .then(res => res.json())
            .then(data => {
                questions = data;
                callback();
            })
            .catch(err => {
                console.error("Erreur de chargement du quiz:", err);
                questions = [];
                callback();
            });
    }

    function startGame() {
        // Apply filters
        state.filteredQuestions = questions.filter(q => {
            const matchDiff = state.filters.difficulty === 'all' || q.difficulte === state.filters.difficulty;
            const matchCity = state.filters.city === 'all' || q.ville === state.filters.city;
            return matchDiff && matchCity;
        });

        // Shuffle
        state.filteredQuestions.sort(() => Math.random() - 0.5);

        // Limit to 10
        state.filteredQuestions = state.filteredQuestions.slice(0, 10);

        if (state.filteredQuestions.length === 0) {
            alert("Aucune question ne correspond à ces filtres.");
            return;
        }

        state.currentQuestionIndex = 0;
        state.score = 0;
        state.cityStats = {};
        state.screen = 'question';
        updateView();
    }

    function startTimer() {
        state.timer = 30;
        clearInterval(state.timerInterval);
        const timerUI = document.getElementById('quiz-timer-bar');
        const timerText = document.getElementById('quiz-timer-text');

        if (timerUI) {
            timerUI.style.transition = 'none';
            timerUI.style.width = '100%';
            void timerUI.offsetWidth;
            timerUI.style.transition = 'width 1s linear, background-color 0.3s ease';
        }

        state.timerInterval = setInterval(() => {
            state.timer--;

            if (timerUI) {
                const pct = (state.timer / 30) * 100;
                timerUI.style.width = pct + '%';
                if (state.timer <= 15) {
                    timerUI.style.backgroundColor = 'var(--city-marrakech)'; // red
                } else {
                    timerUI.style.backgroundColor = 'var(--color-gold)';
                }
            }
            if (timerText) {
                timerText.innerText = `⏱️ ${state.timer}s`;
            }

            if (state.timer <= 0) {
                clearInterval(state.timerInterval);
                handleAnswer(-1); // Timeout
            }
        }, 1000);
    }

    function handleAnswer(selectedIndex) {
        clearInterval(state.timerInterval);
        state.userAnswer = selectedIndex;

        const q = state.filteredQuestions[state.currentQuestionIndex];
        const isCorrect = selectedIndex === q.reponse;

        if (isCorrect) state.score++;

        // Update stats
        if (!state.cityStats[q.ville]) state.cityStats[q.ville] = { correct: 0, total: 0 };
        state.cityStats[q.ville].total++;
        if (isCorrect) state.cityStats[q.ville].correct++;

        state.screen = 'feedback';
        updateView();
    }

    function nextQuestion() {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex >= state.filteredQuestions.length) {
            endGame();
        } else {
            state.screen = 'question';
            updateView();
        }
    }

    function endGame() {
        if (state.score > state.bestScore) {
            state.bestScore = state.score;
            localStorage.setItem('atlas_quiz_best', state.bestScore.toString());
        }
        state.screen = 'result';
        updateView();
    }

    function setFilter(type, value) {
        state.filters[type] = value;
        updateView();
    }

    function updateView() {
        const container = document.getElementById('quiz-container');
        if (!container) return;
        container.innerHTML = getScreenHTML();

        bindEvents();

        if (state.screen === 'question') {
            startTimer();
        }
    }

    function getScreenHTML() {
        if (state.screen === 'home') return getHomeHTML();
        if (state.screen === 'question') return getQuestionHTML();
        if (state.screen === 'feedback') return getFeedbackHTML();
        if (state.screen === 'result') return getResultHTML();
    }

    function getCityName(id) {
        if (id === 'all') return 'Toutes';
        return id.charAt(0).toUpperCase() + id.slice(1);
    }

    function getHomeHTML() {
        return `
            <div class="quiz-home fade-in">
                <div class="quiz-hero">
                    <div class="quiz-icon">🧠</div>
                    <h1 class="quiz-title">Testez vos Connaissances</h1>
                    <p class="quiz-subtitle">10 questions sur le patrimoine marocain</p>
                </div>

                <div class="quiz-filters-section">
                    <h3 class="filter-title">Difficulté</h3>
                    <div class="quiz-filters">
                        ${difficulties.map(d => `<button class="filter-btn ${state.filters.difficulty === d ? 'active' : ''}" data-type="difficulty" data-val="${d}">${d.charAt(0).toUpperCase() + d.slice(1)}</button>`).join('')}
                    </div>

                    <h3 class="filter-title">Ville</h3>
                    <div class="quiz-filters">
                        ${cities.map(c => `<button class="filter-btn ${state.filters.city === c ? 'active' : ''}" data-type="city" data-val="${c}">${getCityName(c)}</button>`).join('')}
                    </div>
                </div>

                <div class="quiz-start-box">
                    <button class="btn-primary quiz-btn-primary" id="btn-start-quiz">🚀 Commencer Quiz</button>
                    <p class="best-score">Meilleur score: ${state.bestScore} 🏆</p>
                </div>
            </div>
        `;
    }

    function getQuestionHTML() {
        const q = state.filteredQuestions[state.currentQuestionIndex];
        const cityData = AtlasData.cities.find(c => c.id === q.ville) || {};
        const cityColor = cityData.color || '#C9A84C';
        const progressPct = ((state.currentQuestionIndex) / state.filteredQuestions.length) * 100;
        const total = state.filteredQuestions.length;

        // Determine if selected
        return `
            <div class="quiz-question-screen fade-in">
                <div class="quiz-topbar">
                    <div class="quiz-progress-bg">
                        <div class="quiz-progress-fill" style="width: ${progressPct}%; background-color: var(--color-gold);"></div>
                    </div>
                    <div class="quiz-status">Question ${state.currentQuestionIndex + 1}/${total}</div>
                </div>

                <div class="quiz-question-card">
                    <div class="quiz-city-badge" style="color: ${cityColor}; border-color: ${cityColor}40; background-color: ${cityColor}15;">
                        🏙️ ${getCityName(q.ville).toUpperCase()}
                    </div>

                    <div class="quiz-photo-box">
                        <img src="https://picsum.photos/seed/atlas_${q.ville}/600/300" alt="Monument" class="quiz-photo"/>
                    </div>

                    <h2 class="quiz-question-text">${q.question}</h2>

                    <div class="quiz-options">
                        ${q.options.map((opt, i) => `
                            <button class="quiz-option-btn" data-index="${i}">${opt}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="quiz-timer-container">
                    <div class="quiz-timer-text" id="quiz-timer-text">⏱️ 30s</div>
                    <div class="quiz-timer-track">
                        <div class="quiz-timer-bar" id="quiz-timer-bar" style="width: 100%; height: 100%; background-color: var(--color-gold);"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function getFeedbackHTML() {
        const q = state.filteredQuestions[state.currentQuestionIndex];
        const isCorrect = state.userAnswer === q.reponse;
        const bgClass = isCorrect ? 'feedback-correct' : 'feedback-wrong';
        const icon = isCorrect ? '✅' : '❌';
        const title = isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !';

        return `
            <div class="quiz-feedback-screen ${bgClass} fade-in">
                <div class="feedback-icon">${icon}</div>
                <h2 class="feedback-title">${title}</h2>
                
                <div class="feedback-card">
                    <p class="feedback-explication">${q.explication}</p>
                    ${!isCorrect && state.userAnswer !== -1 ? `
                        <div class="feedback-correction">
                            La bonne réponse était : <strong>${q.options[q.reponse]}</strong>
                        </div>
                    ` : ''}
                    ${state.userAnswer === -1 ? `
                        <div class="feedback-correction">Temps écoulé ! La bonne réponse était : <strong>${q.options[q.reponse]}</strong></div>
                    ` : ''}
                </div>

                <button class="btn-primary quiz-btn-primary" id="btn-next-question">Question Suivante →</button>
            </div>
        `;
    }

    function getResultHTML() {
        const total = state.filteredQuestions.length;
        const ratio = state.score / total;
        let emoji = '🏆';
        let msg = 'Excellent !';
        if (ratio < 0.5) { emoji = '😅'; msg = 'Continuez à explorer'; }
        else if (ratio < 0.8) { emoji = '👏'; msg = 'Pas mal !'; }

        const scorePct = (state.score / total) * 100;

        let cityStatsHTML = '';
        for (const [ville, stats] of Object.entries(state.cityStats)) {
            let marks = '';
            for (let i = 0; i < stats.total; i++) {
                marks += i < stats.correct ? '✅' : '❌';
            }
            cityStatsHTML += `
                <div class="city-stat-row">
                    <span class="city-stat-name">${getCityName(ville)}</span>
                    <span class="city-stat-marks">${marks}</span>
                </div>
            `;
        }

        return `
            <div class="quiz-result-screen fade-in">
                <div class="result-card">
                    <div class="result-header">
                        <div class="result-emoji">${emoji}</div>
                        <div class="result-score">Score : ${state.score}/${total}</div>
                        <div class="result-msg">${msg}</div>
                    </div>

                    <div class="result-bar-container">
                        <div class="result-bar-bg">
                            <div class="result-bar-fill" style="width: ${scorePct}%;"></div>
                        </div>
                    </div>

                    <div class="result-details">
                        <h3 class="result-details-title">Détail par ville :</h3>
                        ${cityStatsHTML}
                    </div>
                </div>

                <div class="result-actions">
                    <button class="btn-primary quiz-btn-primary" id="btn-replay">🔄 Rejouer</button>
                    <button class="btn-secondary quiz-btn-secondary" id="btn-home">🏠 Accueil</button>
                </div>
            </div>
        `;
    }

    function bindEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => setFilter(btn.dataset.type, btn.dataset.val);
        });

        const btnStart = document.getElementById('btn-start-quiz');
        if (btnStart) btnStart.onclick = startGame;

        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.onclick = () => handleAnswer(parseInt(btn.dataset.index, 10));
        });

        const btnNext = document.getElementById('btn-next-question');
        if (btnNext) btnNext.onclick = nextQuestion;

        const btnReplay = document.getElementById('btn-replay');
        if (btnReplay) btnReplay.onclick = () => {
            state.screen = 'home';
            updateView();
        };

        const btnHome = document.getElementById('btn-home');
        if (btnHome) btnHome.onclick = () => App.navigate('home');
    }

    const render = function () {

        return `
                <div class="screen-topbar">
                    <div class="screen-topbar-title">Quiz</div>
                    <div class="screen-topbar-arabic">اختبار</div>
                </div>
                <div class="screen-content quiz-scroll-container" style="padding-top: var(--nav-height); padding-bottom: calc(var(--nav-height) + 20px); min-height: 100dvh;">
                    <div id="quiz-container">
                        <div style="text-align: center; padding: 40px; color: var(--color-text-muted);">Chargement...</div>
                    </div>
                </div>
            `;
    }

    const init = function () {
        loadData(() => {
            updateView();
        });
    }

    const destroy = function () {
        clearInterval(state.timerInterval);
    }

    return {
        render,
        init,
        destroy
    };
})();
