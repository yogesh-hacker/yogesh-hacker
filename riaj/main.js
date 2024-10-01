const DATABASE_URL = "https://script.google.com/macros/s/AKfycbynNL9tsZu9wUkBGvr8BctvB2XqtUjZkmTyP5pMbl7v3M1BlKpOqqhg985Pk1yOXyW5/exec?action=read";

//const DATABASE_URL = "http://127.0.0.1:8000/api/?url=https://minoplres.xyz"

// Changing the page size affects which data rows are fetched.
// For example:
// - Page 2 with a page size of 50 shows rows 52 to 101.
// - Page 2 with a page size of 100 shows rows 102 to 201.
// If you're looking for a specific row, like row 52,
// and it's not on Page 2 with a page size of 50,
// you might find it on Page 1 in the middle instead of Page 2.
// So, the page number and page size determine which data rows are displayed.

class UserFetcher {
    constructor(url) {
        this.url = url;
        this.page = 3032;
        this.pageSize = 50;
        this.totalRecords = 0;
        this.resultElement = $("#result");
        this.prevButton = $("#prev");
        this.nextButton = $("#next");
        this.pageInfo = $("#currentPage");
        this.init();
    }

    init() {
        this.fetchUsers();
        this.prevButton.click(() => this.changePage(-1));
        this.nextButton.click(() => this.changePage(1));
    }

    async fetchUsers() {
        const response = await $.getJSON(`${this.url}&page=${this.page}&pageSize=${this.pageSize}&sex=F`);
        this.totalRecords = response.records.length;
        this.renderRecords(response.records);
        this.updateButtons();
    }

    renderRecords(records) {
        this.resultElement.empty();
        records.forEach(record => {
            this.resultElement.append(`
                <div class="record">
                <p>${record.data_id}</p>
                <img class="record_profile_image" src="${record.photo_image}" width="auto"/>
                <p class="profile_name">${record.name}</p>
                <p>${record.mobile_number}</p>
                <p>${record.address}</p>
                </div>
                `);
            this.lastDataId = record.data_id;
        });
    }

    changePage(offset) {
        this.page += offset;
        this.pageInfo.text(`Current Page: ${this.page}`);
        this.fetchUsers();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    updateButtons() {
        this.prevButton.prop("disabled", this.page === 1);
        //this.nextButton.prop("disabled", this.totalRecords < this.pageSize);
    }
}

$(document).ready(() => {
    new UserFetcher(DATABASE_URL);
});
/*
const settings = {
	async: true,
	crossDomain: true,
	url: 'https://proxify-url.p.rapidapi.com/proxify?url=https://watch.lonelil.ru&geo=gb%2Cde',
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'd75d999194msh3d44beadad8616cp163090jsn5cb53ae5e285',
		'x-rapidapi-host': 'proxify-url.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});*/
