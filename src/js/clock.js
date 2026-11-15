const clock = document.getElementById("clock");

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })

    clock.textContent = time;

}

updateClock();
setInterval(updateClock, 1000);