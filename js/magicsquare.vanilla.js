function generateMagicSquare(job) {
    const n = parseInt(document.getElementById('rows').value);
    const r = parseInt(document.getElementById('MagicSquareOutput').getAttribute('rotated'));
    const f = document.getElementById('MagicSquareOutput').getAttribute('flipped');
    const expectedRowElement = document.getElementById('expectedRowSum');

    if (n < 3) {
        alert("Lütfen 3 veya daha büyük bir sayı girin.");
        return;
    }

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

    if (f === "true") {
        MagicSquare = mirrorFlip(MagicSquare);
    }

    if (job === "rotate" || job === "flip") {
        checkMagicSquare(MagicSquare, 0);
    } else if (job === "none") {

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

    document.getElementById("algorithm").addEventListener("change", function() {
        if (document.getElementById('lockcreator').checked) {
            generateMagicSquare();
        }
    });
}

function createMagicSquare(n) {
    let algorithm = document.getElementById('algorithm').value;
    if (algorithm === 'siamase') {
        return siameseMethod(n);
    } else if (algorithm === 'stracheydouble') {
        return stracheyMethod(n);
    } else if (algorithm === 'durer') {
        return durerMethod(n);
    } else if (algorithm === 'sExchange') {
        return simpleExchangeMethod(n);
    } else if (algorithm === 'lux') {
        return abdilLUXMethod(n);
    } else if (algorithm === 'stracheysingle') {
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

function stracheyMethod(n) {
    let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let count = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
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

function durerMethod(n) {
    let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let count = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
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

function simpleExchangeMethod(n) {
    let magicSquare = new Array(n).fill(0).map(() => new Array(n).fill(0));
    let count = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            magicSquare[i][j] = count++;
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ((i % 4 === j % 4) || ((i + j) % 4 === 3)) {
                magicSquare[i][j] = (n * n) - magicSquare[i][j] + 1;
            }
        }
    }
    return magicSquare;
}

function stracheySinglyEvenMethod(n) {
    const magicSquare = Array.from({ length: n }, () => Array(n).fill(0));
    const k = n / 2;
    const miniMagic = siameseMethod(k);
    const MagicConstant = (n * (n * n + 1)) / 2;
    const expectedRowElement = document.getElementById('expectedRowSum');
    const RowSum = parseFloat(expectedRowElement.value);

    if (!(RowSum <= MagicConstant || RowSum % 2 === 0)) {
        MagicSquare = incrementedMagicSquare(miniMagic, (RowSum - (3 * k * k * k)) / 2);
    }

    for (let i = 0; i < k; i++) {
        for (let j = 0; j < k; j++) {
            magicSquare[i][j] = miniMagic[i][j];
            magicSquare[i + k][j + k] = miniMagic[i][j] + k * k;
            magicSquare[i][j + k] = miniMagic[i][j] + 2 * k * k;
            magicSquare[i + k][j] = miniMagic[i][j] + 3 * k * k;
        }
    }

    const swapCol = [];
    const swapCount = (k - 1) / 2;
    for (let i = 0; i < swapCount; i++) {
        swapCol.push(i);
    }
    for (let i = n - swapCount + 1; i < n; i++) {
        swapCol.push(i);
    }

    for (let i = 0; i < k; i++) {
        for (let j = 0; j < swapCol.length; j++) {
            const col = swapCol[j];
            [magicSquare[i][col], magicSquare[i + k][col]] = [magicSquare[i + k][col], magicSquare[i][col]];
        }
    }

    const halfK = Math.floor(k / 2);
    [magicSquare[halfK][0], magicSquare[halfK + k][0]] = [magicSquare[halfK + k][0], magicSquare[halfK][0]];
    [magicSquare[halfK + k][halfK], magicSquare[halfK][halfK]] = [magicSquare[halfK][halfK], magicSquare[halfK + k][halfK]];

    if (!(RowSum <= MagicConstant || RowSum % 2 !== 0)) {
        MagicSquare = incrementMatrix(magicSquare, RowSum);
    }

    return magicSquare;
}

function mirrorTheSquare() {
    let flipped = document.getElementById('MagicSquareOutput').getAttribute('flipped');
    if (flipped === "true") {
        document.getElementById('MagicSquareOutput').setAttribute('flipped', "false");
        document.querySelector("button[onclick='mirrorTheSquare()']").style.transform = 'none';
    } else {
        document.getElementById('MagicSquareOutput').setAttribute('flipped', "true");
        document.querySelector("button[onclick='mirrorTheSquare()']").style.transform = 'rotate(180deg) scaleY(-1)';
        document.querySelector("button[onclick='mirrorTheSquare()']").style.transform = 'rotate(180deg) scaleX(-1)';
    }
    generateMagicSquare("flip");
}

function rotateTheSquare() {
    let previousrotation = parseFloat(document.getElementById('MagicSquareOutput').getAttribute('rotated'));
    let rotatelabel = "";
    let degrees = previousrotation;
    if (previousrotation === 270) {
        degrees = 0;
    } else {
        degrees += 90;
    }
    document.getElementById('MagicSquareOutput').setAttribute('rotated', degrees);
    if (getLanguage() === "turkish") {
        rotatelabel = degrees + "°Döndür";
    } else {
        rotatelabel = "Rotate" + degrees + "°";
    }
    document.querySelector("button[onclick='rotateTheSquare()']").innerHTML = rotatelabel;
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

function getLanguage() {
    var spelllanguageelem = document.getElementById("language");
    var languagevalue = spelllanguageelem.value;
    if (spelllanguageelem !== null || languagevalue !== undefined) {
        return languagevalue;
    } else {
        return "turkish";
    }
}

function pretranslate(turkish, english) {
    if (getLanguage() === "turkish") {
        return turkish;
    } else if (getLanguage() === "english") {
        return english;
    }
}

function fillQuadrant(square, startRow, startCol, size, startNum) {
    let num = startNum;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            square[startRow + i][startCol + j] = num++;
        }
    }
}

function incrementedMagicSquare(MagicSquare, RowSum) {
    const n = MagicSquare.length;
    const MagicConstant = (n * (n * n + 1)) / 2;
    const incremention = (RowSum - MagicConstant) / n;

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            MagicSquare[r][c] += incrementionForCell(n, RowSum, incremention, MagicSquare[r][c]);
        }
    }
    return MagicSquare;
}

