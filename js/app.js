document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-destination-form');
    const input = document.getElementById('destination-input');
    const container = document.querySelector('.destination-container');
    const toggle = document.getElementById('dark-mode-toggle');

    function addDestination(name) {
        if (!name) return;
        const div = document.createElement('div');
        div.className = 'destination';
        const h2 = document.createElement('h2');
        h2.textContent = name;
        div.appendChild(h2);
        container.appendChild(div);
    }

    // load dark mode preference
    if (localStorage.getItem('dark') === 'true') {
        document.body.classList.add('dark');
    }

    // fetch existing destinations
    fetch('/api/destinations')
        .then(res => res.json())
        .then(list => list.forEach(addDestination));

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        fetch('/api/destinations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
        .then(res => res.json())
        .then(list => {
            container.innerHTML = '';
            list.forEach(addDestination);
        });
        input.value = '';
    });

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('dark', document.body.classList.contains('dark'));
    });
});
