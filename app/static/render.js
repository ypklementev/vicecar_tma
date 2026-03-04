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

    // Плавное появление сетки
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 200);
}

async function renderCar(container) {
    const car = state.cars.find(c => c.id === state.currentCarId);

    document.getElementById("header-title").innerHTML =
        `<span onclick="goBack()" style="cursor:pointer">←</span> 
         ${car.brand} ${car.model}`;
    document.getElementById("header-subtitle").innerText = "";

    const oil = await api(`/cars/${car.id}/oil-status`); // можно заменить на реальные данные

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

    // Рендерим содержимое вкладки с анимацией
    await renderTabContent();
}

async function renderTabContent() {
    const container = document.getElementById("tab-content");
    if (!container) return;

    // Показываем спиннер с плавным появлением
    container.innerHTML = `<div class="loader"></div>`;
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 200);

    try {
        let records;
        if (state.activeTab === "maintenance") {
            records = await api(`/maintenance/${state.currentCarId}`);
        } else {
            records = await api(`/cars/${state.currentCarId}/service-book`);
        }

        // Формируем HTML
        let html = '';
        if (!records.length) {
            html = `<div class="list-item">Нет записей</div>`;
        } else {
            records.forEach(record => {
                if (state.activeTab === "maintenance") {
                    html += `
                        <div class="list-item">
                            <strong>${new Date(record.date).toLocaleDateString()}</strong><br>
                            ${record.mileage} км<br>
                            ${record.total_cost} ₽
                        </div>
                    `;
                } else {
                    const typeLabel = record.type === "maintenance" ? "🛠 ТО" : "🔧 Ремонт";
                    html += `
                        <div class="list-item">
                            <strong>${new Date(record.date).toLocaleDateString()}</strong><br>
                            ${typeLabel} | ${record.mileage} км<br>
                            ${record.total_cost} ₽
                        </div>
                    `;
                }
            });
        }

        // Плавно заменяем спиннер на контент
        container.innerHTML = html;
        container.classList.add('fade-in');
        setTimeout(() => container.classList.remove('fade-in'), 200);
    } catch (error) {
        container.innerHTML = `<div class="list-item">Ошибка загрузки. Потяните для обновления</div>`;
    }
}