function incrementionForCell(n, RowSum, incremention, cellvalue) {

    if (cellvalue > (n * n) - (n * (RowSum % n))) {
        return Math.ceil(incremention);
    } else {
        return Math.floor(incremention);
    }
}

function incrementMatrix(MagicSquare, RowSum) {

    const n = MagicSquare.length;
    const MagicConstant = (n * (n * n + 1)) / 2;
    const z = (RowSum - MagicConstant) % n;
    const incremention = (RowSum - MagicConstant - z) / n;

    for (let k = 0; k < z; k++) {
        for (let i = 0; i < n; i++) {
            const row = (k + i) % n;
            const col = i;
            MagicSquare[row][col]++;
        }
    }

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            MagicSquare[r][c] += incremention;
        }
    }
    return MagicSquare;
}

function mirrorFlip(magicSquare) {
    const N = magicSquare.length;
    let mirrorFlip = new Array(N).fill(0).map(() => new Array(N).fill(0));

    for (let a = 0; a < N; a++) {
        for (let b = 0; b < N; b++) {
            let m = N - 1 - a;
            let n = N - 1 - b;
            mirrorFlip[a][b] = magicSquare[m][n];
        }
    }
    return mirrorFlip;
}

function boxTheSquare(MagicSquare) {
    const box = ["─│┌┐└┘├┼┤┬┴", "┄┆┌┐└┘├┼┤┬┴", "┅┇┏┓┗┛┣╋┫┳┻", "─│╭╮╰╯├┼┤┬┴", "━┃┏┓┗┛┣╋┫┳┻", "═║╔╗╚╝╠╬╣╦╩"];
    document.getElementById("cellheight").setAttribute('min', "1");
    const xob = [
        parseFloat(document.getElementById('borders').value),
        parseFloat(document.getElementById('cellheight').value),
        parseFloat(document.getElementById('cellwidth').value)
    ];
    const n = MagicSquare.length;
    let boxed = "";

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
        document.getElementById('cellwidth').setAttribute('min', String(longestlength - 3));
        if (xob[2] + 3 > longestlength) {
            longestlength = xob[2] + 3;
        }
        borderlength = longestlength - 3;
        lengthfornum = longestlength;
    } else {
        document.getElementById('cellwidth').setAttribute('min', String(longestlength));
        if (xob[2] > longestlength) {
            longestlength = xob[2];
        }
        borderlength = longestlength;
        lengthfornum = longestlength;
    }

    let centering = true;
    let bottomborder = false;
    for (let r = 0; r < n; r++) {

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

    const html = document.createElement('html');
    html.setAttribute('lang', 'en');

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
		equalizeCells();
	});`;
    document.body.appendChild(script);

    head.appendChild(metaCharset);
    head.appendChild(metaViewport);
    head.appendChild(title);
    head.appendChild(style);
    head.appendChild(script);

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

    header.appendChild(h1);
    main.appendChild(p);
    main.appendChild(squarecontainer);
    footer.appendChild(pFooter);
    body.appendChild(header);
    body.appendChild(main);
    body.appendChild(footer);

    html.appendChild(head);
    html.appendChild(body);

    holder.appendChild(html);
    const htmlcontainer = document.getElementById(HtmlHolder);
    htmlcontainer.innerHTML = "";
    htmlcontainer.appendChild(holder);
    renderMagicSquareToTable(MagicSquare, 'themagicsquare');
    return formatHTML(holder.innerHTML);
}

function preEqualizeCells() {
	if (document.getElementById('pageofpdf') != null) {
	let previousstyle = document.getElementById('pageofpdf');
	}
	let previousstyle = "";
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
	style.textContent = `
	.magic-square-table td {
		aspect-ratio: 1 / 1;
		width: min-content !important;
		height: min-content !important;
	}
	.magic-square-table td span {
		aspect-ratio: 1 / 1;
		width: ${maxWidthCell}px !important;
		height: ${maxHeightCell}px !important;
	}`;
	if (document.getElementById('pageofpdf') != null) {
		previousstyle.remove();
	}
	style.setAttribute('id', 'pageofpdf');
	document.head.appendChild(style);
}

function renderMagicSquareToTable(magicSquare, containerId) {

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('magic-square-table');

    magicSquare.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cellValue, colIndex) => {
            const td = document.createElement('td');
            const span = document.createElement('span');
            td.appendChild(span);
            span.textContent = cellValue;

            td.classList.add(`row-${oddOrEven(rowIndex)}`, `col-${oddOrEven(colIndex)}`);

            td.setAttribute('data-value', cellValue);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

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

    const borderColor = document.getElementById('borderColor').value;
    const startDirection = document.querySelector('input[name="rotationStart"]:checked').value;

    const baseRotate = startDirection === 'left' ? '-45deg' : '45deg';
    const oppositeRotate = startDirection === 'left' ? '45deg' : '-45deg';
    let css = "";
    if (startDirection != 'none') {

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

    const highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"(.*?)"/g, '<span class="string">"$1"</span>')
        .replace(/&lt;(\w+)(.*?)&gt;/g, '<span class="tag">&lt;$1$2&gt;</span>')
        .replace(/&lt;\/(\w+)&gt;/g, '<span class="tag">&lt;/$1&gt;</span>');
    output.innerHTML = highlighted;
}

function formatHTML(html) {
	const tab = '\t';
    let result = '';
    let indentLevel = 0;

    html.split(/(<[^>]+>)/).forEach((element) => {
        if (!element.trim()) {

            return;
        }
        if (element.startsWith('</')) {

            indentLevel--;
            result += tab.repeat(indentLevel) + element + '\n';
        } else if (element.startsWith('<') && !element.startsWith('<!')) {

            if (element.endsWith('/>') || isSelfClosingTag(element)) {

                result += tab.repeat(indentLevel) + element + '\n';
            } else {

                result += tab.repeat(indentLevel) + element + '\n';
                indentLevel++;
            }
        } else if (element.startsWith('<!')) {

            result += tab.repeat(indentLevel) + element + '\n';
        } else {

            result += tab.repeat(indentLevel) + element + '\n';
        }
    });
    return result.trim();
}

function isSelfClosingTag(tag) {
    const selfClosingTags = ['meta', 'img', 'br', 'hr', 'input', 'link', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr'];
    const tagName = tag.match(/<([^\s/>]+)/)?.[1];
    return tagName && selfClosingTags.includes(tagName.toLowerCase());
}

function formatMagicSquare(MagicSquare) {
    return MagicSquare.map(row => row.join('\t')).join('\n');
}

function checkMagicSquare(MagicSquare, delay) {
    const n = MagicSquare.length;
    const expectedRowSum = document.getElementById('expectedRowSum').value;
    const MagicConstant = (n * (n * n + 1)) / 2;
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

    if (successpuan < (2 * n)) {
        const btnCopy = document.querySelector("button[onclick='copyToClipboard()']");
        if (btnCopy) btnCopy.setAttribute('disabled', 'disabled');
        const btnSave = document.querySelector("button[onclick='saveToLocalDisk()']");
        if (btnSave) btnSave.setAttribute('disabled', 'disabled');
        const btnRotate = document.querySelector("button[onclick='rotateTheSquare()']");
        if (btnRotate) btnRotate.setAttribute('disabled', 'disabled');
        const btnMirror = document.querySelector("button[onclick='mirrorTheSquare()']");
        if (btnMirror) btnMirror.setAttribute('disabled', 'disabled');
        const inputNumberSwitch = document.querySelector("input[id='numberswitch']");
        if (inputNumberSwitch) inputNumberSwitch.setAttribute('disabled', 'disabled');
    } else {
        document.querySelectorAll("button[onclick='copyToClipboard()']").forEach(el => el.removeAttribute('disabled'));
        document.querySelectorAll("button[onclick='saveToLocalDisk()']").forEach(el => el.removeAttribute('disabled'));
        document.querySelectorAll("button[onclick='rotateTheSquare()']").forEach(el => el.removeAttribute('disabled'));
        document.querySelectorAll("button[onclick='mirrorTheSquare()']").forEach(el => el.removeAttribute('disabled'));
        document.querySelectorAll("input[name='numberswitch']").forEach(el => el.removeAttribute('disabled'));
    }

    function ifSumMatched(Sum, expectedRowSum) {
        return Sum == expectedRowSum ? 1 : 0;
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
    let paperunit = "mm";

    if (documentSize == 'A5P') {
        paperwidth = 148;
        paperheight = 210;
        paperorient = 'portrait';
        paperformat = 'a5';
    } else if (documentSize == 'A4P') {
        paperwidth = 210;
        paperheight = 297;
        paperorient = 'portrait';
        paperformat = 'a4';
    } else if (documentSize == 'A3P') {
        paperwidth = 297;
        paperheight = 420;
        paperorient = 'portrait';
        paperformat = 'a3';
    } else if (documentSize == 'A5L') {
        paperwidth = 210;
        paperheight = 148;
        paperorient = 'landscape';
        paperformat = 'a5';
    } else if (documentSize == 'A4L') {
        paperwidth = 297;
        paperheight = 210;
        paperorient = 'landscape';
        paperformat = 'a4';
    } else if (documentSize == 'A3L') {
        paperwidth = 420;
        paperheight = 297;
        paperorient = 'landscape';
        paperformat = 'a3';
    } else {
        const pdfOutput = document.getElementById('pdfpngSquareOutput');
        paperwidth = (pdfOutput.offsetWidth / 3.779527559) - 15;
        paperheight = (pdfOutput.offsetHeight / 3.779527559) - 15;
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
    let omode = parseInt(document.getElementById("MagicSquareOutput").getAttribute('omode'));
    let text = "";
    if (omode === 0) {
        text = document.getElementById("MagicSquareOutput").value;
    } else if (omode === 1) {
        text = document.getElementById("BoxedSquareOutput").value;
    } else if (omode === 2) {
        text = document.getElementById("HtmlcSquareOutput").value;
    }
    let filename = "";
    let dateofsave = new Date();
    let n = parseInt(document.getElementById('rows').value);
    let expectedRowElement = document.getElementById('expectedRowSum');
    let lengthofsize = String(n).length;
    let lengthofRsum = String(expectedRowElement.value).length;
    let day = ("0" + dateofsave.getDate()).slice(-2);
    let month = ("0" + (dateofsave.getMonth() + 1)).slice(-2);
    let enlarger = "";
    let enlargement = 21;
    enlargement -= 2 * lengthofsize;
    enlargement -= lengthofRsum;
    for (let enlarge = 0; enlarge < enlargement; enlarge++) {
        enlarger += "♡";
    }
    if (getLanguage() === "turkish") {
        filename = `[${n}x${n}-Sihirli-Kare-${expectedRowElement.value}] [${enlarger}] [${day}-${month}-${dateofsave.getFullYear()}]`;
    } else {
        filename = `[${n}x${n}-Magic-Square-${expectedRowElement.value}] [${enlarger}] [${day}-${month}-${dateofsave.getFullYear()}]`;
    }
    if (omode < 3) {
        if (omode < 2) {
            filename += `.txt`;
            text += `\n\n\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            text += `┃` + filename + `  ┃\n`;
			text += `┃https://metatronslove.github.io/magic-square-generator      ┃    🇹🇷\n`;
			text += `┃https://github.com/metatronslove                            ┃\n`;
            text += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
        } else if (omode === 2) {
            filename += `.htm`;
        }
        text = text.replace(/\n/g, "\r\n");
        let blob = new Blob([text], { type: "text/plain" });
        let anchor = document.createElement("a");
        anchor.download = filename;
        anchor.href = window.URL.createObjectURL(blob);
        anchor.target = "_blank";
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    } else if (omode === 3) {
        saveAsPdf(filename);
    } else if (omode === 4) {
        saveAsPng(filename);
    }
}

