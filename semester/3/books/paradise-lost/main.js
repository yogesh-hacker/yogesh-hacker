var tabLeft = $(".tab-left");
var tabRight = $(".tab-right");
var tabBorder = $(".tab-border");
var tabContentLeft = $(".tab-content-left");
var tabContentRight = $(".tab-content-right");

tabLeft.click(function() {
    tabBorder.css("transform", "translateX(0)");
    tabContentRight.css("display", "none");
    tabContentLeft.css("display", "flex");
});

tabRight.click(function() {
    tabBorder.css("transform", "translateX(100%)");
    tabContentRight.css("display", "flex");
    tabContentLeft.css("display", "none");
});

function appendImageSequentially(i) {
    if (i <= 140) {
        var imageUrl = "https://yogesh-hacker.github.io/yogesh-hacker/semester/3/books/paradise-lost/paradiselostbook0000milt_i4e4_0" + i + ".jpg";
        $(".tab-content-right").append("<img src='" + imageUrl + "'/>");
        setTimeout(function () {
            appendImageSequentially(i + 1);
        }, 500);
    }
}

$(document).ready(function(){
    appendImageSequentially(105);
})

// // Get the element by its class name
const element = document.querySelector('.content');

// Define the words you want to wrap
const wordsToWrap = ["Eden","Oreb","Sinai","Chaos","Sion","Siloa'","Aonian","Palestine","Beelzebub","Titanian","Earth-born","Jove","Briareos","Typhon","Tarsus","Leviathan","Norway","Pelorus","Aetna","Stygian","Satan","Beelzebub","Tuscan","Fesole","Valdarno","Norwegian","Vallombrosa","Etrurian","Orion","Busirus","Memphian","Goshen","Amrams","Egypts","Locusts","Pharaoh","Nile","Rhene","Danaw","Gibralter","Lybian","Eve","Jehovah","Sion","Moloch","Ammonite","Rabba","Argob","Basan","Arnon","Solomon","Hinnom","Tophet","Gehenna","Chemos","Moabs","Aroar","Nebo","Abarim","Hesebon","Heronaim","Seons","Sibma","Eleale","Asphaltick","Peor","Israel","Sittim","Nile","Moloch","Josiah","Euphrates","Egypt","Syrian","Baalim","Ashtaroth","Israel","Astoreth","Phoenicians","Astarte","Sidonian","Sion","Thammuz","Lebanon","Syrian","Adonis","Thammuz","Sions","Ezekial","Judah","Dagon","Azotus","Palestine","Gath","Ascalon","Accaron","Gaza","Rimmon","Damascus","Abbana","Pharphar","Ahaz","Syrian","Osiris","Isis","Orus","Egypt","Israel","Oreb","Bethel","Dan","Jehovah","Egypt","Belial","Ely's","Belial","Sodom","Gibeah","Ionian","Javans","Titan","Saturn","Jove","Rhea's","Jove","Creet","Ida","Olympus","Delphian","Dodona","Doric","Saturn","Adria","Hesperian","Celtic","Azazel","Chaos","Phalanx","Dorian","Phlegra","Theb's","Ilium","Romance","Uthers","British","Armoric","Aspramont","Montalban","Damasco","Marocco","Trebisond","Biserta","Afric","Charlemain","Fontarabbia","Mammon","Mammon","Babel","Memphian","Pilasters","Babilon","Alcairo","Belus","Serapis","Aegypt","Assyria","Naphtha","Asphaltus","Greece","Ausonian","Mulciber","Jove","Lemnos","Aegaean","Pandaemonium","Panim","Taurus","Indian"];

// Function to wrap each specific word with <em> tags
function wrapWordsInElement(element, words) {
  var content = element.innerHTML;
  words.forEach(word => {
    var regex = new RegExp(`\\b${word}\\b`, 'gi'); // 'i' makes it case-insensitive
    content = content.replace(regex, `<em>$&</em>`);
  });
  element.innerHTML = content;
}

wrapWordsInElement(element, wordsToWrap);
