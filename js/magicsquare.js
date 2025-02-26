// JavaScript kodu buraya gelecek (dosyadaki mevcut JavaScript kodu)
function generateMagicSquare(job) {
	const n = parseInt(document.getElementById('rows').value);
	const r = parseInt(jQuery("#MagicSquareOutput").attr('rotated'));
	const f = jQuery("#MagicSquareOutput").attr('flipped');
	const expectedRowElement = document.getElementById('expectedRowSum');
	if (n < 3) {
		alert("Lütfen 3 veya daha büyük bir sayı girin.");
		return;
	}
	// Satır ve sütun toplamlarını kontrol et
	const MagicConstant = (n * (n * n + 1)) / 2;
	const RowSum = parseFloat(expectedRowElement.value);
	expectedRowElement.setAttribute('min', MagicConstant);
	let MagicSquare = createMagicSquare(n);
	if (RowSum > MagicConstant) {
		if (n % 2 === 1) {
			MagicSquare = incrementedMagicSquare(MagicSquare, RowSum);
		} else if (n % 4 === 0) {
			MagicSquare = incrementMatrix(MagicSquare, RowSum);
		}
	}
	if (r > 0) {
		MagicSquare = rotateMatrix(MagicSquare, (r / 90));
	}
	if (f == "true") {
		MagicSquare = mirrorFlip(MagicSquare);
	}
	if (job == "rotate" || job == "flip") {
		checkMagicSquare(MagicSquare, 0);
	} else if (job == "none") {
		let doNothing = "done";
	} else {
		checkMagicSquare(MagicSquare, 100);
	}
	if (document.getElementById('numberswitch').checked) {
		for (let r = 0; r < n; r++) {
			for (let c = 0; c < n; c++) {
				MagicSquare[r][c] = '\u200E\u200F' + ArabToIndian(MagicSquare[r][c]) + '\u200E';
			}
		}
	}
	document.getElementById('MagicSquareOutput').value = formatMagicSquare(MagicSquare);
	document.getElementById('BoxedSquareOutput').value = boxTheSquare(MagicSquare);
	document.getElementById('HtmlcSquareOutput').value = createHTML('pdfpngSquareOutput', MagicSquare);
	highlightCode(document.getElementById('HtmlcSquareOutput'), document.getElementById('highlightedOutput'));
	$("#algorithm option").click(function() {
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
}

function createMagicSquare(n) {
	let algorithm = document.getElementById('algorithm').value;
	if (algorithm == 'siamase') {
		// Tek boyutlu sihirli kare
		return siameseMethod(n);
	} else if (algorithm == 'stracheydouble') {
		// 4'ün katı olan çift boyutlu sihirli kare (Doubly Even method)
		return stracheyMethod(n);
	} else if (algorithm == 'durer') {
		// 4'ün katı olan çift boyutlu sihirli kare (Doubly Even method)
		return durerMethod(n);
	} else if (algorithm == 'sExchange') {
		// 4'ün katı olan çift boyutlu sihirli kare (Doubly Even method)
		return simpleExchangeMethod(n);
	} else if (algorithm == 'lux') {
		// 4'ün katı olmayan çift boyutlu sihirli kare (Singly Even method)
		return abdilLUXMethod(n);
	} else if (algorithm == 'stracheysingle') {
		// 4'ün katı olmayan çift boyutlu sihirli kare (Singly Even method)
		return stracheySinglyEvenMethod(n);
	}
}

function createAlgorithmSelect(n) {
	let html = `<select id="algorithm" name="algorithm" title="">\n`;
	if (n % 2 === 1) {
		html += `<option value="siamase" turkishcontent="Tek sayı boyutlu kare (Siamese)" englishcontent="Odd sized magic square (Siamese)">${pretranslate('Tek sayı boyutlu kare (Siamese)', 'Odd sized magic square (Siamese)')}</option>\n`;
	} else if (n % 4 === 0) {
		html += `<option value="stracheydouble" turkishcontent="4'ün katı olan çift boyutlu sihirli kare (Strachey)" englishcontent="Doubly even sized magic square (Scratchey)">${pretranslate('4\'ün katı olan çift boyutlu sihirli kare (Strachey)', 'Doubly even sized magic square (Scratchey)')}</option>\n`;
		html += `<option value="durer" turkishcontent="4'ün katı olan çift boyutlu sihirli kare (Durer)" englishcontent="Doubly even sized magic square (Durer)">${pretranslate('4\'ün katı olan çift boyutlu sihirli kare (Durer)', 'Doubly even sized magic square (Durer)')}</option>\n`;
		html += `<option value="sExchange" turkishcontent="4'ün katı olan çift boyutlu sihirli kare (Basit yer değiştirme)" englishcontent="Doubly even sized magic square (Simple exchange)">${pretranslate('4\'ün katı olan çift boyutlu sihirli kare (Basit yer değiştirme)', 'Doubly even sized magic square (Simple exchange)')}</option>\n`;
	} else {
		html += `<option value="stracheysingle" turkishcontent="4'ün katı olmayan çift boyutlu sihirli kare (Strachey)" englishcontent="Singly even sized magic square (Strachey)">${pretranslate('4\'ün katı olmayan çift boyutlu sihirli kare (Strachey)', 'Singly even sized magic square (Strachey)')}</option>\n`;
	}
	html += `</select>`;
	return html;
}
//Tek boyutlu sihirli kareler için algoritmalar
//1. Siamese Method (De la Loubère's Algorithm)
function siameseMethod(n) {
	let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
	let row = 0,
		col = Math.floor(n / 2);
	for (let num = 1; num <= n * n; num++) {
		magicSquare[row][col] = num;
		let nextRow = (row - 1 + n) % n;
		let nextCol = (col + 1) % n;
		if (magicSquare[nextRow][nextCol] !== 0) {
			row = (row + 1) % n;
		} else {
			row = nextRow;
			col = nextCol;
		}
	}
	return magicSquare;
}
// 4'ün katı olan çift boyutlu sihirli kare (Doubly Even method) algoritmalar
//1. Strachey Method
function stracheyMethod(n) {
	let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
	let count = 1;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			// Eğer hücre, belirli bir desene uyuyorsa, sayıyı tersten yerleştir
			if ((i % 4 === j % 4) || ((i + j) % 4 === 3)) {
				magicSquare[i][j] = (n * n) - count + 1;
			} else {
				magicSquare[i][j] = count;
			}
			count++;
		}
	}
	return magicSquare;
}
//2. Dürer's Method(Modified Strachey Method)
function durerMethod(n) {
	let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
	let count = 1;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			// 4x4'lük bloklar için özel desen
			if ((i % 4 === 0 || i % 4 === 3) && (j % 4 === 0 || j % 4 === 3)) {
				magicSquare[i][j] = count;
			} else if ((i % 4 === 1 || i % 4 === 2) && (j % 4 === 1 || j % 4 === 2)) {
				magicSquare[i][j] = count;
			} else {
				magicSquare[i][j] = (n * n) - count + 1;
			}
			count++;
		}
	}
	return magicSquare;
}
//3. Simple Exchange Method
function simpleExchangeMethod(n) {
	let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
	let count = 1;
	// Önce kareyi sırayla doldur
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			magicSquare[i][j] = count++;
		}
	}
	// Belirli desendeki sayıları ters çevir
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if ((i % 4 === j % 4) || ((i + j) % 4 === 3)) {
				magicSquare[i][j] = (n * n) - magicSquare[i][j] + 1;
			}
		}
	}
	return magicSquare;
}
// 4'ün katı olmayan çift boyutlu sihirli kare (Singly Even method) algoritmaları
//Stracheys Method
function stracheySinglyEvenMethod(n) {
	const magicSquare = Array.from({
		length: n
	}, () => Array(n).fill(0));
	const k = n / 2;
	// Create the odd-order magic square for the top-left quadrant
	const miniMagic = siameseMethod(k);
	// Satır ve sütun toplamlarını kontrol et
	const MagicConstant = (n * (n * n + 1)) / 2;
	const expectedRowElement = document.getElementById('expectedRowSum');
	const RowSum = parseFloat(expectedRowElement.value);
	if (!(RowSum <= MagicConstant || RowSum % 2 == 0)) {
		MagicSquare = incrementedMagicSquare(miniMagic, (RowSum - (3 * k * k * k)) / 2);
	}
	// Fill the four quadrants
	for (let i = 0; i < k; i++) {
		for (let j = 0; j < k; j++) {
			magicSquare[i][j] = miniMagic[i][j]; // Top-left quadrant
			magicSquare[i + k][j + k] = miniMagic[i][j] + k * k; // Bottom-right quadrant
			magicSquare[i][j + k] = miniMagic[i][j] + 2 * k * k; // Top-right quadrant
			magicSquare[i + k][j] = miniMagic[i][j] + 3 * k * k; // Bottom-left quadrant
		}
	}
	// Swap columns to fix the magic properties
	const swapCol = [];
	const swapCount = (k - 1) / 2; // Number of columns to swap
	for (let i = 0; i < swapCount; i++) {
		swapCol.push(i); // Columns to swap (0-based index)
	}
	for (let i = n - swapCount + 1; i < n; i++) {
		swapCol.push(i); // Columns to swap (0-based index)
	}
	// Perform the swaps
	for (let i = 0; i < k; i++) {
		for (let j = 0; j < swapCol.length; j++) {
			const col = swapCol[j];
			[magicSquare[i][col], magicSquare[i + k][col]] = [magicSquare[i + k][col], magicSquare[i][col]];
		}
	}
	// Swap specific cells to fix the diagonals
	const halfK = Math.floor(k / 2); // Ensure the index is an integer
	[magicSquare[halfK][0], magicSquare[halfK + k][0]] = [magicSquare[halfK + k][0], magicSquare[halfK][0]];
	[magicSquare[halfK + k][halfK], magicSquare[halfK][halfK]] = [magicSquare[halfK][halfK], magicSquare[halfK + k][halfK]];
	if (!(RowSum <= MagicConstant || RowSum % 2 != 0)) {
		MagicSquare = incrementMatrix(magicSquare, RowSum);
	}
	return magicSquare;
}

