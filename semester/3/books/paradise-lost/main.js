const element = $('.content');

function wrapWordsInElement(element, wordsToWrap, classForWrappedWords) {
    const lines = element.find('.content-line');

    lines.each(function () {
        const content = $(this).text();

        const newContent = content.replace(/\b(\w+)\b/g, (match) => {
            if (classForWrappedWords && wordsToWrap.includes(match)) {
                return `<span class="${classForWrappedWords}">${match}</span>`;
            } else {
                return `<span>${match}</span>`;
            }
        });

        $(this).html(newContent);
    });
}

function handleClickedWord(word) {
    $.ajax({
        url: "https://yogeshkumarjamre.pythonanywhere.com/api/" + word + "/",
        method: "GET",
        success: function (data, textStatus, xhr) {
            const alertCanvas = document.createElement('div');
            alertCanvas.id = "alertCanvas";
            const customAlert = document.createElement('div');
            customAlert.id = 'customAlert';

            // Create close button
            const closeButton = document.createElement('button');
            closeButton.id = 'closeButton';
            closeButton.innerHTML = '&times;';
            closeButton.onclick = function () {
                alertCanvas.style.display = 'none';
            };

            // Append close button to the alert box
            customAlert.appendChild(closeButton);

            // Append part of speech and sentences to the alert box
            Object.entries(data.info).forEach(([partOfSpeech, sentences]) => {
                const partOfSpeechElement = document.createElement('p');
                partOfSpeechElement.innerHTML = `<strong>${partOfSpeech}:</strong>`;
                customAlert.appendChild(partOfSpeechElement);

                sentences.forEach(sentence => {
                    const sentenceElement = document.createElement('p');
                    sentenceElement.innerHTML = `&ndash; ${sentence}`;
                    customAlert.appendChild(sentenceElement);
                });
            });
            alertCanvas.appendChild(customAlert);
            // Append the alert box to the body
            document.body.appendChild(alertCanvas);

            // Display the custom alert box
            customAlert.style.display = 'block';
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error("Error:",
                errorThrown);
        },
    });
}


$(document).ready(function () {
    const contentElement = $('.content');
    const wordsToWrapWithClass = ["Eden", "Oreb", "Sinai", "Chaos", "Sion", "Siloa'", "Aonian", "Palestine", "Beelzebub", "Titanian", "Earth-born", "Jove", "Briareos", "Typhon", "Tarsus", "Leviathan", "Norway", "Pelorus", "Aetna", "Stygian", "Satan", "Beelzebub", "Tuscan", "Fesole", "Valdarno", "Norwegian", "Vallombrosa", "Etrurian", "Orion", "Busirus", "Memphian", "Goshen", "Amrams", "Egypts", "Locusts", "Pharaoh", "Nile", "Rhene", "Danaw", "Gibralter", "Lybian", "Eve", "Jehovah", "Sion", "Moloch", "Ammonite", "Rabba", "Argob", "Basan", "Arnon", "Solomon", "Hinnom", "Tophet", "Gehenna", "Chemos", "Moabs", "Aroar", "Nebo", "Abarim", "Hesebon", "Heronaim", "Seons", "Sibma", "Eleale", "Asphaltick", "Peor", "Israel", "Sittim", "Nile", "Moloch", "Josiah", "Euphrates", "Egypt", "Syrian", "Baalim", "Ashtaroth", "Israel", "Astoreth", "Phoenicians", "Astarte", "Sidonian", "Sion", "Thammuz", "Lebanon", "Syrian", "Adonis", "Thammuz", "Sions", "Ezekial", "Judah", "Dagon", "Azotus", "Palestine", "Gath", "Ascalon", "Accaron", "Gaza", "Rimmon", "Damascus", "Abbana", "Pharphar", "Ahaz", "Syrian", "Osiris", "Isis", "Orus", "Egypt", "Israel", "Oreb", "Bethel", "Dan", "Jehovah", "Egypt", "Belial", "Ely's", "Belial", "Sodom", "Gibeah", "Ionian", "Javans", "Titan", "Saturn", "Jove", "Rhea's", "Jove", "Creet", "Ida", "Olympus", "Delphian", "Dodona", "Doric", "Saturn", "Adria", "Hesperian", "Celtic", "Azazel", "Chaos", "Phalanx", "Dorian", "Phlegra", "Theb's", "Ilium", "Romance", "Uthers", "British", "Armoric", "Aspramont", "Montalban", "Damasco", "Marocco", "Trebisond", "Biserta", "Afric", "Charlemain", "Fontarabbia", "Mammon", "Mammon", "Babel", "Memphian", "Pilasters", "Babilon", "Alcairo", "Belus", "Serapis", "Aegypt", "Assyria", "Naphtha", "Asphaltus", "Greece", "Ausonian", "Mulciber", "Jove", "Lemnos", "Aegaean", "Pandaemonium", "Panim", "Taurus", "Indian"];

    wrapWordsInElement(contentElement,
        wordsToWrapWithClass,
        'clickable');

    contentElement.on('click',
        'span',
        function (event) {
            const clickedWord = $(event.target).closest('span').text();
            if (clickedWord) {
                handleClickedWord(clickedWord);
            }
            event.stopPropagation();
        });
});
