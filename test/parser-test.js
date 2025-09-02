"use strict";

var parser = require("../dist/cjs/index");
var assert = require("assert");

describe("parser", function () {
	it("should whrow error for invalid text/language", function () {
		assert.throws(function () {
			parser.parse();
		});
		assert.throws(function () {
			parser.parse("text", "__");
		});
	});

	it("should filter quotes", function () {
		var text = '"Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, "ro", {
			minLength: 100,
		});
		assert.equal(0, quotes.length);
	});

	it("should parse simple quote", function () {
		var quotes = parser.parse(
			'"Nu cred ca este adevarat!", a spus Vlad Filat',
			"ro",
			{
				minLength: 15,
			}
		);
		assert.equal(1, quotes.length);
		assert.equal("Nu cred ca este adevarat!", quotes[0].text);
		assert.equal(1, quotes[0].index);
		assert.equal("Vlad Filat", quotes[0].name.text);
	});

	it("should find quote & author", function () {
		var text = 'Plus "Nu cred ca este adevarat!", a spus Vlad Filat';
		var quotes = parser.parse(text, "ro", {
			minLength: 15,
			persons: [
				{
					index: 41,
					id: 101,
				},
			],
		});
		assert.equal(1, quotes.length);
		var quote = quotes[0];
		assert.equal("Nu cred ca este adevarat!", quote.text);
		assert.equal(6, quote.index);
		assert.equal("Vlad Filat", quote.name.text);
		assert.equal(101, quote.author.id);
	});

	it("should find quote in a big text", function () {
		var text =
			"Comisia Europeană a adoptat o serie de programe de cooperare transfrontalieră, care au un buget total de un miliard de euro și sunt destinate să sprijine dezvoltarea socială și economică a regiunilor situate de ambele părți ale frontierelor externe ale UE.\n„Cooperarea transfrontalieră este esențială pentru evitarea creării unor noi linii de separare. Această nouă finanțare va contribui la o dezvoltare regională mai integrată și mai durabilă a regiunilor frontaliere învecinate și la o cooperare teritorială mai armonioasă în zona frontierelor externe ale UE”, a declarat Johannes Hahn, comisarul pentru politica europeană de vecinătate și negocieri privind extinderea, potrivit unui comunicat transmis joi de Reprezentanța CE la București, notează Agerpres.ro.\n„Sunt foarte mulțumită că Fondul European de Dezvoltare Regională poate contribui la apropierea UE de vecinii săi. Programele de cooperare transfrontalieră reprezintă exemple concrete ale modului în care UE acționează pentru a-i ajuta pe cetățeni să facă față unor provocări comune, creând astfel un veritabil sentiment de solidaritate și stimulând în același timp competitivitatea economiilor locale”, a declarat Corina Crețu, comisarul pentru politica regională.";
		var quotes = parser.parse(text, "ro", {
			minLength: 15,
			persons: [
				{
					index: 1179,
					id: 101,
				},
			],
		});
		// console.log(quotes);
		assert.equal(2, quotes.length);
	});

	it("EN: should filter START quotes", function () {
		var text =
			'Some text.\nTrump added: "By the way, I released my financial statements..."';
		var quotes = parser.parse(text, "en");
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("Trump", quotes[0].name.text);
	});

	it("EN: should filter END quotes", function () {
		var text = '"It\'s a hellacious problem," said Hugh Ray';
		var quotes = parser.parse(text, "en", { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("Hugh Ray", quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = '"It\'s a hellacious problem," said Hugh Ray to the...';
		quotes = parser.parse(text, "en", { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("Hugh Ray to the...", quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text = "\"I'll win states that aren't in play.\" Trump said.";
		quotes = parser.parse(text, "en");
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("Trump", quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text =
			'"Jeb fought very hard," the billionaire businessman said. "It wasn\'t his time. That\'s all."';
		quotes = parser.parse(text, "en", { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("the billionaire businessman", quotes[0].name.text);
		assert.equal(1, quotes[0].index);

		text =
			"Photo: Jason DeFillippo\n“My parents never really told me I couldn’t do anything.” – Shaun White\nThis particular episode comes from a fun event. “I believe that peace means that one person has the biggest stick. I build those sticks.” – Walter O’Brien";
		quotes = parser.parse(text, "en");
		// console.log(quotes);
		assert.equal(2, quotes.length);
		assert.equal("Shaun White", quotes[0].name.text);
		assert.equal(25, quotes[0].index);
		assert.equal("Walter O’Brien", quotes[1].name.text);
	});

	it("NBSP: should filter web page", function (done) {
		var fs = require("fs");
		var path = require("path");

		fs.readFile(
			path.join(__dirname, "data", "fhww-blog.txt"),
			function (error, text) {
				if (error) {
					return done(error);
				}
				var quotes = parser.parse(text, "en");
				assert.ok(quotes.length > 0);
				done();
			}
		);
	});

	it("EN: should parse new line quote author's name", function () {
		var text = '"It\'s a hellacious problem,"\n \t- Hugh Ray';
		var quotes = parser.parse(text, "en", { minLength: 10 });
		// console.log(quotes);
		assert.equal(1, quotes.length);
		assert.equal("Hugh Ray", quotes[0].name.text);
		assert.equal(1, quotes[0].index);
	});

	it("EN: should fail invalid new line quote author's name", function () {
		var text =
			'"It\'s a hellacious problem,"\n \t- Hugh Ray jhsgfhgsdh gsdhj gdhjsgf sdgjsdf jgdfhjs';
		var quotes = parser.parse(text, "en", { minLength: 10 });
		assert.equal(0, quotes.length);

		text = '"It\'s a hellacious problem,"\n \t- \nHugh Ray';
		quotes = parser.parse(text, "en", { minLength: 10 });
		assert.equal(0, quotes.length);
	});

	it("should work with extraRules option", function () {
		var text =
			"“I believe that everything happens for a reason...”\n \t― \nMarilyn Monroe";
		var options = {
			minLength: 10,
			extraRules: [
				{
					reg: /“([^\f\t\v“”„]{10,})”[ \t\u00A0]*[\n\r]+[ \t\u00A0]*[\u2010-\u2015-][ \t\u00A0\r\n]*([^\f\n\r\t\v,]{3,30})(?:$|[\n\r])/gi,
					quote: 0,
					name: 1,
				},
			],
		};

		var quotes = parser.parse(text, "en", options);

		assert.equal(1, quotes.length);
		assert.equal("Marilyn Monroe", quotes[0].name.text);
	});

	it("should extract Russian quotes", function () {
		var text =
			"Генри Киссинджер: «Я не сомневаюсь, что русские взламывают нас. И я надеюсь, что мы совершаем некоторые атаки там».\n";
		text +=
			"В интервью телеканалу CBS News Киссинджер заявил, что «вероятно, каждая разведывательная служба проводит хакерские атаки на территории других стран».\n";
		text +=
			"Киссинджер также сравнил российского президента Владимира Путина с героем романа Фёдора Достоевского «Преступление и наказание».\n";
		text +=
			"Генри Киссинджер: «Он холодный калькулятор национального интереса России, как он его понимает, и который, он считает, вероятно правильно, имеет несколько уникальных особенностей».\n";
		text +=
			"Он также добавил, что для Путина очень важен «вопрос идентичности России», цитирует РИА Новости.";

		var quotes = parser.parse(text, "ru");

		assert.equal(2, quotes.length);
	});

	it("ES: 1", function () {
		const text = `La secretaria general de Podemos, Ione Belarra, ya está hablando con Yolanda Díaz para presentarse juntas a las elecciones generales. El naufragio generalizado de todo el espacio progresista este 28-M y el adelanto de las elecciones generales al 23 de julio obliga a las dos líderes a la izquierda del PSOE a ponerse de acuerdo cuanto antes, aun a pesar de llevar desde septiembre sin progresar prácticamente en un pacto de coalición.

"Estamos trabajando ya para darle a la ciudadanía progresista la noticia que lleva esperando: que este espacio se presente unido y salgamos a ganar, a gobernar con más fuerza", ha declarado Belarra en una comparecencia exprés en la sede del partido. Apenas unas horas antes, la portavoz Alejandra Jacinto anticipó que "hace falta la unidad del bloque progresista con el motor de Podemos".
		
Según la Ley Electoral, los partidos y federaciones que establezcan un pacto de coalición para concurrir conjuntamente a unas elecciones "deben comunicarlo a la Junta competente en los diez días siguientes a la convocatoria". A efectos prácticos, esta convocatoria no se hará oficial hasta el martes 30 de mayo, por lo que Belarra y Díaz tienen hasta el 8 de junio para presentar su candidatura.`;

		const quotes = parser.parse(text, "es");
		assert.equal(2, quotes.length);
		assert.equal(
			`Belarra en una comparecencia exprés en la sede del`,
			quotes[0].name.text
		);
		assert.equal(` la portavoz Alejandra Jacinto`, quotes[1].name.text);
	});

	it("ES: 2", function () {
		const text = `La secretaria general de Podemos, Ione Belarra, ya está hablando con Yolanda Díaz para presentarse juntas a las elecciones generales. El naufragio generalizado de todo el espacio progresista este 28-M y el adelanto de las elecciones generales al 23 de julio obliga a las dos líderes a la izquierda del PSOE a ponerse de acuerdo cuanto antes, aun a pesar de llevar desde septiembre sin progresar prácticamente en un pacto de coalición.

"Estamos trabajando ya para darle a la ciudadanía progresista la noticia que lleva esperando: que este espacio se presente unido y salgamos a ganar, a gobernar con más fuerza" declarado Belarra en una comparecencia exprés en la sede del partido. Apenas unas horas antes, la portavoz Alejandra Jacinto anticipó "hace falta la unidad del bloque progresista con el motor de Podemos".
		
Según la Ley Electoral, los partidos y federaciones que establezcan un pacto de coalición para concurrir conjuntamente a unas elecciones "deben comunicarlo a la Junta competente en los diez días siguientes a la convocatoria". A efectos prácticos, esta convocatoria no se hará oficial hasta el martes 30 de mayo, por lo que Belarra y Díaz tienen hasta el 8 de junio para presentar su candidatura.`;

		const quotes = parser.parse(text, "es");
		assert.equal(2, quotes.length);
		assert.equal(
			`Belarra en una comparecencia exprés en la sede del`,
			quotes[0].name.text
		);
		assert.equal(` la portavoz Alejandra Jacinto`, quotes[1].name.text);
	});

	it("ES: 3", function () {
		const text = `Noche electoral dramática para el PSOE y reacción drástica y rápida de Pedro Sánchez a la mañana siguiente. El presidente del Gobierno ha decidido adelantar las elecciones generales al 23 de julio ante el riesgo de que un desgaste más largo de su Ejecutivo en los próximos meses, con una derecha envalentonada tras su rotundo éxito electoral, acabe con una mayoría absoluta rotunda del PP y Vox.

		“Asumo en primera persona los resultados y creo necesario dar una respuesta. Muchos presidentes con gestiones impecables han dejado de serlo. Todo esto aconseja una clarificación de los españoles sobre las fuerzas políticas que deben liderar esta fase. Lo mejor es que los españoles tomen la palabra para definir el rumbo político del país”, ha dicho Sánchez durante una breve comparecencia.
		
		El Consejo de Ministros extraordinario de esta tarde dará forma jurídica a la decisión, que fue comunicada por antes al jefe del Estado, Felipe VI.`;

		const quotes = parser.parse(text, "es");
		assert.equal(1, quotes.length);
		assert.equal(
			`Sánchez durante una breve comparecencia.`,
			quotes[0].name.text
		);
	});

	it("ES: 4", function () {
		const text = `Miembros de la dirección federal consultados por este periódico revelan que el presidente acusó abatimiento por la hecatombe electoral y la gravedad de la decisión de liquidar la legislatura: «Estaba afectado pero decidido a ir a por todas, de jugar la última carta hasta el final». El secretario general del PSOE no puso paños calientes sobre la debacle electoral y deslizó su impresión implícita de que la tendencia en favor del PP irá aumentando a medida que avance el tiempo. «Esto en diciembre será peor plus text», sentenció Pedro Sánchez en la sala Ramón Rubial de Ferraz. Un diagnóstico compartido por la cúpula del PSOE, donde sostienen que, de no haber anticipado las elecciones, «nos habríamos ido desangrado estos seis meses poco a poco, prolongando la agonía hasta final de año». `;

		const quotes = parser.parse(text, "es");
		assert.equal(1, quotes.length);
		assert.equal(
			`Pedro Sánchez en la sala Ramón Rubial de Ferraz. U`,
			quotes[0].name.text
		);
	});

	it("ES: 5", function () {
		const text = `Parece que en los últimos tiempos ha subido algo de talla. Incluso ella misma se lo ha reconocido al periodista Aurelio Manzano: «He engordado un poquito porque, desde que estoy con Íñigo, es verdad que a él le gusta mucho salir, cocinar, comer y vamos a muchas comidas».`;
		const quotes = parser.parse(text, "es");
		assert.equal(1, quotes.length);
		assert.equal(` al periodista Aurelio Manzano`, quotes[0].name.text);
	});

	it("ES: 6", function () {
		const text = `Así lo relataban en el programa 'Sálvame' donde Mayte Ametlla explicaba que «quiere alejarse un tiempo de su familia para ingresar en un centro especializado». Era Gema López quien precisaba que «va a estar ingresada tres semanas». Esta no es la primera vez que la marquesa de Griñón se somete a un estricto régimen de adelgazamiento. De hecho, en 2016 eligió la exclusiva Clínica Buchinger, en Marbella, para someterse a un tratamiento que le permitió perder 20 kilos después de subir de peso por problemas de tiroides.`;
		const quotes = parser.parse(text, "es");
		assert.equal(1, quotes.length);
		assert.equal(" 'Sálvame' donde Mayte Ametlla", quotes[0].name.text);
	});
});