function fillQuadrant(square, startRow, startCol, size, startNum) {
	let num = startNum;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			square[startRow + i][startCol + j] = num++;
		}
	}
}
//Incremention Idea and Necessary Parameters To Calculate Incremention
function incrementedMagicSquare(MagicSquare, RowSum) {
	const n = MagicSquare.length;
	const MagicConstant = (n * (n * n + 1)) / 2;
	const incremention = (RowSum - MagicConstant) / n;
	//Cycle through cells of square
	for (let r = 0; r < n; r++) {
		for (let c = 0; c < n; c++) {
			MagicSquare[r][c] += incrementionForCell(n, RowSum, incremention, (MagicSquare[r][c]));
		}
	}
	return MagicSquare;
}
//Calculation Of Cell Incremention
function incrementionForCell(n, RowSum, incremention, cellvalue) {
	//Inspect Reason That Results Decimals Of Incremention
	if (cellvalue > (n * n) - (n * (RowSum % n))) {
		return Math.ceil(incremention);
	} else {
		return Math.floor(incremention);
	}
}
//Benim icadım olan bir algoritmacık
function incrementMatrix(MagicSquare, RowSum) {
	//Incremention Idea and Necessary Parameters To Calculate Incremention
	const n = MagicSquare.length;
	const MagicConstant = n * (n * n + 1) / 2;
	const z = (RowSum - MagicConstant) % n;
	const incremention = (RowSum - MagicConstant - z) / n;
	// Generate the selections and increment values
	for (let k = 0; k < z; k++) {
		for (let i = 0; i < n; i++) {
			const row = (k + i) % n;
			const col = i;
			MagicSquare[row][col]++;
		}
	}
	//Cycle through cells of square
	for (let r = 0; r < n; r++) {
		for (let c = 0; c < n; c++) {
			MagicSquare[r][c] += incremention;
		}
	}
	return MagicSquare;
}

function mirrorTheSquare() {
	let flipped = jQuery("#MagicSquareOutput").attr('flipped');
	if (flipped == "true") {
		$("#MagicSquareOutput")[0].setAttribute('flipped', "false");
		$("button[onclick='mirrorTheSquare()']").css('transform', 'none');
	} else {
		$("#MagicSquareOutput")[0].setAttribute('flipped', "true");
		$("button[onclick='mirrorTheSquare()']").css('transform', 'rotate(180deg) scaleY(-1)');
		$("button[onclick='mirrorTheSquare()']").css('transform', 'rotate(180deg) scaleX(-1)');
	}
	generateMagicSquare("flip");
}

function mirrorFlip(magicSquare) {
	const N = magicSquare.length; // Matrisin boyutunu al
	let mirrorFlip = new Array(N).fill(0).map(() => new Array(N).fill(0)); // Yeni matris oluştur
	// Ayna çevrimi uygula
	for (let a = 0; a < N; a++) {
		for (let b = 0; b < N; b++) {
			let m = N - 1 - a; // Satır indeksini ters çevir
			let n = N - 1 - b; // Sütun indeksini ters çevir
			mirrorFlip[a][b] = magicSquare[m][n]; // Yeni matrise değeri ata
		}
	}
	return mirrorFlip;
}

