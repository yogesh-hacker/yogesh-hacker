$(document).ready(function () {
    // Fetch and display FAQs
    $.getJSON("faq.json", function (data) {
        displayFAQs(data);
    });

    // Function to display the FAQs
    function displayFAQs(faqData) {
        let faqHtml = '';
        faqData.forEach((faq, index) => {
            faqHtml += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                            ${faq.question}
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                            ${faq.answer}
                        </div>
                    </div>
                </div>`;
        });
        $("#faqAccordion").html(faqHtml);
    }

    // Search function
    window.searchFAQ = function () {
        const searchValue = $("#faqSearch").val().toLowerCase();
        $.getJSON("faq.json", function (data) {
            const filteredData = data.filter(faq => faq.question.toLowerCase().includes(searchValue));
            displayFAQs(filteredData);
        });
    };
});
