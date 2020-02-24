// Lihtne viis vormistada kellaeg meile sobivasse formaati: 00:00:00
const timeFormatter = new Intl.DateTimeFormat("et", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

const dateFormatter = new Intl.DateTimeFormat("et", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

function date() {

    const dateElement = document.getElementById("date");
    const date = Date.now();
    // Mugavalt vormistab kuupäeva
    const formattedDate = dateFormatter.format(date);

    dateElement.innerHTML = "Täna on " + formattedDate;

    const formattedTime = timeFormatter.format(date);

    let count = 1;
    for (const char of formattedTime) {

        const canvas = document.getElementById(`${count}`);
        count += 1;

        // Kasutame ühte SVG faili, kus on kõik numbrid ja koolon olemas SVG fragmentidena
        canvas.style.mask = `url(combined.svg#${char}) 50% 50% no-repeat`;
        canvas.style.webkitMask = `url(combined.svg#${char}) 50% 50% no-repeat`;
    }
}

// See jookseb async esimesel jooksutamisel
// kuid ma ei ole kindel kas setInterval on async
setTimeout(() => {
    date();
    setInterval(date, 1000);
});