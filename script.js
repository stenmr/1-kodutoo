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


// Kasutame setTimeout-i sest kell uuendub vaid korra sekundis
// ja requestAnimationFrame optimaalseks esituseks (võib-olla läheb sünkroonist välja?)
function clock() {
    setTimeout(() => {

        const date = Date.now();

        const formattedTime = timeFormatter.format(date);

        // Count-i kasutame canvaste kättesaamiseks nende id järgi (mis on samuti numbrid)
        // Võib-olla saab lihtsamalt kui kasutada document.getElementsByTagName("canvas") kuid ei ole kindel kas see garanteerib sama järjekorra alati
        let count = 1;
        for (const char of formattedTime) {

            const canvas = document.getElementById(`${count}`);
            count += 1;

            // Kasutame ühte SVG faili, kus on kõik numbrid ja koolon olemas SVG fragmentidena
            canvas.style.mask = `url(combined.svg#${char}) 50% 50% no-repeat`;
            canvas.style.webkitMask = `url(combined.svg#${char}) 50% 50% no-repeat`;

            

            const ctx = canvas.getContext("2d");

            // Genereerime tühja imageData
            const imageData = ctx.createImageData(canvas.width, canvas.height);

            // Loop peab hüppama nelja võrra
            // Sest me muudame 4 väärtust korraga pikslis igal iteratsioonil (RGBA)
            for (let i = 0; i < imageData.data.length; i += 4) {

                // Võtame aja dokumendi loomise algusest millisekundites
                // On väga hea muutuja, sest iga kord kui kutsume selle funktsiooni esile, on see arv suurem
                const t = window.performance.now();

                // Kasutame sin ja cos kuna see on hea viis arvu normaliseerimiseks
                // jagamine 1536-ga on lihtsalt meelepärane värvi muutumiskiirus
                const r = 64 + 64 * Math.sin(t / 1536);
                const g = 92 + 64 * Math.cos(t / 1536);

                // Paneme uued värvid käesolevasse pikslisse, sinine ja alpha jätame konstantseks
                [imageData.data[i + 0], imageData.data[i + 1], imageData.data[i + 2], imageData.data[i + 3]] = [r, g, 166, 255];
            }

            // Kirjutame üle uue imageData-ga
            ctx.putImageData(imageData, 0, 0);

        }
        requestAnimationFrame(clock);
    })
};

clock()


function date() {

    const dateElement = document.getElementById("date");
    const date = Date.now();
    const formattedDate = dateFormatter.format(date);

    dateElement.innerHTML = "Täna on " + formattedDate;
}

// See jookseb async esimesel jooksutamisel
// kuid ma ei ole kindel kas setInterval on async
// igatahes korra minutis peaks piisama, sest kella animatsioon kasutab niigi ressursse
setTimeout(() => {
    date();
    setInterval(date, 60 * 1000);
});