function rotateTheSquare() {
	let previousrotation = parseFloat(jQuery("#MagicSquareOutput").attr('rotated'));
	let rotatelabel = "";
	let degrees = previousrotation;
	if (previousrotation == 270) {
		degrees = 0;
	} else {
		degrees += 90;
	}
	$("#MagicSquareOutput")[0].setAttribute('rotated', degrees);
    if (getLanguage() === "turkish") {
        rotatelabel = degrees + "°Döndür";
    } else {
        rotatelabel = "Rotate" + degrees + "°";
    }
	$("button[onclick='rotateTheSquare()']").html(rotatelabel);
	generateMagicSquare("rotate");
}

function rotateMatrix(matrix, repeat) {
	let n = matrix.length;
	let rotated = new Array(n).fill(0).map(() => new Array(n).fill(0));
	for (let times = 0; times < repeat; times++) {
		for (let i = 0; i < n / 2; i++) {
			for (let j = i; j < n - i - 1; j++) {
				let temp = matrix[i][j];
				matrix[i][j] = matrix[j][n - i - 1];
				matrix[j][n - i - 1] = matrix[n - i - 1][n - j - 1];
				matrix[n - i - 1][n - j - 1] = matrix[n - j - 1][i];
				matrix[n - j - 1][i] = temp;
			}
		}
		rotated = matrix;
		matrix = rotated;
	}
	return rotated;
}

function boxTheSquare(MagicSquare) {
	const box = ["─│┌┐└┘├┼┤┬┴", "┄┆┌┐└┘├┼┤┬┴", "┅┇┏┓┗┛┣╋┫┳┻", "─│╭╮╰╯├┼┤┬┴", "━┃┏┓┗┛┣╋┫┳┻", "═║╔╗╚╝╠╬╣╦╩"];
	$("#cellheight")[0].setAttribute('min', "1");
	const xob = [parseFloat(document.getElementById('borders').value),
		parseFloat(document.getElementById('cellheight').value),
		parseFloat(document.getElementById('cellwidth').value)
	];
	const n = MagicSquare.length;
	let boxed = "";
	// Find Out Minimum Cell Width
	let longestlength = 0;
	let lengthofcell = 0;
	let lengthfornum = 0;
	let borderlength = 0;
	if (document.getElementById('numberswitch').checked) {
		longestlength += 3;
	}
	for (let r = 0; r < n; r++) {
		for (let c = 0; c < n; c++) {
			lengthofcell = String(MagicSquare[r][c]).length;
			if (lengthofcell > longestlength) {
				longestlength = lengthofcell;
			}
		}
	}
	if (document.getElementById('numberswitch').checked) {
		$("#cellwidth")[0].setAttribute('min', String(longestlength - 3));
		if (xob[2] + 3 > longestlength) {
			longestlength = xob[2] + 3;
		}
		borderlength = longestlength - 3;
		lengthfornum = longestlength;
	} else {
		$("#cellwidth")[0].setAttribute('min', String(longestlength));
		if (xob[2] > longestlength) {
			longestlength = xob[2];
		}
		borderlength = longestlength;
		lengthfornum = longestlength;
	}
	// Lines Of The Square
	let centering = true;
	let bottomborder = false;
	for (let r = 0; r < n; r++) {
		// Top Border Of The Box
		if (r == 0) {
			boxed += box[xob[0]][2];
			for (let t = 0; t < n - 1; t++) {
				for (let x = 0; x < borderlength; x++) {
					boxed += box[xob[0]][0];
				}
				boxed += box[xob[0]][9];
			}
			for (let x = 0; x < borderlength; x++) {
				boxed += box[xob[0]][0];
			}
			boxed += box[xob[0]][3] + "\n";
		}
		// Adjust Cell Heights
		for (let e = 0; e < Math.floor((xob[1] - 1) / 2); e++) {
			boxed += box[xob[0]][1];
			for (let c = 0; c < n; c++) {
				for (let spacestoadd = 0; spacestoadd < borderlength; spacestoadd++) {
					boxed += " ";
				}
				boxed += box[xob[0]][1];
			}
			boxed += "\n";
		}
		// Cells Of Rows
		boxed += box[xob[0]][1];
		for (let c = 0; c < n; c++) {
			let cellvalue = String(MagicSquare[r][c]);
			if (cellvalue.length < lengthfornum) {
				for (let spacestoadd = 0; spacestoadd < (lengthfornum - String(MagicSquare[r][c]).length); spacestoadd++) {
					if (centering) {
						cellvalue = cellvalue + " ";
						centering = false;
					} else {
						cellvalue = " " + cellvalue;
						centering = true;
					}
				}
			}
			centering = true;
			boxed += cellvalue;
			boxed += box[xob[0]][1];
		}
		boxed += "\n";
		// Adjust Cell Heights
		for (let e = 0; e < ((xob[1] - 1) - Math.floor((xob[1] - 1) / 2)); e++) {
			boxed += box[xob[0]][1];
			for (let c = 0; c < n; c++) {
				for (let spacestoadd = 0; spacestoadd < borderlength; spacestoadd++) {
					boxed += " ";
				}
				boxed += box[xob[0]][1];
			}
			boxed += "\n";
		}
		// Row Borders
		if (r >= 0) {
			bottomborder = false;
			if (r < n - 1) {
				bottomborder = false;
				boxed += box[xob[0]][6];
				for (let t = 0; t < n - 1; t++) {
					for (let x = 0; x < borderlength; x++) {
						boxed += box[xob[0]][0];
					}
					boxed += box[xob[0]][7];
				}
				for (let x = 0; x < borderlength; x++) {
					boxed += box[xob[0]][0];
				}
				boxed += box[xob[0]][8] + "\n";
			} else {
				bottomborder = true;
			}
		}
		// Bottom Border
		if (bottomborder) {
			boxed += box[xob[0]][4];
			for (let t = 0; t < n - 1; t++) {
				for (let x = 0; x < borderlength; x++) {
					boxed += box[xob[0]][0];
				}
				boxed += box[xob[0]][10];
			}
			for (let x = 0; x < borderlength; x++) {
				boxed += box[xob[0]][0];
			}
			boxed += box[xob[0]][5] + "\n";
		}
	}
	return boxed;
}

