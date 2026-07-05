// Require login
const loggedInUser = sessionStorage.getItem('loggedInUser');
if (!loggedInUser) {
    window.location.href = 'login.html';
}

const DISPLAY_NAMES = {
    'admin': 'Admin',
    'dhruva': 'Dhruva',
    'druv': 'Druv'
};

// Mission window: 1.5 weeks starting July 5, 2026
const MISSION_START = new Date('2026-07-05T00:00:00');
const MISSION_DEADLINE = new Date('2026-07-16T23:59:59');

const MILESTONE_POINTS = [100, 200, 300];
const TOTAL_POINTS = MILESTONE_POINTS.reduce((a, b) => a + b, 0);

const STATUS_LABELS = {
    not_started: 'Not started',
    in_progress: 'In progress',
    done: 'Done'
};

const STATUS_ICONS = {
    not_started: '○',
    in_progress: '◐',
    done: '●'
};

// Shared state lives in the existing Supabase "picks" table as a reserved row,
// so no new table is needed. Falls back to localStorage if the DB is down.
const STATE_ROW_USERNAME = '__mission_state__';
const LOCAL_STATE_KEY = 'mission_state_v1';

function defaultState() {
    return {
        gate: { status: 'pending', completedAt: null, completedBy: null },
        milestones: MILESTONE_POINTS.map(points => ({
            points: points,
            title: '',
            description: '',
            status: 'not_started'
        })),
        log: []
    };
}

let state = defaultState();
let editingIndex = null; // milestone card currently in edit mode
let lastSyncSource = null;

// ---------- DOM ----------
const els = {
    displayName: document.getElementById('displayName'),
    logoutBtn: document.getElementById('logoutBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    daysLeft: document.getElementById('daysLeft'),
    deadlineText: document.getElementById('deadlineText'),
    pointsValue: document.getElementById('pointsValue'),
    pointsSub: document.getElementById('pointsSub'),
    stageValue: document.getElementById('stageValue'),
    stageSub: document.getElementById('stageSub'),
    timeMeter: document.getElementById('timeMeter'),
    timeMeterText: document.getElementById('timeMeterText'),
    gateStatusChip: document.getElementById('gateStatusChip'),
    gateActions: document.getElementById('gateActions'),
    gateCard: document.getElementById('gateCard'),
    milestones: document.getElementById('milestones'),
    logForm: document.getElementById('logForm'),
    logInput: document.getElementById('logInput'),
    logList: document.getElementById('logList'),
    syncStatus: document.getElementById('syncStatus')
};

function getDisplayName(username) {
    return DISPLAY_NAMES[username] || (username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Unknown');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

// ---------- Persistence ----------

async function loadState() {
    try {
        const { data, error } = await supabase
            .from('picks')
            .select('picks')
            .eq('username', STATE_ROW_USERNAME)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data && data.picks) {
            state = normalizeState(data.picks);
            lastSyncSource = 'server';
            localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
            return;
        }
        // No server row yet — fall through to local
        throw { code: 'PGRST116' };
    } catch (err) {
        const local = localStorage.getItem(LOCAL_STATE_KEY);
        if (local) {
            try { state = normalizeState(JSON.parse(local)); } catch (e) { state = defaultState(); }
        } else {
            state = defaultState();
        }
        lastSyncSource = (err && err.code === 'PGRST116') ? 'server-empty' : 'local';
    }
}

async function saveState() {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
    try {
        const { data: existing } = await supabase
            .from('picks')
            .select('id')
            .eq('username', STATE_ROW_USERNAME)
            .single();

        let result;
        if (existing) {
            result = await supabase
                .from('picks')
                .update({ picks: state, updated_at: new Date().toISOString() })
                .eq('username', STATE_ROW_USERNAME);
        } else {
            result = await supabase
                .from('picks')
                .insert({
                    username: STATE_ROW_USERNAME,
                    display_name: 'Mission State',
                    picks: state
                });
        }
        if (result.error) throw result.error;
        setSyncStatus('Synced with server · ' + new Date().toLocaleTimeString());
        return true;
    } catch (error) {
        console.error('Error saving state:', error);
        setSyncStatus('Saved locally only — server unreachable');
        showToast('Saved on this device (server unreachable)', 'error');
        return false;
    }
}

function normalizeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== 'object') return base;
    if (raw.gate && typeof raw.gate === 'object') {
        base.gate.status = raw.gate.status === 'done' ? 'done' : 'pending';
        base.gate.completedAt = raw.gate.completedAt || null;
        base.gate.completedBy = raw.gate.completedBy || null;
    }
    if (Array.isArray(raw.milestones)) {
        base.milestones = base.milestones.map((m, i) => {
            const r = raw.milestones[i] || {};
            return {
                points: m.points,
                title: typeof r.title === 'string' ? r.title : '',
                description: typeof r.description === 'string' ? r.description : '',
                status: ['not_started', 'in_progress', 'done'].includes(r.status) ? r.status : 'not_started'
            };
        });
    }
    if (Array.isArray(raw.log)) {
        base.log = raw.log.slice(0, 200);
    }
    return base;
}