function copyToClipboard() {
    const omode = parseInt(document.getElementById("MagicSquareOutput").getAttribute('omode'));
    let copySource = "";
    let copyMesgTr, copyMesgEn;
    if (omode === 0) {
        copySource = "MagicSquareOutput";
        copyMesgTr = "Sihirli kare panoya kopyalandı!";
        copyMesgEn = "Magic Square is copied to clipboard!";
    } else if (omode === 1) {
        copySource = "BoxedSquareOutput";
        copyMesgTr = "Metin biçemi tablosu panoya kopyalandı!";
        copyMesgEn = "Table in text form is copied to clipboard!";
    } else if (omode === 2) {
        copySource = "HtmlcSquareOutput";
        copyMesgTr = "Html kodu panoya kopyalandı!";
        copyMesgEn = "Html code is copied to clipboard!";
    }
    const textarea = document.getElementById(copySource);
    textarea.select();
    document.execCommand('copy');
    alert(getLanguage() === "turkish" ? copyMesgTr : copyMesgEn);
}

function HideAndSeek(tohide, toshow, duration, delay) {
    let ti = new Date().getTime();
    let delayer = setInterval(function() {
        let me = new Date().getTime();
        if ((me - ti) > delay) {
            clearInterval(delayer);
        }
    }, delay);
    let h = 0;
    let hideInterval = setInterval(function() {
        if (h < tohide.length) {
            let el = document.querySelector(tohide[h].toString());
            if (el) {
                el.style.display = 'none';
            }
        } else {
            clearInterval(hideInterval);
        }
        h++;
    }, duration / tohide.length);
    let s = 0;
    let showInterval = setInterval(function() {
        if (s < toshow.length) {
            let el = document.querySelector(toshow[s].toString());
            if (el) {
                el.style.display = 'inline-block';
            }
        } else {
            clearInterval(showInterval);
        }
        s++;
    }, duration / toshow.length);
}