function createHTML(HtmlHolder, MagicSquare) {
	const n = MagicSquare.length;
	const MagicConstant = (n * (n * n + 1)) / 2;
	const expectedRowElement = document.getElementById('expectedRowSum');
	const holder = document.createElement('div');
	holder.setAttribute('id', 'htmlholder');
	// Create the root <html> element
	const html = document.createElement('html');
	html.setAttribute('lang', 'en');
	// Create the <head> element
	const head = document.createElement('head');
	const metaCharset = document.createElement('meta');
	metaCharset.setAttribute('charset', 'UTF-8');
	const metaViewport = document.createElement('meta');
	metaViewport.setAttribute('name', 'viewport');
	metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
	const title = document.createElement('title');
	let titletext = "";
	if (getLanguage() == "turkish") {
		if (document.getElementById('numberswitch').checked) {
			titletext += `Hint rakamlarıyla `;
		} else {
			titletext += `Arap rakamlarıyla `;
		}
	} else {
		if (document.getElementById('numberswitch').checked) {
			titletext += `Using Indian Numbers`;
		} else {
			titletext += `Using Arabic Numbers`;
		}
	}
	if (getLanguage() == "turkish") {
		titletext += `${n}x${n} Sihirli Kare`;
	} else {
		titletext = `${n}x${n} Magic Square ` + titletext;
	}
	title.textContent = titletext;
	const style = document.createElement('style');
	style.textContent = generateTableStyles();
	const script = document.createElement('script');
    script.textContent = `function equalizeCells() {
		const cells = document.querySelectorAll('.magic-square-table td');
		let maxWidthCell = 0;
		let maxHeightCell = 0;

		cells.forEach(cell => {
			const span = cell.querySelector('span');
			if (span) {
				span.style.display = 'table-cell';
				span.style.whiteSpace = 'nowrap';
			}
		});

		document.body.offsetHeight;

		cells.forEach(cell => {
			const span = cell.querySelector('span');
			if (span) {
				maxWidthCell = Math.max(maxWidthCell, span.offsetWidth);
				maxHeightCell = Math.max(maxHeightCell, span.offsetHeight);
			}
		});

		const style = document.createElement('style');
		style.textContent = \`
		.magic-square-table td {
			aspect-ratio: 1 / 1;
			width: max-content !important;
			height: max-content !important;
		}
		.magic-square-table td span {
			aspect-ratio: 1 / 1;
			width: \${maxWidthCell}px !important;
			height: \${maxHeightCell}px !important;
		}\`;
		document.head.appendChild(style);
	}

	document.addEventListener('DOMContentLoaded', function() {
		document.getElementsByClassName('magic-square-table')[0]
			.addEventListener('load', function() {
			equalizeCells();
		});
	});`;
	document.body.appendChild(script);
	// Append elements to <head>
	head.appendChild(metaCharset);
	head.appendChild(metaViewport);
	head.appendChild(title);
	head.appendChild(style);
	head.appendChild(script);
	// Create the <body> element
	const body = document.createElement('body');
	body.style.backgroundColor = "white";
	const header = document.createElement('header');
	const h1 = document.createElement('h1');
	h1.textContent = titletext;
	const main = document.createElement('main');
	const p = document.createElement('p');
	let firstparagraph = "";
	if (getLanguage() == "turkish") {
		firstparagraph += `Satır toplamları ve sütun toplamları ${expectedRowElement.value} sayısına eşittir.`;
	} else {
		firstparagraph += `Row sums and column sums are all equal to ${expectedRowElement.value}`;
	}
	p.textContent = firstparagraph;
	const squarecontainer = document.createElement('div');
	squarecontainer.setAttribute('id', 'themagicsquare');
	const footer = document.createElement('footer');
	const pFooter = document.createElement('p');
	pFooter.textContent = '2025 © https://metatronslove.github.io/magic-square-generator';
	// Append elements to <body>
	header.appendChild(h1);
	main.appendChild(p);
	main.appendChild(squarecontainer);
	footer.appendChild(pFooter);
	body.appendChild(header);
	body.appendChild(main);
	body.appendChild(footer);
	// Append <head> and <body> to <html>
	html.appendChild(head);
	html.appendChild(body);
	// Append the <html> element to the document
	holder.appendChild(html);
	const htmlcontainer = document.getElementById(HtmlHolder);
	htmlcontainer.innerHTML = "";
	htmlcontainer.appendChild(holder);
	renderMagicSquareToTable(MagicSquare, 'themagicsquare');
	return formatHTML(holder.innerHTML);
}

function renderMagicSquareToTable(magicSquare, containerId) {
	// Get the container element where the table will be inserted
	const container = document.getElementById(containerId);
	if (!container) {
		console.error(`Container with ID "${containerId}" not found.`);
		return;
	}
	// Create the table element
	const table = document.createElement('table');
	table.classList.add('magic-square-table'); // Add a class for styling
	// Loop through the 2D array to create table rows and cells
	magicSquare.forEach((row, rowIndex) => {
		const tr = document.createElement('tr'); // Create a table row
		row.forEach((cellValue, colIndex) => {
			const td = document.createElement('td'); // Create a table cell
			const span = document.createElement('span');
			td.appendChild(span);
			span.textContent = cellValue; // Set the cell's text content
			// Add a class to the cell based on its position (optional)
			td.classList.add(`row-${oddOrEven(rowIndex)}`, `col-${oddOrEven(colIndex)}`);
			// Add a data attribute for the cell's value (optional)
			td.setAttribute('data-value', cellValue);
			tr.appendChild(td); // Append the cell to the row
		});
		table.appendChild(tr); // Append the row to the table
	});
	// Append the table to the container
	container.appendChild(table);

	function oddOrEven(number) {
		if (number % 2 == 0) {
			return "even";
		} else if (number % 2 == 1 || number == 1) {
			return "odd";
		}
	}
}

