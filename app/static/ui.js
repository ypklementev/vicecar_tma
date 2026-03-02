function renderUser(user) {
    document.getElementById("user-info").innerText =
        `Привет, ${user.first_name}`;
}

function renderCars(cars) {
    const container = document.getElementById("cars-list");
    container.innerHTML = "";

    cars.forEach(car => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <strong>${car.brand} ${car.model}</strong><br>
            ${car.year}<br>
            ${car.current_mileage} км
        `;

        card.onclick = () => openCar(car.id);

        container.appendChild(card);
    });
}