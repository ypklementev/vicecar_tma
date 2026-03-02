let maintenanceItems = [];
let repairItems = [];

const PRESET_MAINTENANCE = [
    { type: "oil", name: "Замена масла" },
    { type: "oil_filter", name: "Замена масляного фильтра" },
    { type: "air_filter_engine", name: "Замена воздушного фильтра (двигатель)" },
    { type: "brake_fluid", name: "Замена тормозной жидкости" },
    { type: "coolant", name: "Замена охлаждающей жидкости" },
    { type: "gear_oil", name: "Замена масла КПП" },
    { type: "gear_oil_filter", name: "Замена маскляного фильтра КПП" },
    { type: "fuel_filter", name: "Замена топливного фильтра" },
    { type: "spark_plug", name: "Замена свечей зажигания" },
    { type: "air_filter_cabin", name: "Замена салонного фильтра" }
];

const REPAIR_CATEGORIES = [
    { value: "engine", label: "Двигатель" },
    { value: "transmission", label: "Трансмиссия" },
    { value: "brakes", label: "Тормозная система" },
    { value: "suspension", label: "Подвеска" },
    { value: "electrical", label: "Электрика" },
    { value: "cooling", label: "Система охлаждения" },
    { value: "climate", label: "Климат и отопление" },
    { value: "body", label: "Кузовные работы" },
    { value: "other", label: "Другое" }
];

async function init() {
    state.user = await api("/users/me");
    state.cars = await api("/cars/");
    render();
}

function openCar(id) {
    state.view = "car";
    state.currentCarId = id;
    render();
}

function switchTab(tab) {
    state.activeTab = tab;
    render();
}

function handleFab() {
    if (state.view === "cars") {
        openAddCarModal();
    }

    if (state.view === "car") {
        openAddMaintenanceModal();
    }

    if (state.view === "car" && state.activeTab === "service") {
        openAddRepairModal();
    }
}

function openAddRepairModal() {
    repairItems = [];

    const modal = document.getElementById("modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <h3>Новый ремонт</h3>
        <input id="repair-mileage" type="number" placeholder="Пробег">
        <input id="repair-comment" placeholder="Комментарий">

        <h4>Работы</h4>
        <div id="repair-items"></div>

        <button onclick="addRepairItem()">+ Добавить работу</button>

        <div style="margin-top:16px;">
            <strong>Итого: <span id="repair-total">0</span> ₽</strong>
        </div>

        <button onclick="submitRepair()">Сохранить</button>
    `;

    modal.classList.remove("hidden");
}

function addRepairItem() {
    repairItems.push({
        type: "other",
        name: "",
        cost: 0
    });

    renderRepairItems();
}

function openAddCarModal() {
    const modal = document.getElementById("modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <h3>Добавить автомобиль</h3>
        <input id="brand" placeholder="Марка">
        <input id="model" placeholder="Модель">
        <input id="year" type="number" placeholder="Год">
        <input id="mileage" type="number" placeholder="Пробег">
        <button onclick="createCar()">Сохранить</button>
    `;

    modal.classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function openAddMaintenanceModal() {
    maintenanceItems = [];

    const modal = document.getElementById("modal");
    const content = document.getElementById("modal-content");

    content.innerHTML = `
        <h3>Новое ТО</h3>
        <input id="mileage-input" type="number" placeholder="Пробег">
        <input id="comment-input" placeholder="Комментарий">

        <h4>Работы</h4>
        <div id="preset-list"></div>

        <button onclick="addCustomItem()">+ Добавить свою работу</button>

        <div id="selected-items"></div>

        <button onclick="submitMaintenance()">Сохранить</button>
    `;

    renderPresetItems();
    modal.classList.remove("hidden");
}

function renderPresetItems() {
    const container = document.getElementById("preset-list");
    container.innerHTML = "";

    PRESET_MAINTENANCE.forEach(preset => {
        const btn = document.createElement("button");
        btn.innerText = preset.name;
        btn.onclick = () => {
            maintenanceItems.push({
                type: preset.type,
                name: preset.name,
                cost: 0
            });
            renderSelectedItems();
        };
        container.appendChild(btn);
    });
}

function renderRepairItems() {
    const container = document.getElementById("repair-items");
    container.innerHTML = "";

    repairItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "list-item";

        const categoryOptions = REPAIR_CATEGORIES.map(cat => `
            <option value="${cat.value}" 
                ${cat.value === item.type ? "selected" : ""}>
                ${cat.label}
            </option>
        `).join("");

        div.innerHTML = `
            <select onchange="updateRepairType(${index}, this.value)">
                ${categoryOptions}
            </select>

            <input placeholder="Название работы"
                value="${item.name}"
                onchange="updateRepairName(${index}, this.value)">

            <input type="number" placeholder="Стоимость"
                value="${item.cost}"
                onchange="updateRepairCost(${index}, this.value)">

            <button onclick="removeRepairItem(${index})">Удалить</button>
        `;

        container.appendChild(div);
    });

    updateRepairTotal();
}