function addLog(text, system) {
    state.log.unshift({
        ts: new Date().toISOString(),
        user: loggedInUser,
        text: text,
        system: !!system
    });
    state.log = state.log.slice(0, 200);
}

function setSyncStatus(text) {
    els.syncStatus.textContent = text;
}

// ---------- Rendering ----------

function render() {
    renderStats();
    renderGate();
    renderMilestones();
    renderLog();
}

function renderStats() {
    const now = new Date();
    const msLeft = MISSION_DEADLINE - now;
    const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));

    els.daysLeft.textContent = msLeft <= 0 ? 'Time up' : daysLeft + (daysLeft === 1 ? ' day' : ' days');
    els.daysLeft.classList.toggle('stat-urgent', msLeft <= 0 || daysLeft <= 3);
    els.deadlineText.textContent = 'Ends ' + MISSION_DEADLINE.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    const donePoints = state.milestones
        .filter(m => m.status === 'done')
        .reduce((sum, m) => sum + m.points, 0);
    els.pointsValue.textContent = donePoints;
    const doneCount = state.milestones.filter(m => m.status === 'done').length;
    els.pointsSub.textContent = doneCount === 0
        ? 'Nothing cleared yet'
        : doneCount + ' of ' + state.milestones.length + ' milestones cleared';

    if (state.gate.status !== 'done') {
        els.stageValue.textContent = 'Waiting on Rohit';
        els.stageSub.textContent = 'Step 1 not confirmed';
    } else if (doneCount === state.milestones.length) {
        els.stageValue.textContent = 'Mission complete';
        els.stageSub.textContent = 'All milestones cleared';
    } else {
        const inProgress = state.milestones.filter(m => m.status === 'in_progress').length;
        els.stageValue.textContent = 'Milestones live';
        els.stageSub.textContent = inProgress > 0
            ? inProgress + ' in progress'
            : 'Unlocked — get to work';
    }

    const total = MISSION_DEADLINE - MISSION_START;
    const elapsed = Math.min(Math.max(now - MISSION_START, 0), total);
    const pct = Math.round((elapsed / total) * 100);
    els.timeMeter.style.width = pct + '%';
    els.timeMeterText.textContent = pct + '% of the window used';
}