function generateTableStyles() {
	// Get user inputs
	const borderColor = document.getElementById('borderColor').value;
	const startDirection = document.querySelector('input[name="rotationStart"]:checked').value;
	// Determine rotation degrees
	const baseRotate = startDirection === 'left' ? '-45deg' : '45deg';
	const oppositeRotate = startDirection === 'left' ? '45deg' : '-45deg';
	let css = "";
	if (startDirection != 'none') {
		// Generate CSS
		css = `table.magic-square-table {
            border-collapse: collapse;
            table-layout: fixed; /* Ensures consistent cell sizing */
            width: max-content;
        }

        table.magic-square-table, table.magic-square-table td {
			font-size: 1em;
			font-family: Arial;
			font-weight: bold;
            color: ${borderColor};
            border: 3px solid ${borderColor};
        }

        .magic-square-table td {
            padding: 8px;
            text-align: center;
            vertical-align: middle;
			box-sizing: border-box;
        }

        .magic-square-table td > span {
			display: table-cell;
            text-align: center;
            vertical-align: middle;
			white-space: nowrap;
        }

        /* Rotation rules for cells and spans */
        .row-even.col-even > span {
            transform: rotate(${oppositeRotate});
        }

        .row-even.col-odd > span {
            transform: rotate(${baseRotate});
        }

        .row-odd.col-even > span {
            transform: rotate(${baseRotate});
        }

        .row-odd.col-odd > span {
            transform: rotate(${oppositeRotate});
        }`;
	} else {
		// Alternate CSS
		css = `table.magic-square-table {
            border-collapse: collapse;
            table-layout: fixed; /* Ensures consistent cell sizing */
            width: max-content;
        }

        table.magic-square-table, table.magic-square-table td {
            color: ${borderColor};
            border: 4px solid ${borderColor};
        }

        .magic-square-table td {
            width: max-content;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
        }

        .magic-square-table td > span {
            display: table-cell; /* Required for transforms */
            width: max-content;
            text-align: center;
            vertical-align: middle;
        }`;
	}
	return css;
}

function applyStyles() {
	const styleElement = document.getElementById('generatedStyles');
	const newStyles = generateTableStyles();
	if (styleElement) {
		styleElement.remove();
	}
	document.head.insertAdjacentHTML('beforeend', newStyles);
}

function highlightCode(input, output) {
	const code = input.value;
	// Simple syntax highlighting (example for HTML)
	const highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"(.*?)"/g, '<span class="string">"$1"</span>').replace(/&lt;(\w+)(.*?)&gt;/g, '<span class="tag">&lt;$1$2&gt;</span>').replace(/&lt;\/(\w+)&gt;/g, '<span class="tag">&lt;/$1&gt;</span>');
	output.innerHTML = highlighted;
}

function formatHTML(html) {
	const tab = '    '; // 4 spaces for indentation (can be changed to '\t' for tabs)
	let result = '';
	let indentLevel = 0; // Tracks the current indentation level
	// Split the HTML into an array of tags and text
	html.split(/(<[^>]+>)/).forEach((element) => {
		if (!element.trim()) {
			// Skip empty strings (e.g., whitespace between tags)
			return;
		}
		if (element.startsWith('</')) {
			// Closing tag: decrease indentation
			indentLevel--;
			result += tab.repeat(indentLevel) + element + '\n';
		} else if (element.startsWith('<') && !element.startsWith('<!')) {
			// Opening tag or self-closing tag
			if (element.endsWith('/>') || isSelfClosingTag(element)) {
				// Self-closing tag: keep the same indentation
				result += tab.repeat(indentLevel) + element + '\n';
			} else {
				// Opening tag: increase indentation
				result += tab.repeat(indentLevel) + element + '\n';
				indentLevel++;
			}
		} else if (element.startsWith('<!')) {
			// Handle <!DOCTYPE> or comments
			result += tab.repeat(indentLevel) + element + '\n';
		} else {
			// Text content: keep the same indentation
			result += tab.repeat(indentLevel) + element + '\n';
		}
	});
	return result.trim(); // Remove extra newlines at the end
}
// Helper function to check if a tag is self-closing
function isSelfClosingTag(tag) {
	const selfClosingTags = ['meta', 'img', 'br', 'hr', 'input', 'link', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];
	const tagName = tag.match(/<([^\s/>]+)/)?.[1]; // Extract tag name
	return tagName && selfClosingTags.includes(tagName.toLowerCase());
}

function formatMagicSquare(MagicSquare) {
	return MagicSquare.map(row => row.join('\t')).join('\n');
}

