let selectedA = {};
let selectedB = {};

function changeCount(team, name, delta){
    const selected = team === 'A' ? selectedA : selectedB;
    const current = selected[name] || 0;
    const newCount = Math.max(0, Math.min(10, current + delta));
    selected[name] = newCount;
    const countEl = document.getElementById(`count-${team}-${name}`);
    if(countEl) countEl.innerText = newCount;
    updateTopBar();
}

function updateTopBar(){
    const keysA = Object.keys(selectedA).filter(k => selectedA[k] > 0);
    const keysB = Object.keys(selectedB).filter(k => selectedB[k] > 0);
    let nameA = "???";
    let nameB = "???";
    if(keysA.length === 1) nameA = keysA[0];
    else if(keysA.length > 1) nameA = keysA.map(n => n[0]).join('');
    if(keysB.length === 1) nameB = keysB[0];
    else if(keysB.length > 1) nameB = keysB.map(n => n[0]).join('');
    document.getElementById("topBar").innerText = `${nameA}  VS  ${nameB}`;
}

function initSelectionUI(){
    const selectableRoles = Object.keys(ROLE_DATABASE).filter(n => !n.startsWith('召唤物'));
    const leftChoices = document.getElementById('leftChoices');
    const rightChoices = document.getElementById('rightChoices');
    const emojis = { '大狗嚼': '🐶', '哈基米': '🐱', '哈气猫': '🐱', 'mj虫二': '🐛', '训练木桩': '🪵' };
    
    selectableRoles.forEach(name => {
        const emoji = emojis[name] || '❓';
        
        const leftDiv = document.createElement('div');
        leftDiv.className = 'role-card';
        leftDiv.style.background = '#3498db';
        leftDiv.innerHTML = `
            <span>${emoji} ${name}</span>
            <span style="display:flex; gap:5px; align-items:center;">
                <button class="count-btn" onclick="changeCount('A','${name}',-1)">-</button>
                <span id="count-A-${name}" style="min-width:20px;text-align:center;">0</span>
                <button class="count-btn" onclick="changeCount('A','${name}',1)">+</button>
            </span>
        `;
        leftChoices.appendChild(leftDiv);
        
        const rightDiv = document.createElement('div');
        rightDiv.className = 'role-card';
        rightDiv.style.background = '#e74c3c';
        rightDiv.innerHTML = `
            <span>${emoji} ${name}</span>
            <span style="display:flex; gap:5px; align-items:center;">
                <button class="count-btn" onclick="changeCount('B','${name}',-1)">-</button>
                <span id="count-B-${name}" style="min-width:20px;text-align:center;">0</span>
                <button class="count-btn" onclick="changeCount('B','${name}',1)">+</button>
            </span>
        `;
        rightChoices.appendChild(rightDiv);
    });
}