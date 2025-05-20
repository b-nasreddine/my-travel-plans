// App functionality: add destinations and toggle dark mode

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-destination-form');
    const input = document.getElementById('destination-input');
    const container = document.querySelector('.destination-container');
    const toggle = document.getElementById('dark-mode-toggle');

    function addDestination(name, save = true) {
        if (!name) return;
        const div = document.createElement('div');
        div.className = 'destination';
        const h2 = document.createElement('h2');
        h2.textContent = name;
        div.appendChild(h2);
        container.appendChild(div);
        if (save) {
            const items = JSON.parse(localStorage.getItem('destinations') || '[]');
            items.push(name);
            localStorage.setItem('destinations', JSON.stringify(items));
        }
    }

    const saved = JSON.parse(localStorage.getItem('destinations') || '[]');
    saved.forEach(name => addDestination(name, false));

    form.addEventListener('submit', e => {
        e.preventDefault();
        addDestination(input.value.trim());
        input.value = '';
    });

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });
});
