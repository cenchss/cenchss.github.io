// All the bets data
const BETS = [
    {
        id: 1,
        description: 'Mentions "I\'m just being honest"',
        type: 'O/U',
        threshold: '1 time',
        details: 'After saying something ridiculous about women'
    },
    {
        id: 2,
        description: 'Gazes at a woman for more than 3 seconds',
        type: 'O/U',
        threshold: '5 sec',
        details: 'Stares awkwardly without saying anything'
    },
    {
        id: 3,
        description: 'Mentions being "too nice"',
        type: 'O/U',
        threshold: '1 time',
        details: 'Complains about being "too nice" to a girl'
    },
    {
        id: 4,
        description: 'Tries to make a "smooth" move but it backfires',
        type: 'O/U',
        threshold: '30 sec',
        details: 'Fails a "smooth" line with a girl'
    },
    {
        id: 5,
        description: 'Checks his phone mid-convo',
        type: 'O/U',
        threshold: '10 sec',
        details: 'Uses phone to avoid awkward silence with a girl'
    },
    {
        id: 6,
        description: 'Gets rejected by a girl but still tries to save face',
        type: 'YES/NO',
        details: 'Rejection happens, still keeps trying'
    },
    {
        id: 7,
        description: 'Compliments a woman, but it sounds like a critique',
        type: 'YES/NO',
        details: 'Compliments are awkward and backfire'
    },
    {
        id: 8,
        description: 'Tries to hold a girl\'s hand but gets rejected awkwardly',
        type: 'YES/NO',
        details: 'Goes for the handhold but gets rejected'
    },
    {
        id: 9,
        description: 'Makes a "joke" but it\'s so cringe it\'s uncomfortable',
        type: 'YES/NO',
        details: 'Awkward joke leads to uncomfortable silence'
    },
    {
        id: 10,
        description: 'Says "I don\'t usually talk to women like this"',
        type: 'YES/NO',
        details: 'Claims to be out of his comfort zone'
    },
    {
        id: 11,
        description: 'Mentions his lack of experience with women in front of a girl',
        type: 'YES/NO',
        details: 'Shares his lack of experience in a cringe way'
    },
    {
        id: 12,
        description: 'Starts talking about his "dating struggles" within 5 mins',
        type: 'YES/NO',
        details: 'Talks too much about his struggles early on'
    },
    {
        id: 13,
        description: 'Says something ridiculous, even the group cringes',
        type: 'YES/NO',
        details: 'Says something completely out of touch'
    },
    {
        id: 14,
        description: 'Tries to talk about his "dating philosophy" but it\'s just nonsense',
        type: 'YES/NO',
        details: 'Nonsensical dating advice spilled after a drink'
    },
    {
        id: 15,
        description: 'Gets super drunk and says "women don\'t understand me"',
        type: 'YES/NO',
        details: 'In a drunken rant about women misunderstanding him'
    },
    {
        id: 16,
        description: 'Starts talking about how "women just don\'t understand"',
        type: 'YES/NO',
        details: 'Speaks to the group about societal issues with women'
    },
    {
        id: 17,
        description: 'Comes up with a plan to "improve" himself but it\'s totally delusional',
        type: 'YES/NO',
        details: 'Gives an unrealistic "self-improvement" speech'
    },
    {
        id: 18,
        description: 'Gets rejected and then says "well, I guess I\'m just not your type"',
        type: 'YES/NO',
        details: 'Rejected, then gives up immediately'
    },
    {
        id: 19,
        description: 'Sends a cringy "Let\'s hang soon" text to a girl he barely talked to',
        type: 'YES/NO',
        details: 'Sends text to a girl who showed no interest'
    },
    {
        id: 20,
        description: 'Says to the group, "I just don\'t get why women like that"',
        type: 'YES/NO',
        details: 'Complains about women after being ignored'
    },
    {
        id: 21,
        description: 'Starts going on about how "he\'s not looking for anything serious" but clearly is',
        type: 'YES/NO',
        details: 'Says one thing but clearly does another'
    },
    {
        id: 22,
        description: 'Leaves early and claims it\'s "because he\'s tired" but it\'s really because he\'s embarrassed',
        type: 'YES/NO',
        details: 'Leaves abruptly, hides embarrassment'
    },
    {
        id: 23,
        description: 'Tries to talk to a girl but immediately mentions how he "sucks at this"',
        type: 'YES/NO',
        details: 'Self-deprecates before even starting the conversation'
    },
    {
        id: 24,
        description: 'Mentions "I\'m just a nice guy, that\'s why no one likes me"',
        type: 'YES/NO',
        details: 'Whines about being the "nice guy"'
    },
    {
        id: 25,
        description: 'Compliments a girl, but it\'s about her appearance and he\'s awkward about it',
        type: 'YES/NO',
        details: 'Compliments backfires and makes it awkward'
    },
    {
        id: 26,
        description: 'Mentions "I\'m just not the type to get attention" when no one asked',
        type: 'YES/NO',
        details: 'Says self-pitying stuff no one asked for'
    },
    {
        id: 27,
        description: 'Starts a conversation but immediately mentions "I\'m not used to this"',
        type: 'YES/NO',
        details: 'Starts conversation but already insecure'
    },
    {
        id: 28,
        description: 'Tells a girl he\'s not used to talking to women, which immediately makes her uncomfortable',
        type: 'YES/NO',
        details: 'Awkwardly admits lack of experience in conversation'
    },
    {
        id: 29,
        description: 'Sends a cringy message to a girl he barely knows',
        type: 'YES/NO',
        details: 'Sends a random, awkward follow-up message'
    },
    {
        id: 30,
        description: 'Mentions "I don\'t get why women like that" after a rejection',
        type: 'YES/NO',
        details: 'Complains after a woman shows no interest'
    }
];

