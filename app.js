// Tabs and the NHS England risk-matrix lookup. No data leaves the page.
(function () {
    'use strict';

    // --- Tabs ---
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));

    function selectTab(tab, focus) {
        tabs.forEach(t => {
            const on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
        });
        if (focus) tab.focus();
        try { history.replaceState(null, '', '#' + tab.getAttribute('aria-controls')); } catch (e) { /* ignore */ }
    }

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => selectTab(tab, false));
        tab.addEventListener('keydown', e => {
            let next = null;
            if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
            if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') next = tabs[0];
            if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) { e.preventDefault(); selectTab(next, true); }
        });
    });

    const fromHash = tabs.find(t => '#' + t.getAttribute('aria-controls') === location.hash);
    if (fromHash) selectTab(fromHash, false);

    // --- Risk matrix (A8 of the aide-memoire) ---
    const LEVELS = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];
    // rows = probability, columns = impact
    const MATRIX = [
        ['Very low', 'Low', 'Low', 'Moderate', 'Moderate'],
        ['Low', 'Low', 'Moderate', 'Moderate', 'Moderate'],
        ['Low', 'Moderate', 'Moderate', 'High', 'High'],
        ['Moderate', 'Moderate', 'High', 'High', 'Very high'],
        ['Moderate', 'High', 'High', 'Very high', 'Very high']
    ];

    const qs = Array.from(document.querySelectorAll('#prob-qs > li'));
    const probOut = document.getElementById('prob-out');
    const riskOut = document.getElementById('risk-out');
    const impactSel = document.getElementById('impact');
    const matrixCells = document.querySelectorAll('#matrix tbody tr');
    const answers = new Array(qs.length).fill(null);
    let probability = null;

    function render() {
        // Probability: stop at the first "No"
        probability = null;
        let stopped = false;
        qs.forEach((li, i) => {
            const enabled = !stopped && (i === 0 || answers[i - 1] === 'yes');
            li.classList.toggle('disabled', !enabled);
            li.querySelectorAll('button').forEach(b => {
                b.disabled = !enabled;
                b.setAttribute('aria-pressed', enabled && answers[i] === b.dataset.a ? 'true' : 'false');
            });
            if (!enabled) answers[i] = null;
            if (enabled && answers[i] === 'no') { probability = li.dataset.no; stopped = true; }
            if (enabled && answers[i] === 'yes' && li.dataset.yes) probability = li.dataset.yes;
        });
        probOut.textContent = probability || 'not yet answered';

        const impact = impactSel.value;
        matrixCells.forEach(tr => tr.querySelectorAll('td').forEach(td => td.classList.remove('hit')));
        if (probability && impact) {
            const r = LEVELS.indexOf(probability);
            const c = LEVELS.indexOf(impact);
            riskOut.textContent = MATRIX[r][c];
            matrixCells[r].querySelectorAll('td')[c].classList.add('hit');
        } else {
            riskOut.textContent = 'answer both parts';
        }
    }

    qs.forEach((li, i) => {
        li.querySelectorAll('button').forEach(b => {
            b.addEventListener('click', () => {
                answers[i] = b.dataset.a;
                for (let j = i + 1; j < answers.length; j++) answers[j] = null;
                render();
            });
        });
    });
    impactSel.addEventListener('change', render);
    document.getElementById('reset').addEventListener('click', () => {
        answers.fill(null);
        impactSel.value = '';
        render();
    });
    render();
})();