function IndianToArab(number) {
    return String(number)
        .replace(/٠/g, '0')
        .replace(/١/g, '1')
        .replace(/٢/g, '2')
        .replace(/٣/g, '3')
        .replace(/٤/g, '4')
        .replace(/٥/g, '5')
        .replace(/٦/g, '6')
        .replace(/٧/g, '7')
        .replace(/٨/g, '8')
        .replace(/٩/g, '9');
}

function ArabToIndian(number) {
    return String(number)
        .replace(/0/g, '٠')
        .replace(/1/g, '١')
        .replace(/2/g, '٢')
        .replace(/3/g, '٣')
        .replace(/4/g, '٤')
        .replace(/5/g, '٥')
        .replace(/6/g, '٦')
        .replace(/7/g, '٧')
        .replace(/8/g, '٨')
        .replace(/9/g, '٩');
}

function translateto(language) {
    let translatables = document.querySelectorAll('#magicsquare *');
    window.activelanguage = language;
    for (let i = 0; i < translatables.length; i++) {
        if (translatables[i].getAttribute(language + 'content')) {
            var translation = translatables[i].getAttribute(language + 'content');
            translatables[i].innerHTML = translation;
        }
    }
    if (language === "turkish") {
        document.getElementById('lockpressed').setAttribute('title', 'Basılı tut');

    }
    if (language === "english") {
        document.getElementById('lockpressed').setAttribute('title', 'Keep pushed');

    }
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('algorithms').innerHTML = createAlgorithmSelect(parseInt(document.getElementById('rows').value));
    translateto("turkish");

    let genBtn = document.querySelector("button[onclick='generateMagicSquare()']");
    if (genBtn) {
        genBtn.setAttribute('disabled', "disabled");
    }

    if (!document.getElementById('lockcreator').checked) {
        document.getElementById('lockcreator').click();
    }

    generateMagicSquare();

    const langSelect = document.querySelector("select[name='language']");
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            translateto(this.value);
            if (document.getElementById('lockcreator').checked) {
                generateMagicSquare();
            }
        });
    }

    document.getElementById('rows').addEventListener('change', function() {
        const n = parseInt(this.value);
        const MagicConstant = (n * (n * n + 1)) / 2;
        const expectedRowElement = document.getElementById('expectedRowSum');
        const RowSum = parseFloat(expectedRowElement.value);
        document.getElementById('algorithms').innerHTML = createAlgorithmSelect(n);
        if (RowSum <= MagicConstant) {
            expectedRowElement.value = MagicConstant;
        }
        if (document.getElementById('lockcreator').checked) {
            generateMagicSquare();
        }
    });

    document.getElementById('expectedRowSum').addEventListener('change', function() {
        if (document.getElementById('lockcreator').checked) {
            generateMagicSquare();
        }
    });

    document.getElementById('algorithm').addEventListener('change', function() {
        if (document.getElementById('lockcreator').checked) {
            generateMagicSquare();
        }
    });

    document.getElementById('algorithm').addEventListener('change', function() {
            if (document.getElementById('lockcreator').checked) {
                generateMagicSquare();
            }
    });

    document.getElementById('numberswitch').addEventListener('change', function() {
        if (document.getElementById('lockcreator').checked) {
            generateMagicSquare('none');
        }
    });

    document.getElementById('cellheight').addEventListener('change', function() {
        generateMagicSquare('none');
    });
    document.getElementById('cellwidth').addEventListener('change', function() {
        generateMagicSquare('none');
    });

    document.getElementById("borders").addEventListener('change', function() {
            generateMagicSquare('none');
    });

    document.querySelectorAll("input[name='rotationStart']").forEach(function(input) {
        input.addEventListener('click', function() {
            generateMagicSquare('none');
        });
    });

    document.getElementById('borderColor').addEventListener('change', function() {
        generateMagicSquare('none');
    });

    document.getElementById('lockcreator').addEventListener('change', function() {
        if (this.checked) {
            let btn = document.querySelector("button[onclick='generateMagicSquare()']");
            if (btn) btn.setAttribute('disabled', "disabled");
            generateMagicSquare();
        } else {
            let btn = document.querySelector("button[onclick='generateMagicSquare()']");
            if (btn) btn.removeAttribute('disabled');
        }
    });

    document.getElementById("paper-sizes").addEventListener('change', function() {
            const documentSize = document.getElementById('paper-sizes').value;
            const pdfOutput = document.getElementById('pdfpngSquareOutput');
            if (documentSize === 'A5P') {
                pdfOutput.style.width = '148mm';
                pdfOutput.style.height = '210mm';
            } else if (documentSize === 'A4P') {
                pdfOutput.style.width = '210mm';
                pdfOutput.style.height = '297mm';
            } else if (documentSize === 'A3P') {
                pdfOutput.style.width = '297mm';
                pdfOutput.style.height = '420mm';
            } else if (documentSize === 'A5L') {
                pdfOutput.style.width = '210mm';
                pdfOutput.style.height = '148mm';
            } else if (documentSize === 'A4L') {
                pdfOutput.style.width = '297mm';
                pdfOutput.style.height = '210mm';
            } else if (documentSize === 'A3L') {
                pdfOutput.style.width = '420mm';
                pdfOutput.style.height = '297mm';
            } else {
                pdfOutput.style.width = 'min-content';
                pdfOutput.style.height = 'min-content';
            }
            generateMagicSquare('none');
    });

    document.getElementById("squareoutas").addEventListener('change', function() {
            const outas = document.getElementById('squareoutas').value;
            const omode = parseInt(document.getElementById("MagicSquareOutput").getAttribute('omode'));
            const ohide = [
                ["#MagicSquareOutput", "#magicabilitiesfortabs"],
                ["#magicabilitiesforboxed", "#BoxedSquareOutput"],
                ["#editorContainer", "#HtmlcSquareOutput", "#highlightedOutput"],
                [],
                []
            ];
            const duration = 999;
            const delay = 0;

            if (outas === "tabs") {
                if (omode !== 0) {
                    HideAndSeek(ohide[omode], ohide[0], duration, delay);
                    document.getElementById("MagicSquareOutput").setAttribute('omode', "0");
                    document.getElementById('magicabilitiesforhtmlc').style.display = "none";
                    document.getElementById('pdfpngSquareOutput').style.display = "none";
                    document.querySelectorAll("button[onclick='copyToClipboard()']").forEach(function(el) {
                        el.removeAttribute('disabled');
                    });
                }
            } else if (outas === "boxed") {
                if (omode !== 1) {
                    HideAndSeek(ohide[omode], ohide[1], duration, delay);
                    document.getElementById("MagicSquareOutput").setAttribute('omode', "1");
                    document.getElementById('magicabilitiesforhtmlc').style.display = "none";
                    document.getElementById('pdfpngSquareOutput').style.display = "none";
                    document.querySelectorAll("button[onclick='copyToClipboard()']").forEach(function(el) {
                        el.removeAttribute('disabled');
                    });
                }
            } else if (outas === "html") {
                if (omode !== 2) {
                    HideAndSeek(ohide[omode], ohide[2], duration, delay);
                    document.getElementById("MagicSquareOutput").setAttribute('omode', "2");
                    const codeInput = document.getElementById('HtmlcSquareOutput');
                    const highlightedOutput = document.getElementById('highlightedOutput');
                    codeInput.addEventListener('input', function() {
                        highlightCode(codeInput, highlightedOutput);
                    });
                    highlightCode(codeInput, highlightedOutput);
                    codeInput.addEventListener('scroll', function() {
                        highlightedOutput.scrollTop = this.scrollTop;
                    });
                    document.getElementById('magicabilitiesforhtmlc').style.display = "";
                    document.getElementById('pdfpngSquareOutput').style.display = "";
                    preEqualizeCells();
                    document.getElementById('pdfpngSquareOutput').style.display = "none";
                    document.querySelectorAll("button[onclick='copyToClipboard()']").forEach(function(el) {
                        el.removeAttribute('disabled');
                    });
                }
            } else if (outas === "pdf") {
                if (omode !== 3) {
                    HideAndSeek(ohide[omode], ohide[3], duration, delay);
                    document.getElementById("MagicSquareOutput").setAttribute('omode', "3");
                    document.getElementById('magicabilitiesforhtmlc').style.display = "";
                    document.getElementById('pdfpngSquareOutput').style.display = "";
                    preEqualizeCells();
                    let btn = document.querySelector("button[onclick='copyToClipboard()']");
                    if (btn) btn.setAttribute('disabled', "disabled");
                }
            } else if (outas === "png") {
                if (omode !== 4) {
                    HideAndSeek(ohide[omode], ohide[4], duration, delay);
                    document.getElementById("MagicSquareOutput").setAttribute('omode', "4");
                    document.getElementById('magicabilitiesforhtmlc').style.display = "";
                    document.getElementById('pdfpngSquareOutput').style.display = "";
                    preEqualizeCells();
                    let btn = document.querySelector("button[onclick='copyToClipboard()']");
                    if (btn) btn.setAttribute('disabled', "disabled");
                }
            }
    });
});