// Current user's picks
let userPicks = {};

// DOM Elements
const betsContainer = document.getElementById('betsContainer');
const usernameInput = document.getElementById('username');
const savePicksBtn = document.getElementById('savePicks');
const loadPicksBtn = document.getElementById('loadPicks');
const viewResultsBtn = document.getElementById('viewResults');
const resultsModal = document.getElementById('resultsModal');
const resultsContent = document.getElementById('resultsContent');
const closeModal = document.querySelector('.close');

// Initialize the app
function init() {
    renderBets();
    setupEventListeners();
    loadFromLocalStorage();
}

// Render all bets
function renderBets() {
    betsContainer.innerHTML = BETS.map(bet => {
        const isOverUnder = bet.type === 'O/U';
        const option1 = isOverUnder ? 'OVER' : 'YES';
        const option2 = isOverUnder ? 'UNDER' : 'NO';
        const option1Class = isOverUnder ? 'over' : 'yes';
        const option2Class = isOverUnder ? 'under' : 'no';

        return `
            <div class="bet-card" data-bet-id="${bet.id}">
                <div class="bet-header">
                    <div class="bet-description">${bet.description}</div>
                    <span class="bet-type">${bet.type}${bet.threshold ? ` ${bet.threshold}` : ''}</span>
                </div>
                <div class="bet-details">${bet.details}</div>
                <div class="bet-options">
                    <button class="bet-option" data-bet-id="${bet.id}" data-pick="${option1.toLowerCase()}" data-option-class="${option1Class}">
                        ${option1}
                    </button>
                    <button class="bet-option" data-bet-id="${bet.id}" data-pick="${option2.toLowerCase()}" data-option-class="${option2Class}">
                        ${option2}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Bet option clicks
    betsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('bet-option')) {
            const betId = e.target.dataset.betId;
            const pick = e.target.dataset.pick;
            const optionClass = e.target.dataset.optionClass;

            selectPick(betId, pick, optionClass);
        }
    });

    // Save picks
    savePicksBtn.addEventListener('click', savePicks);

    // Load picks
    loadPicksBtn.addEventListener('click', loadPicks);

    // View results
    viewResultsBtn.addEventListener('click', viewAllPredictions);

    // Close modal
    closeModal.addEventListener('click', () => {
        resultsModal.classList.add('hidden');
    });

    resultsModal.addEventListener('click', (e) => {
        if (e.target === resultsModal) {
            resultsModal.classList.add('hidden');
        }
    });
}

// Select a pick
function selectPick(betId, pick, optionClass) {
    userPicks[betId] = pick;

    // Update UI
    const card = document.querySelector(`.bet-card[data-bet-id="${betId}"]`);
    const options = card.querySelectorAll('.bet-option');

    options.forEach(opt => {
        opt.classList.remove('yes-selected', 'no-selected', 'over-selected', 'under-selected');
        if (opt.dataset.pick === pick) {
            opt.classList.add(`${optionClass}-selected`);
        }
    });

    card.classList.add('selected');

    // Save to localStorage immediately
    saveToLocalStorage();
}

// Save to localStorage
function saveToLocalStorage() {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem(`picks_${username}`, JSON.stringify(userPicks));
    }
    localStorage.setItem('lastPicks', JSON.stringify(userPicks));
    localStorage.setItem('lastUsername', usernameInput.value);
}

// Load from localStorage
function loadFromLocalStorage() {
    const lastUsername = localStorage.getItem('lastUsername');
    const lastPicks = localStorage.getItem('lastPicks');

    if (lastUsername) {
        usernameInput.value = lastUsername;
    }

    if (lastPicks) {
        userPicks = JSON.parse(lastPicks);
        applyPicksToUI();
    }
}

// Apply picks to UI
function applyPicksToUI() {
    Object.entries(userPicks).forEach(([betId, pick]) => {
        const card = document.querySelector(`.bet-card[data-bet-id="${betId}"]`);
        if (card) {
            const option = card.querySelector(`.bet-option[data-pick="${pick}"]`);
            if (option) {
                const optionClass = option.dataset.optionClass;
                option.classList.add(`${optionClass}-selected`);
                card.classList.add('selected');
            }
        }
    });
}

// Save picks to server
async function savePicks() {
    const username = usernameInput.value.trim();

    if (!username) {
        showToast('Please enter your name first!', 'error');
        usernameInput.focus();
        return;
    }

    if (Object.keys(userPicks).length === 0) {
        showToast('Please make at least one pick!', 'error');
        return;
    }

    const data = {
        username: username,
        picks: userPicks,
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(`${CONFIG.API_URL}/picks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showToast('Picks saved successfully!', 'success');
            saveToLocalStorage();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('Error saving to server:', error);

        if (CONFIG.USE_LOCAL_FALLBACK) {
            saveToLocalStorage();
            showToast('Saved locally (server unavailable)', 'success');
        } else {
            showToast('Failed to save picks. Server unavailable.', 'error');
        }
    }
}

// Load picks from server
async function loadPicks() {
    const username = usernameInput.value.trim();

    if (!username) {
        showToast('Please enter your name first!', 'error');
        usernameInput.focus();
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/picks/${encodeURIComponent(username)}`);

        if (response.ok) {
            const data = await response.json();
            userPicks = data.picks || {};
            applyPicksToUI();
            showToast('Picks loaded successfully!', 'success');
        } else if (response.status === 404) {
            // Try localStorage
            const localPicks = localStorage.getItem(`picks_${username}`);
            if (localPicks) {
                userPicks = JSON.parse(localPicks);
                applyPicksToUI();
                showToast('Picks loaded from local storage!', 'success');
            } else {
                showToast('No picks found for this user', 'error');
            }
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('Error loading from server:', error);

        // Fallback to localStorage
        const localPicks = localStorage.getItem(`picks_${username}`);
        if (localPicks) {
            userPicks = JSON.parse(localPicks);
            applyPicksToUI();
            showToast('Loaded from local storage (server unavailable)', 'success');
        } else {
            showToast('Could not load picks. Server unavailable.', 'error');
        }
    }
}

// View all predictions
async function viewAllPredictions() {
    resultsModal.classList.remove('hidden');
    resultsContent.innerHTML = '<p>Loading predictions...</p>';

    try {
        const response = await fetch(`${CONFIG.API_URL}/picks`);

        if (response.ok) {
            const allPicks = await response.json();
            displayResults(allPicks);
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        console.error('Error fetching results:', error);

        // Show local data as fallback
        const localUsers = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('picks_')) {
                const username = key.replace('picks_', '');
                const picks = JSON.parse(localStorage.getItem(key));
                localUsers.push({ username, picks });
            }
        }

        if (localUsers.length > 0) {
            displayResults(localUsers);
            resultsContent.innerHTML = '<p style="color: #fdcb6e; margin-bottom: 15px;">Showing local data (server unavailable)</p>' + resultsContent.innerHTML;
        } else {
            resultsContent.innerHTML = '<p>Could not load predictions. Server unavailable.</p>';
        }
    }
}

// Display results in modal
function displayResults(allPicks) {
    if (!allPicks || allPicks.length === 0) {
        resultsContent.innerHTML = '<p>No predictions yet!</p>';
        return;
    }

    let html = '<table class="results-table"><thead><tr><th>User</th>';

    // Add bet columns (abbreviated)
    BETS.forEach((bet, index) => {
        html += `<th title="${bet.description}">#${index + 1}</th>`;
    });

    html += '</tr></thead><tbody>';

    allPicks.forEach(user => {
        html += `<tr><td>${user.username}</td>`;

        BETS.forEach(bet => {
            const pick = user.picks[bet.id] || '-';
            let pickClass = '';
            let displayPick = pick;

            if (pick === 'yes') {
                pickClass = 'pick-yes';
                displayPick = 'Y';
            } else if (pick === 'no') {
                pickClass = 'pick-no';
                displayPick = 'N';
            } else if (pick === 'over') {
                pickClass = 'pick-over';
                displayPick = 'O';
            } else if (pick === 'under') {
                pickClass = 'pick-under';
                displayPick = 'U';
            }

            html += `<td class="${pickClass}">${displayPick}</td>`;
        });

        html += '</tr>';
    });

    html += '</tbody></table>';

    // Add legend
    html += `
        <div style="margin-top: 20px; font-size: 0.85rem; color: #8892b0;">
            <strong>Legend:</strong>
            <span class="pick-yes">Y = Yes</span> |
            <span class="pick-no">N = No</span> |
            <span class="pick-over">O = Over</span> |
            <span class="pick-under">U = Under</span>
        </div>
    `;

    resultsContent.innerHTML = html;
}

// Show toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
