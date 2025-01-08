var data = [];

$(document).ready(function() {
    loadData()
})

function loadData() {
    toggleImage("https://mir-s3-cdn-cf.behance.net/project_modules/disp/04de2e31234507.564a1d23645bf.gif");
    var script_url = "https://script.google.com/macros/s/AKfycbxZZ4TtWgEYUwfUDzp2oSHs6gcarK0wpOP9bbNU-5LbIr7gALr6rgAJSFDvoWR2tVX-/exec";
    $(".canvas").css("display",
        "flex");
    var url = script_url + "?action=read";
    $.getJSON(url,
        function (json) {
            $(".canvas").css("display", "none");
            for (var i = 0; i < json.records.length; i++) {
                data.push(json.records[i])
            }
            showData();
        })
}

function showData() {
    const itemStats = {};
    const itemInfo = {
        1: {
            name: 'I cannot live with you',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        2: {
            name: 'I’m wife; I’ve finished that',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        3: {
            name: 'Daddy',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        4: {
            name: 'Advice to Women',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        5: {
            name: 'Bequest',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        6: {
            name: 'The Yellow Wallpaper',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        7: {
            name: 'Bliss',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        8: {
            name: 'Draupadi',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        9: {
            name: 'Look Back in Anger',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        10: {
            name: 'Leda and the Swan',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        11: {
            name: 'The Second Coming',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        12: {
            name: 'The Love Song of J. Alfred Prufrock',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        13: {
            name: 'The Hollow Men',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        14: {
            name: 'Where the mind is without fear',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        15: {
            name: 'Leave thy chanting and singing and telling beads',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        16: {
            name: 'Art thou abroad on this stormy night',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        17: {
            name: 'Obstinate are the trammels',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        18: {
            name: 'Hind Swaraj',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        19: {
            name: 'The Shadow Lines',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        20: {
            name: 'Alam\'s Own House',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        21: {
            name: 'The Final Solution',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        22: {
            name: 'Toba Tek Sing',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        },
        22: {
            name: 'A Leaf in the Storm',
            marks: {
                2: 0, 5: 0, 10: 0
            }
        }
    };

    const stats = data.reduce((acc, item) => {
        if (item.question !== "") {
            acc.totalQuestions++;
            if (item.answer !== "") {
                acc.answered++;
            }
            acc[`fromCC${item.paper_id}`]++;
            acc[`total${item.mark}Marks`]++;

            const itemId = item.item_id;
            if (itemInfo[itemId]) {
                acc[`fromItemID${itemId}`]++;
                itemInfo[itemId].marks[item.mark]++;
            }
        }
        return acc;
    },
        {
            totalQuestions: 0,
            answered: 0,
            fromCC11: 0,
            fromCC12: 0,
            fromDSE1: 0,
            fromDSE2: 0,
            total10Marks: 0,
            total5Marks: 0,
            total2Marks: 0,
            ...Object.fromEntries(Object.keys(itemInfo).map(id => [`fromItemID${id}`, 0]))
        });

    const resultHtml = `
    <p>Total Questions : ${stats.totalQuestions}</p>
    <p>Answered Questions : ${stats.answered} (${((stats.answered / stats.totalQuestions)*100).toFixed(2)}%)</p>
    <p>From CC 11 : ${stats.fromCC11}</p>
    <p>From CC 12 : ${stats.fromCC12}</p>
    <p>From DSE 1 : ${stats.fromDSE1}</p>
    <p>From DSE 2 : ${stats.fromDSE2}</p>
    <p>Total 10 Marks : ${stats.total10Marks}</p>
    <p>Total 5 Marks : ${stats.total5Marks}</p>
    <p>Total 2 Marks : ${stats.total2Marks}</p>
    <h2>Book Wise</h2>
    ${Object.keys(itemInfo).map((id, index) => `
        <p>
        ${index + 1}. From <span class="book-name">${itemInfo[id].name}</span> :
        <span class="mark-style">${itemInfo[id].marks[2]}</span> questions with 2 marks,
        <span class="mark-style">${itemInfo[id].marks[5]}</span> questions with 5 marks,
        <span class="mark-style">${itemInfo[id].marks[10]}</span> questions with 10 marks
        </p><br>`).join('')}
    `;

    $("#result").append(resultHtml);
    toggleImage('remove');
}

function toggleImage(imageUrl) {
    const $existingImage = $('#fixedImage');
    if ($existingImage.length) {
        $existingImage.remove();
    } else {
        $('<img>', {
            id: 'fixedImage',
            src: imageUrl,
            css: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '1000'
            }
        }).appendTo('body');
    }
}