function checkMagicSquare(MagicSquare, delay) {
	const n = MagicSquare.length;
	const expectedRowSum = document.getElementById('expectedRowSum').value;
	const MagicConstant = (n * (n * n + 1)) / 2; // Sihirli sabit
	const checkresults = document.getElementById('checksquare');
	let successpuan = 0;
	let hideandseek = 0;
	let checkresult = [];
	let shouttohtml = `<span class="hideandseek${incrementhidenseek(hideandseek, 0)} checkresults${wrongresult(expectedRowSum)}"
	 turkishcontent="Sihirli Sabit: " englishcontent="Magic Constant: ">${pretranslate('Sihirli Sabit: ', 'Magic Constant: ')}</span>
	<span class="hideandseek${incrementhidenseek(hideandseek, 1)} checkresults${wrongresult(expectedRowSum)}">${MagicConstant}</span>
	<span class="hideandseek${incrementhidenseek(hideandseek, 2)} checkresults">, </span>`;
	console.log("Sihirli Sabit (Her satır/sütun/çapraz toplamı):", MagicConstant);
	checkresult.push(".hideandseek" + hideandseek, ".hideandseek" + (hideandseek + 1), ".hideandseek" + (hideandseek + 2));
	hideandseek += 3;
	// Satır toplamlarını kontrol et
	for (let i = 0; i < n; i++) {
		const RowSum = MagicSquare[i].reduce((acc, val) => acc + val, 0);
		shouttohtml += `<span class="hideandseek${incrementhidenseek(hideandseek, 0)} checkresults${wrongresult(RowSum)}"
		 turkishcontent="Satır " englishcontent="Row ">${pretranslate('Satır ', 'Row ')}</span>
		<span class="hideandseek${incrementhidenseek(hideandseek, 1)} checkresults${wrongresult(RowSum)}">${i + 1}: ${RowSum}</span>
		<span class="hideandseek${incrementhidenseek(hideandseek, 2)} checkresults">, </span>`;
		console.log(`Satır ${i + 1} Toplamı:`, RowSum);
		checkresult.push(".hideandseek" + hideandseek, ".hideandseek" + (hideandseek + 1), ".hideandseek" + (hideandseek + 2));
		successpuan += ifSumMatched(RowSum, expectedRowSum);
		hideandseek += 3;
	}
	// Sütun toplamlarını kontrol et
	for (let j = 0; j < n; j++) {
		let colSum = 0;
		for (let i = 0; i < n; i++) {
			colSum += MagicSquare[i][j];
		}
		shouttohtml += `<span class="hideandseek${incrementhidenseek(hideandseek, 0)} checkresults${wrongresult(colSum)}"
		 turkishcontent="Sütun " englishcontent="Column ">${pretranslate('Sütun ', 'Column ')}</span>
		<span class="hideandseek${incrementhidenseek(hideandseek, 1)} checkresults${wrongresult(colSum)}">${j + 1}: ${colSum}</span>
		<span class="hideandseek${incrementhidenseek(hideandseek, 2)} checkresults">, </span>`;
		console.log(`Sütun ${j + 1} Toplamı:`, colSum);
		checkresult.push(".hideandseek" + hideandseek, ".hideandseek" + (hideandseek + 1), ".hideandseek" + (hideandseek + 2));
		successpuan += ifSumMatched(colSum, expectedRowSum);
		hideandseek += 3;
	}
	// Çapraz toplamlarını kontrol et
	let diag1Sum = 0,
		diag2Sum = 0;
	for (let i = 0; i < n; i++) {
		diag1Sum += MagicSquare[i][i];
		diag2Sum += MagicSquare[i][n - 1 - i];
	}
	shouttohtml += `<span class="hideandseek${incrementhidenseek(hideandseek, 0)} checkresults${wrongresult(diag1Sum)}"
	 turkishcontent="Ana Çapraz: " englishcontent="Main Diagonal: ">${pretranslate('Ana Çapraz: ', 'Main Diagonal: ')}</span>
	<span class="hideandseek${incrementhidenseek(hideandseek, 1)} checkresults${wrongresult(diag1Sum)}">${diag1Sum}</span>
	<span class="hideandseek${incrementhidenseek(hideandseek, 2)} checkresults">, </span>`;
	checkresult.push(".hideandseek" + hideandseek, ".hideandseek" + (hideandseek + 1), ".hideandseek" + (hideandseek + 2));
	hideandseek += 3;
	shouttohtml += `<span class="hideandseek${incrementhidenseek(hideandseek, 0)} checkresults${wrongresult(diag2Sum)}"
	 turkishcontent="Yan Çapraz: " englishcontent="Side Diagonal: ">${pretranslate('Yan Çapraz: ', 'Side Diagonal: ')}</span>
	<span class="hideandseek${incrementhidenseek(hideandseek, 1)} checkresults${wrongresult(diag2Sum)}">${diag2Sum}</span>`;
	checkresult.push(".hideandseek" + hideandseek, ".hideandseek" + (hideandseek + 1));
	hideandseek += 3;
	console.log("Ana Çapraz Toplamı:", diag1Sum);
	console.log("Yan Çapraz Toplamı:", diag2Sum);
	checkresults.innerHTML = shouttohtml;
	HideAndSeek([], checkresult, delay);
	//Olur da sihirli kare inkrementasyon veya dökümde toplamı sağlamazsa kayıt özelliklerini kapat
	if (successpuan < (2 * n)) {
		$("button[onclick='copyToClipboard()']")[0].setAttribute('disabled', "disabled");
		$("button[onclick='saveToLocalDisk()']")[0].setAttribute('disabled', "disabled");
		$("button[onclick='rotateTheSquare()']")[0].setAttribute('disabled', "disabled");
		$("button[onclick='mirrorTheSquare()']")[0].setAttribute('disabled', "disabled");
		$("input[id='numberswitch']")[0].setAttribute('disabled', "disabled");
	} else {
		$("button[onclick='copyToClipboard()']").removeAttr('disabled');
		$("button[onclick='saveToLocalDisk()']").removeAttr('disabled');
		$("button[onclick='rotateTheSquare()']").removeAttr('disabled');
		$("button[onclick='mirrorTheSquare()']").removeAttr('disabled');
		$("input[name='numberswitch']").removeAttr('disabled');
	}

	function ifSumMatched(Sum, expectedRowSum) {
		if (Sum == expectedRowSum) {
			return 1;
		} else {
			return 0;
		}
	}

	function incrementhidenseek(hideandseek, incremention) {
		return hideandseek + incremention;
	}

	function wrongresult(Sum) {
		const expectedRowSum = document.getElementById('expectedRowSum');
		if (expectedRowSum.value != Sum) {
			return " resultiswrong";
		} else {
			return "";
		}
	}
}

function saveAsPdf(filename) {
	const element = document.getElementById('pdfpngSquareOutput');
	const documentSize = document.getElementById('paper-sizes').value;
	let paperwidth = 0;
	let paperheight = 0;
	let paperorient = '';
	let paperformat = '';
	let	paperunit = "mm";
	if (documentSize == 'A5P') {
		paperwidth = 148;
		paperheight = 210;
		paperorient = 'portrait';
		paperformat = 'a5'
	} else if (documentSize == 'A4P') {
		paperwidth = 210;
		paperheight = 297;
		paperorient = 'portrait';
		paperformat = 'a4'
	} else if (documentSize == 'A3P') {
		paperwidth = 297;
		paperheight = 420;
		paperorient = 'portrait';
		paperformat = 'a3'
	} else if (documentSize == 'A5L') {
		paperwidth = 210;
		paperheight = 148;
		paperorient = 'landscape';
		paperformat = 'a5'
	} else if (documentSize == 'A4L') {
		paperwidth = 297;
		paperheight = 210;
		paperformat = 'a4'
		paperorient = 'landscape';
	} else if (documentSize == 'A3L') {
		paperwidth = 420;
		paperheight = 297;
		paperorient = 'landscape';
		paperformat = 'a3'
	} else {
		paperwidth = ($('#pdfpngSquareOutput').width() / 3.779527559) - 15;
		paperheight = ($('#pdfpngSquareOutput').height() / 3.779527559) - 15;
		paperorient = 'portrait';
		paperunit = "mm";
	}
	html2canvas(element, {
			scale: 2,
			logging: true,
			useCORS: true,
			}).then(canvas => {
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jspdf.jsPDF({
			orientation: paperorient,
			unit: paperunit,
			format: paperformat
			});
		const imgWidth = paperwidth;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
		pdf.save(filename + '.pdf');
	});
}

function saveAsPng(filename) {
	const element = document.getElementById('pdfpngSquareOutput');
	html2canvas(element).then(canvas => {
		const link = document.createElement('a');
		link.download = filename + '.png';
		link.href = canvas.toDataURL('image/png');
		link.click();
	});
}