function renderGate() {
    const done = state.gate.status === 'done';

    els.gateStatusChip.className = 'status-chip ' + (done ? 'done' : 'pending');
    els.gateStatusChip.textContent = done ? '● Confirmed' : '◐ Waiting';

    if (done) {
        const when = state.gate.completedAt
            ? new Date(state.gate.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : '';
        els.gateActions.innerHTML =
            '<span class="gate-done-note">✔ Confirmed by ' + escapeHtml(getDisplayName(state.gate.completedBy)) +
            (when ? ' on ' + when : '') + '. Milestones are unlocked.</span>' +
            '<button class="btn btn-danger-ghost btn-sm" id="gateUndoBtn">Undo (false alarm)</button>';
        document.getElementById('gateUndoBtn').addEventListener('click', undoGate);
    } else {
        els.gateActions.innerHTML =
            '<button class="btn btn-good" id="gateConfirmBtn">It happened — confirm IRL sighting</button>' +
            '<span class="gate-done-note">Only confirm if it actually happened in person.</span>';
        document.getElementById('gateConfirmBtn').addEventListener('click', confirmGate);
    }
}

function renderMilestones() {
    const locked = state.gate.status !== 'done';

    els.milestones.innerHTML = state.milestones.map((m, i) => {
        const isEditing = editingIndex === i;
        const title = m.title || ('Milestone ' + (i + 1));
        const hasDesc = !!m.description;

        let body;
        if (isEditing) {
            body =
                '<div>' +
                '<input class="edit-input" id="editTitle" maxlength="80" placeholder="Milestone name" value="' + escapeHtml(m.title) + '">' +
                '<textarea class="edit-textarea" id="editDesc" maxlength="500" placeholder="What exactly has to happen for this one to count?">' + escapeHtml(m.description) + '</textarea>' +
                '<div class="edit-actions">' +
                '<button class="btn btn-primary btn-sm" data-action="save-edit" data-index="' + i + '">Save</button>' +
                '<button class="btn btn-sm" data-action="cancel-edit">Cancel</button>' +
                '</div></div>';
        } else {
            body =
                '<div class="milestone-title">' + escapeHtml(title) + '</div>' +
                '<div class="milestone-desc' + (hasDesc ? '' : ' placeholder') + '">' +
                (hasDesc ? escapeHtml(m.description) : 'No description yet — hit Edit and write down what has to happen for this to count.') +
                '</div>' +
                '<div class="status-row">' +
                ['not_started', 'in_progress', 'done'].map(s =>
                    '<button class="status-btn' + (m.status === s ? ' active-' + s : '') + '" data-action="set-status" data-index="' + i + '" data-status="' + s + '">' +
                    STATUS_LABELS[s] + '</button>'
                ).join('') +
                '</div>' +
                '<div class="milestone-foot">' +
                '<span class="milestone-status-text s-' + m.status + '">' + STATUS_ICONS[m.status] + ' ' + STATUS_LABELS[m.status] + '</span>' +
                '<button class="btn btn-ghost btn-sm" data-action="edit" data-index="' + i + '">Edit</button>' +
                '</div>';
        }

        const lockOverlay = locked
            ? '<div class="lock-overlay"><span class="lock-icon">🔒</span><p>Locked until Step 1 is confirmed</p></div>'
            : '';

        return '<article class="milestone-card' +
            (locked ? ' is-locked' : '') +
            (m.status === 'done' ? ' is-done' : '') + '">' +
            '<div class="milestone-top"><span class="points-badge">' + m.points + '<small>pts</small></span></div>' +
            body + lockOverlay +
            '</article>';
    }).join('');
}

function renderLog() {
    if (!state.log.length) {
        els.logList.innerHTML = '<li class="log-empty">No activity yet. First update wins bragging rights.</li>';
        return;
    }
    els.logList.innerHTML = state.log.map(entry => {
        const when = new Date(entry.ts).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
        return '<li class="log-entry' + (entry.system ? ' log-system' : '') + '">' +
            escapeHtml(entry.text) +
            '<span class="log-meta">' + escapeHtml(getDisplayName(entry.user)) + ' · ' + when + '</span>' +
            '</li>';
    }).join('');
}

// ---------- Actions ----------

async function confirmGate() {
    state.gate.status = 'done';
    state.gate.completedAt = new Date().toISOString();
    state.gate.completedBy = loggedInUser;
    addLog('Step 1 confirmed: Rohit said it, IRL. Milestones unlocked.', true);
    render();
    await saveState();
    showToast('Step 1 confirmed. Milestones unlocked.', 'success');
}

async function undoGate() {
    state.gate.status = 'pending';
    state.gate.completedAt = null;
    state.gate.completedBy = null;
    addLog('Step 1 confirmation was undone (false alarm). Milestones re-locked.', true);
    render();
    await saveState();
    showToast('Step 1 reset.', 'success');
}

async function setMilestoneStatus(index, status) {
    const m = state.milestones[index];
    if (!m || m.status === status) return;
    m.status = status;
    const name = m.title || ('Milestone ' + (index + 1));
    addLog('"' + name + '" (' + m.points + ' pts) moved to ' + STATUS_LABELS[status] + '.', true);
    render();
    await saveState();
}

async function saveMilestoneEdit(index) {
    const m = state.milestones[index];
    if (!m) return;
    const title = document.getElementById('editTitle').value.trim();
    const desc = document.getElementById('editDesc').value.trim();
    const changed = title !== m.title || desc !== m.description;
    m.title = title;
    m.description = desc;
    editingIndex = null;
    if (changed) {
        addLog('Updated the details for "' + (title || 'Milestone ' + (index + 1)) + '" (' + m.points + ' pts).', true);
    }
    render();
    if (changed) await saveState();
}

async function postLogUpdate(text) {
    addLog(text, false);
    renderLog();
    await saveState();
}

// ---------- Events ----------

function setupEventListeners() {
    els.logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.href = 'login.html';
    });

    els.refreshBtn.addEventListener('click', async () => {
        await loadState();
        editingIndex = null;
        render();
        showToast(lastSyncSource === 'server' ? 'Up to date.' : 'Server unreachable — showing local copy.', lastSyncSource === 'server' ? 'success' : 'error');
    });

    els.milestones.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        const index = parseInt(btn.dataset.index, 10);

        if (action === 'set-status') {
            setMilestoneStatus(index, btn.dataset.status);
        } else if (action === 'edit') {
            editingIndex = index;
            renderMilestones();
            const input = document.getElementById('editTitle');
            if (input) input.focus();
        } else if (action === 'save-edit') {
            saveMilestoneEdit(index);
        } else if (action === 'cancel-edit') {
            editingIndex = null;
            renderMilestones();
        }
    });

    els.logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = els.logInput.value.trim();
        if (!text) return;
        els.logInput.value = '';
        postLogUpdate(text);
    });

    // Pull fresh state every 60s, unless someone is mid-edit or typing
    setInterval(async () => {
        const ae = document.activeElement;
        const typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA');
        if (editingIndex !== null || typing) return;
        await loadState();
        render();
    }, 60000);

    // Keep the countdown honest
    setInterval(renderStats, 60000);
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ---------- Init ----------

async function init() {
    els.displayName.textContent = getDisplayName(loggedInUser);
    setupEventListeners();
    await loadState();
    render();
    setSyncStatus(lastSyncSource === 'local'
        ? 'Server unreachable — showing the copy saved on this device'
        : 'Connected · state is shared across everyone who logs in');
}

document.addEventListener('DOMContentLoaded', init);