function updateRepairType(index, value) {
    repairItems[index].type = value;
}

function updateRepairName(index, value) {
    repairItems[index].name = value;
}

function updateRepairCost(index, value) {
    repairItems[index].cost = parseFloat(value) || 0;
    updateRepairTotal();
}

function removeRepairItem(index) {
    repairItems.splice(index, 1);
    renderRepairItems();
}

function updateRepairTotal() {
    const total = repairItems.reduce((sum, item) => sum + item.cost, 0);
    document.getElementById("repair-total").innerText = total;
}

async function submitRepair() {
    const mileage = parseInt(document.getElementById("repair-mileage").value);
    const comment = document.getElementById("repair-comment").value;

    await api(`/repairs/${state.currentCarId}`, {
        method: "POST",
        body: JSON.stringify({
            date: new Date().toISOString(),
            mileage: mileage,
            comment: comment,
            items: repairItems
        })
    });

    closeModal();
    render();
}

function addCustomItem() {
    const name = prompt("Название работы:");
    if (!name) return;

    maintenanceItems.push({
        type: null,
        name: name,
        cost: 0
    });

    renderSelectedItems();
}

function renderSelectedItems() {
    const container = document.getElementById("selected-items");
    container.innerHTML = "";

    maintenanceItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "list-item";
        div.innerHTML = `
            ${item.name}
            <input type="number" placeholder="Стоимость"
                onchange="updateItemCost(${index}, this.value)">
        `;
        container.appendChild(div);
    });
}

function updateItemCost(index, value) {
    maintenanceItems[index].cost = parseFloat(value) || 0;
}

async function submitMaintenance() {
    const mileage = parseInt(document.getElementById("mileage-input").value);
    const comment = document.getElementById("comment-input").value;

    await api(`/maintenance/${state.currentCarId}`, {
        method: "POST",
        body: JSON.stringify({
            date: new Date().toISOString(),
            mileage: mileage,
            comment: comment,
            items: maintenanceItems
        })
    });

    closeModal();
    render();
}

async function createCar() {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const year = parseInt(document.getElementById("year").value);
    const mileage = parseInt(document.getElementById("mileage").value);

    await api("/cars/", {
        method: "POST",
        body: JSON.stringify({
            brand,
            model,
            year,
            current_mileage: mileage
        })
    });

    state.cars = await api("/cars/");
    closeModal();
    render();
}

async function createMaintenance() {
    const mileage = parseInt(document.getElementById("mileage-input").value);
    const cost = parseFloat(document.getElementById("cost-input").value);
    const oilChanged = document.getElementById("oil-checkbox").checked;

    await api(`/maintenance/${state.currentCarId}`, {
        method: "POST",
        body: JSON.stringify({
            date: new Date().toISOString(),
            mileage,
            cost,
            oil_changed: oilChanged
        })
    });

    closeModal();
    render();
}

function goBack() {
    state.view = "cars";
    render();
}

init();