function saveToLocalDisk() {
	let omode = parseInt($("#MagicSquareOutput").attr('omode'));
	let text = "";
	if (omode == 0) {
		text = document.getElementById("MagicSquareOutput").value;
	} else if (omode == 1) {
		text = document.getElementById("BoxedSquareOutput").value;
	} else if (omode == 2) {
		text = document.getElementById("HtmlcSquareOutput").value;
	}
	let filename = "";
	let dateofsave = new window.Date();
	let n = parseInt(document.getElementById('rows').value);
	let expectedRowSum = document.getElementById('expectedRowSum');
	let lengthofsize = String(n).length;
	let lengthofRsum = String(expectedRowSum.value).length;
	let day = ("0" + dateofsave.getDate()).toString().slice(-2);
	let month = ("0" + (dateofsave.getMonth() + 1)).toString().slice(-2);
	let enlarger = "";
	let enlargement = 21;
	enlargement -= 2 * lengthofsize;
	enlargement -= lengthofRsum;
	for (let enlarge = 0; enlarge < enlargement; enlarge++) {
		enlarger += "♡";
	}
	if (getLanguage() == "turkish") {
		filename = `[${n}x${n}-Sihirli-Kare-${expectedRowSum.value}] [${enlarger}] [${day}-${month}-${dateofsave.getFullYear()}]`;
	} else {
		filename = `[${n}x${n}-Magic-Square-${expectedRowSum.value}] [${enlarger}] [${day}-${month}-${dateofsave.getFullYear()}]`;
	}
	if (omode < 3) {
		if (omode < 2) {
			filename += `.txt`;
			text += `\n\n\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`
			text += `┃`;
			text += filename;
			text += `  ┃\n`;
			text += `┃https://metatronslove.github.io/magic-square-generator      ┃    🇹🇷\n`;
			text += `┃https://github.com/metatronslove                            ┃\n`;
			text += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
		} else if (omode == 2) {
			filename += `.htm`;
		}
		text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
		let blob = new Blob([text], {
			type: "text/plain"
		});
		let anchor = document.createElement("a");
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.target = "_blank";
		anchor.style.display = "none"; // just to be safe!
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	} else if (omode == 3) {
		saveAsPdf(filename);
	} else if (omode == 4) {
		saveAsPng(filename);
	}
}

function copyToClipboard() {
	const omode = parseInt($("#MagicSquareOutput").attr('omode'));
	let copySource = "";
	if (omode == 0) {
		copySource = "MagicSquareOutput";
		copyMesgTr = "Sihirli kare panoya kopyalandı!";
		copyMesgEn = "Magic Square is copied to clipboard!";
	} else if (omode == 1) {
		copySource = "BoxedSquareOutput";
		copyMesgTr = "Metin biçemi tablosu panoya kopyalandı!";
		copyMesgEn = "Table in text form is copied to clipboard!";
	} else if (omode == 2) {
		copySource = "HtmlcSquareOutput";
		copyMesgTr = "Html kodu panoya kopyalandı!";
		copyMesgEn = "Html code is copied to clipboard!";
	}
	const textarea = document.getElementById(copySource);
	textarea.select();
	document.execCommand('copy');
	if (getLanguage() == "turkish") {
		alert(copyMesgTr);
	} else {
		alert(copyMesgEn);
	}
}

function HideAndSeek(tohide, toshow, duration, delay) {
	let ti = new Date().getTime();
	let delayer = setInterval(function() {
		let me = new Date().getTime();
		if ((me - ti) > delay) {
			clearInterval(delayer)
		}
	}, delay);
	let h = 0;
	let hide = setInterval(function() {
		if (h < tohide.length) {
			jQuery(tohide[h].toString()).hide(duration / 3 * tohide.length)
		} else {
			clearInterval(hide)
		}
		h += 1
	}, duration / tohide.length);
	let s = 0;
	let show = setInterval(function() {
		if (s < toshow.length) {
			jQuery(toshow[s].toString()).show(3 * duration / toshow.length)
		} else {
			clearInterval(show)
		}
		s += 1
	}, duration / toshow.length)
}

function IndianToArab(number) {
	return String(number).replace(/٠/g, '0').replace(/١/g, '1').replace(/٢/g, '2').replace(/٣/g, '3').replace(/٤/g, '4').replace(/٥/g, '5').replace(/٦/g, '6').replace(/٧/g, '7').replace(/٨/g, '8').replace(/٩/g, '9');
}

function ArabToIndian(number) {
	return String(number).replace(/0/g, '٠').replace(/1/g, '١').replace(/2/g, '٢').replace(/3/g, '٣').replace(/4/g, '٤').replace(/5/g, '٥').replace(/6/g, '٦').replace(/7/g, '٧').replace(/8/g, '٨').replace(/9/g, '٩');
}

function getLanguage() {
	var spelllanguageelem = document.getElementById("language");
	var languagevalue = spelllanguageelem.value;
	if (spelllanguageelem !== null || languagevalue !== undefined) {
		return languagevalue
	} else {
		return "turkish"
	}
}

function pretranslate(turkish, english) {
	if (getLanguage() == "turkish") {
		return turkish
	} else if (getLanguage() == "english") {
		return english
	}
}

