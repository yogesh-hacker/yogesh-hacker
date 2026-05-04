// Function to assign specific gradient colors and logos to parties
function getPartyStyles(partyName) {
    let abbr = partyName.split(' - ').pop().trim();
    if (abbr.length > 5) abbr = abbr.substring(0, 3).toUpperCase();

    // Define color and logo mappings for known parties
    const partyData = {
        "BJP": { 
            bg: "linear-gradient(135deg, #FF9933 0%, #E67E22 100%)", 
            logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Bharatiya_Janata_Party_%28icon%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
        },
        "AITC": { 
            bg: "linear-gradient(135deg, #20C646 0%, #0E912C 100%)", 
            logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/All_India_Trinamool_Congress_logo.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" 
        },
        "CPI": { 
            bg: "linear-gradient(135deg, #DE0000 0%, #A30000 100%)", 
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Cpim_party_symbol.svg" 
        },
        "INC": { 
            bg: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)",   
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Indian_National_Congress_hand_logo.svg" 
        },
        "BGPM": { 
            bg: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",  
            logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/BGPM_Flag.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
        },
        "AJUP": { 
            bg: "linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)",   
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Aam_Janata_Unnyan_Party_Logo.png/960px-Aam_Janata_Unnyan_Party_Logo.png" 
        }
    };

    const defaultBg = "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)";
    const data = partyData[abbr] || {};

    return {
        bg: data.bg || defaultBg,
        logo: data.logo || null,
        abbr: abbr
    };
}

function getVoteOverview(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll("tbody tr");

    let results = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 4) { 
            const party = cols[0]?.innerText.trim();
            const won = cols[1]?.innerText.trim();
            const leading = cols[2]?.innerText.trim();
            const total = cols[3]?.innerText.trim();

            if (party) {
                results.push({
                    party,
                    won: Number(won) || 0,
                    leading: Number(leading) || 0,
                    total: Number(total) || 0
                });
            }
        }
    });

    return results;
}

function renderCards(data) {
    const container = document.getElementById('cardContainer');
    container.innerHTML = ''; 

    data.forEach(item => {
        const style = getPartyStyles(item.party);
        const card = document.createElement('div');
        card.className = 'card';
        card.style.background = style.bg; 
        
        // Check if a logo exists. If yes, use <img>, otherwise fallback to text abbreviation.
        const iconContent = style.logo 
            ? `<img src="${style.logo}" alt="${style.abbr}" class="party-logo-img">`
            : style.abbr;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="party-icon">${iconContent}</div>
                <h2 class="card-title">${item.party}</h2>
            </div>
            <div class="card-stats">
                <div class="stat-group">
                    <span class="stat-value">${item.won}</span>
                    <span class="stat-label">Won</span>
                </div>
                <div class="stat-group">
                    <span class="stat-value">${item.leading}</span>
                    <span class="stat-label">Leading</span>
                </div>
                <div class="stat-group">
                    <span class="stat-value">${item.total}</span>
                    <span class="stat-label">Total</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });

    const now = new Date();
    document.getElementById('lastUpdated').innerText = `Last updated: ${now.toLocaleTimeString()}`;
}

async function fetchAndRender() {
    try {
        const resp = await fetch('https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S25.htm');
        const data = await resp.text();
        const resultData = getVoteOverview(data);
        renderCards(resultData);
    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('lastUpdated').innerText = "Error fetching data. Retrying...";
    }
}

fetchAndRender();
setInterval(fetchAndRender, 30000);
