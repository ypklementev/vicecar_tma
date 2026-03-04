function render() {
    const content = document.getElementById("content");

    if (state.view === "cars") {
        renderCars(content);
    }

    if (state.view === "car") {
        renderCar(content);
    }
}

function renderCars(container) {
    document.getElementById("header-title").innerText = "Мои автомобили";
    document.getElementById("header-subtitle").innerText =
        state.user ? `Привет, ${state.user.first_name}` : "";

    container.innerHTML = `<div class="grid"></div>`;
    const grid = container.querySelector(".grid");

    state.cars.forEach(car => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="car-name">${car.brand} ${car.model}</div>
            <div class="car-mileage">${car.current_mileage} км</div>
        `;
        card.onclick = () => openCar(car.id);
        grid.appendChild(card);
    });
}

async function renderCar(container) {
    const car = state.cars.find(c => c.id === state.currentCarId);

    document.getElementById("header-title").innerText =
        `${car.brand} ${car.model}`;
    document.getElementById("header-subtitle").innerText = "";

    document.getElementById("header-title").innerHTML =
        `<span onclick="goBack()" style="cursor:pointer">←</span> 
     ${car.brand} ${car.model}`;

    const oil = await api(`/cars/${car.id}/oil-status`);

    container.innerHTML = `
        <div class="summary">
            <div class="summary-value">${car.current_mileage} км</div>
            <div class="summary-label">📍 Текущий пробег</div>
        </div>

        <div class="tabs">
            <div class="tab ${state.activeTab === "maintenance" ? "active" : ""}"
                onclick="switchTab('maintenance')">ТО</div>
            <div class="tab ${state.activeTab === "service" ? "active" : ""}"
                onclick="switchTab('service')">Сервисная книга</div>
        </div>

        <div id="tab-content"></div>
    `;

    renderTabContent();
}

async function renderTabContent() {
    const container = document.getElementById("tab-content");

    if (!container) return;

    if (state.activeTab === "maintenance") {
        const records = await api(`/maintenance/${state.currentCarId}`);

        if (!records.length) {
            container.innerHTML = `<div class="list-item">Нет записей ТО</div>`;
            return;
        }

        container.innerHTML = "";

        records.forEach(record => {
            const div = document.createElement("div");
            div.className = "list-item";

            div.innerHTML = `
                <strong>${new Date(record.date).toLocaleDateString()}</strong><br>
                ${record.mileage} км<br>
                ${record.total_cost} ₽
            `;

            container.appendChild(div);
        });
    }

    if (state.activeTab === "service") {
        const records = await api(`/cars/${state.currentCarId}/service-book`);

        const container = document.getElementById("tab-content");

        if (!records.length) {
            container.innerHTML = `<div class="list-item">Записей нет</div>`;
            return;
        }

        container.innerHTML = "";

        records.forEach(record => {
            const div = document.createElement("div");
            div.className = "list-item";

            const typeLabel =
                record.type === "maintenance" ? "ТО" : "Ремонт";

            div.innerHTML = `
            <strong>${new Date(record.date).toLocaleDateString()}</strong><br>
            ${typeLabel} | ${record.mileage} км<br>
            ${record.total_cost} ₽
        `;

            container.appendChild(div);
        });
    }
}