function translateto(language) {
	let translatables = document.querySelectorAll('#magicsquare *');
	window.activelanguage = language;
	for (let i = 0; i < translatables.length; i += 1) {
		if (translatables[i].getAttribute(language + 'content')) {
			var translation = translatables[i].getAttribute(language + 'content');
			translatables[i].innerHTML = translation
		}
	}
	var posttitle = "";
	if (language == "turkish") {
		$('#lockpressed').attr('title', 'Basılı tut');
		//posttitle = "Sihirli Kare Oluşturucu";
		//replytitle = 'Bir Yorum Ekleyin <small><a rel="nofollow" id="cancel-comment-reply-link" href="' + '/spell-count-checker#respond" style="display:none;">Yanıtı iptal et</a></sma' + 'll>';
		//emailnotes = "E-posta adresiniz yayınlanmayacak.";
		//requirednote = 'Gerekli alanlar işaretlenmiştir <span class="required">*</span>';
		//comment = "Yorum";
		//author = "İsim*";
		//email = "Eposta*";
		//url = "İnternet Sitesi";
		//cookieconsent = "Sonraki yorumlarım için ismimi, epostamı ve internet site adresimi bu tarayıcıda" + " kaydet.";
		//sendbutton = "Gönder"
	}
	if (language == "english") {
		$('#lockpressed').attr('title', 'Keep pushed');
		//posttitle = "Letter Counter Tool";
		//replytitle = 'Leave a Reply<small><a rel="nofollow" id="cancel-comment-reply-link" href="/spel' + 'l-count-checker#respond" style="display:none;">Cancel reply</a></small>';
		//emailnotes = "Your email address will not be published.";
		//requirednote = 'Required fields are marked <span class="required">*</span>';
		//comment = "Comment";
		//author = "Name*";
		//email = "Email*";
		//url = "Website";
		//cookieconsent = "Save my name, email, and website in this browser for the next time I comment.";
		//sendbutton = "Post Comment"
	}
	//$('h1.post-title').html(posttitle);
	//$('div#reply-title').html(replytitle);
	//$('span#email-notes').html(emailnotes);
	//$('span.required-field-message').html(requirednote);
	//$('label[for="comment"]').html(comment);
	//$('label[for="author"]').html(author);
	//$('label[for="email"]').html(email);
	//$('label[for="url"]').html(url);
	//$('label[for="wp-comment-cookies-consent"]').html(cookieconsent);
	//$('input#submit')[0].setAttribute('value', sendbutton);
}
$(document).ready(function() {
	$('#algorithms').html(createAlgorithmSelect(parseInt(document.getElementById('rows').value)));
	translateto("turkish");
	$("button[onclick='generateMagicSquare()']")[0].setAttribute('disabled', "disabled");
	if (!document.getElementById('lockcreator').checked) {
		$("input[id='lockcreator']").click();
	}
	generateMagicSquare();
	$("select[name='language']").change(function() {
		translateto(jQuery(this).val());
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
	$("input[id='rows']").change(function() {
		const n = parseInt(document.getElementById('rows').value)
		const MagicConstant = (n * (n * n + 1)) / 2;
		const expectedRowElement = document.getElementById('expectedRowSum');
		const RowSum = parseFloat(expectedRowElement.value);
		$('#algorithms').html(createAlgorithmSelect(n));
		if (RowSum <= MagicConstant) {
			expectedRowElement.value = MagicConstant;
		}
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
	$("input[id='expectedRowSum']").change(function() {
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
	$("#algorithm").change(function() {
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
	$("#algorithm option").click(function() {
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare();
		}
	});
	$("input[id='numberswitch']").change(function() {
		if (document.getElementById('lockcreator').checked) {
			generateMagicSquare('none');
		}
	});
	$("input[id='cellheight']").change(function() {
		generateMagicSquare('none');
	});
	$("input[id='cellwidth']").change(function() {
		generateMagicSquare('none');
	});
	$("#borders option").click(function() {
		generateMagicSquare('none');
	});
	$("input[name='rotationStart']").click(function() {
		generateMagicSquare('none');
	});
	$("input[id='borderColor']").change(function() {
		generateMagicSquare('none');
	});
	$("input[id='lockcreator']").change(function() {
		if (document.getElementById('lockcreator').checked) {
			$("button[onclick='generateMagicSquare()']")[0].setAttribute('disabled', "disabled");
			generateMagicSquare();
		} else {
			$("button[onclick='generateMagicSquare()']").removeAttr('disabled');
		}
	});
	$("#paper-sizes option").click(function() {
		const documentSize = document.getElementById('paper-sizes').value;
		if (documentSize == 'A5P') {
			$("#pdfpngSquareOutput").css('width', '148mm');
			$("#pdfpngSquareOutput").css('height', '210mm');
		} else if (documentSize == 'A4P') {
			$("#pdfpngSquareOutput").css('width', '210mm');
			$("#pdfpngSquareOutput").css('height', '297mm');
		} else if (documentSize == 'A3P') {
			$("#pdfpngSquareOutput").css('width', '297mm');
			$("#pdfpngSquareOutput").css('height', '420mm');
		} else if (documentSize == 'A5L') {
			$("#pdfpngSquareOutput").css('width', '210mm');
			$("#pdfpngSquareOutput").css('height', '148mm');
		} else if (documentSize == 'A4L') {
			$("#pdfpngSquareOutput").css('width', '297mm');
			$("#pdfpngSquareOutput").css('height', '210mm');
		} else if (documentSize == 'A3L') {
			$("#pdfpngSquareOutput").css('width', '420mm');
			$("#pdfpngSquareOutput").css('height', '297mm');
		} else {
			$("#pdfpngSquareOutput").css('width', 'min-content');
			$("#pdfpngSquareOutput").css('height', 'min-content');
		}
		generateMagicSquare('none');
	});
	$("#squareoutas option").click(function() {
		const outas = document.getElementById('squareoutas').value;
		const omode = parseInt($("#MagicSquareOutput").attr('omode'));
		const ohide = [
			["#MagicSquareOutput", "#magicabilitiesfortabs"],
			["#magicabilitiesforboxed", "#borderslabel", "#cellheightlabel", "#cellwidthlabel", "#borders", "#cellheight", "#cellwidth", "#BoxedSquareOutput"],
			["#editorContainer", "#HtmlcSquareOutput", "#highlightedOutput"],
			[],
			[]
		];
		const duration = 999;
		const delay = 0;
		if (outas == "tabs") {
			if (omode != 0) {
				HideAndSeek(ohide[omode], ohide[0], duration, delay);
				$("#MagicSquareOutput")[0].setAttribute('omode', "0");
				$("#magicabilitiesforhtmlc").hide();
				$("#pdfpngSquareOutput").hide();
				$("button[onclick='copyToClipboard()']").removeAttr('disabled');
			}
		} else if (outas == "boxed") {
			if (omode != 1) {
				HideAndSeek(ohide[omode], ohide[1], duration, delay);
				$("#MagicSquareOutput")[0].setAttribute('omode', "1");
				$("#magicabilitiesforhtmlc").hide();
				$("#pdfpngSquareOutput").hide();
				$("button[onclick='copyToClipboard()']").removeAttr('disabled');
			}
		} else if (outas == "html") {
			if (omode != 2) {
				HideAndSeek(ohide[omode], ohide[2], duration, delay);
				$("#MagicSquareOutput")[0].setAttribute('omode', "2");
				const codeInput = document.getElementById('HtmlcSquareOutput');
				const highlightedOutput = document.getElementById('highlightedOutput');
				codeInput.addEventListener('input', () => {
					highlightCode(codeInput, highlightedOutput);
				});
				highlightCode(codeInput, highlightedOutput);
				$('#HtmlcSquareOutput').on('scroll', function() {
					$('#highlightedOutput').scrollTop($(this).scrollTop());
				});
				$("#magicabilitiesforhtmlc").show();
				$("#pdfpngSquareOutput").hide();
				$("button[onclick='copyToClipboard()']").removeAttr('disabled');
			}
		} else if (outas == "pdf") {
			if (omode != 3) {
				HideAndSeek(ohide[omode], ohide[3], duration, delay);
				$("#MagicSquareOutput")[0].setAttribute('omode', "3");
				$("#magicabilitiesforhtmlc").show();
				$("#pdfpngSquareOutput").show();
				$("button[onclick='copyToClipboard()']")[0].setAttribute('disabled', "disabled");
			}
		} else if (outas == "png") {
			if (omode != 4) {
				HideAndSeek(ohide[omode], ohide[4], duration, delay);
				$("#MagicSquareOutput")[0].setAttribute('omode', "4");
				$("#magicabilitiesforhtmlc").show();
				$("#pdfpngSquareOutput").show();
				$("button[onclick='copyToClipboard()']")[0].setAttribute('disabled', "disabled");
			}
		}
	});
});