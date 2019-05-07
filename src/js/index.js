
const pg = (function () {
	const pg = {};
	pg.deck = []
	pg.deckItems = [];
	pg.sum = {
		total: 0,
		bonus: 0,
		bonusItems: {}
	};

	pg.itemsCollection = {
		'A': { title: 'A', points: 50, counter: 0, sum: 0, bonus: { value: 200, counter: 2 } },
		'B': { title: 'B', points: 30, counter: 0, sum: 0, bonus: { value: 90, counter: 3 } },
		'C': { title: 'C', points: 20, counter: 0, sum: 0 },
		'D': { title: 'D', points: 15, counter: 0,  sum: 0 },
		'E': { title: 'E', points: 5, counter: 0, sum: 0 }
	};

	pg.init = () => {
		document.querySelector(".pg--items-list-placeholder").innerHTML = '';
		Object.keys(pg.itemsCollection).forEach( (item) => {
			const instance = document.createElement('pg-item');
			instance.render(pg.itemsCollection[item]);
			document.querySelector(".pg--items-list-placeholder").appendChild(instance);
		});

		document.querySelector('.pg-reset').addEventListener('click', () => {
			pg.reset();
		});

		pg.renderDeckTotal();
		pg.deckCalculete();
		pg.renderDeckItemsList();
	}

	pg.reset = () => {
		pg.deck = [];
		pg.deckItems = [];
		pg.sum = {
			total: 0,
			bonus: 0,
			bonusItems: {}
		};
		pg.init();
	}

	pg.addToDeck = (item) => {
		pg.deck.push(item);
		pg.deckItems[item.title] = {
			'title': item.title,
			'points': item.points,
			'counter': ++ item.counter
		};
		pg.deckCalculete();
		pg.renderDeckItemsList();
	}

	pg.deckCalculete = () => {
		let itmsSum = 0; 
		let bonus = 0;
		pg.deck.forEach( (itm) => {
			itmsSum += itm.points;
			pg.deckItems[itm.title].points = itm.points * itm.counter;

			if (itm.bonus) {
				const mathesCounter = Math.floor( pg.deckItems[itm.title].counter / itm.bonus.counter );
				pg.sum.bonusItems[itm.title] = {
					'counter': mathesCounter,
					'bonus': pg.sum.bonusItems[itm.title] ? mathesCounter * itm.bonus.value : 0
				};
				pg.deckItems[itm.title].points += pg.sum.bonusItems[itm.title].bonus;
			}
		});

		Object.keys(pg.sum.bonusItems).forEach( bns => {
			bonus += pg.sum.bonusItems[bns].bonus;
		});

		pg.sum.bonus = bonus;
		pg.sum.total = itmsSum + bonus;
		
		pg.renderDeckTotal();
	};
 
	pg.renderDeckItemsList = () => {
		document.querySelector(".pg--deck-list").innerHTML = '';

		Object.keys(pg.deckItems).forEach( (item) => {
			const instance = document.createElement('pg-deck-item');
			instance.render(pg.deckItems[item]);
			document.querySelector(".pg--deck-list").appendChild(instance);
		});
	}

	pg.renderDeckTotal = () => {
		document.querySelector('.pg--total-number').innerHTML = pg.sum.total;
		document.querySelector('.pg--bonus-number').innerHTML = pg.sum.bonus;
	}

	return pg;
})();

// Header
customElements.define('pg-header', class extends HTMLElement {
	constructor() {
		super();
		const tmpl = document.querySelector('#pg-header');
		let shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
		this.shadowRoot.querySelector('h1').innerHTML = this.textContent;
	}
});

// Item component
customElements.define('pg-item', class extends HTMLElement {
	constructor() {
		super();
		let options = {};
		const tmpl = document.querySelector('#pg-item');
		let shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
		
		this.addEventListener("click", () => {
			pg.addToDeck(this.options);
		});
	}

	render(item) {
		this.options = {...item};
		this.shadowRoot.querySelector('.pg-item--name').innerHTML = item.title;
		this.shadowRoot.querySelector('.pg-item--points').innerHTML = item.points;
	} 
});

// Item deck
customElements.define('pg-deck-item', class extends HTMLElement {
	constructor() {
		super();
		const tmpl = document.querySelector('#pg-deck-item');
		let shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
	}

	render(item) {
		this.shadowRoot.querySelector('.pg-deck-item--name').innerHTML = item.title;
		this.shadowRoot.querySelector('.pg-deck-item--counter').innerHTML = item.counter;
		this.shadowRoot.querySelector('.pg-deck-item--points').innerHTML = item.points;
	} 
});


(function () {
	pg.init();
})();