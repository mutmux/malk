function log(buf, str) {
	// output (append) a string (pre element) to a supplied buffer (div element) 
	const out = document.createElement("p");
	
	out.textContent = str;

	buf.appendChild(out);
}

function getBytes(encodedData, offsetStart, offsetEnd = offsetStart, isLittleEndian = 0) {
	// returns the bytes from hex data apart of an offset range (inclusive).
	// default parameter included to allow for getting single bytes and specifying endianness.

	const indexStart = offsetStart * 2;
	const indexEnd = (offsetEnd + 1) * 2;

	// we do the byte selection based on encoded hex data without spaces in uppercase.
	// sanitise the encodedData without modifying original to better ensure this.
	const sanitised = encodedData.toUpperCase().replace(/ /g, '');

	let bytes = sanitised.slice(indexStart, indexEnd).match(/.{2}/g);
	if (isLittleEndian === 1) bytes.reverse(); // reverse byte order if little endian

	return bytes.join('');
}

function populateForms() {
	let valueTimestamp = "";

	for (i = 0; i <= 4; i++) {
		let digit = "";

		digit += parseInt(getBytes(dataEncoded, offsets[i].offsetStart), 16);
		if (digit.length === 1) digit = "0" + digit;  // pad the digit if needed

		// add relevant separator after digit depending on which value we're obtaining this iteration.
		if (i === 0) {
			// two bytes hold the year value in the timestamp, need to account for that
			digit = "";
			digit += parseInt(getBytes(dataEncoded, offsets[0].offsetStart, offsets[0].offsetEnd), 16) + "-";
		}
		if (i === 1) digit += "-";  // timestamp month
		if (i === 2) digit += "T";  // timestamp day
		if (i === 3) digit += ":";  // timestamp hour

		valueTimestamp += digit;
	}

	document.getElementById("timestamp").value = valueTimestamp;

	// count from 1 instead of 0, yes yes
	document.getElementById("level-played").value = parseInt(getBytes(dataEncoded, offsets[9].offsetStart), 16) + 1;
	document.getElementById("mission-selected").value = parseInt(getBytes(dataEncoded, offsets[10].offsetStart), 16) + 1;
	document.getElementById("level-unlocked").value = parseInt(getBytes(dataEncoded, offsets[11].offsetStart), 16) + 1;

	// coins
	document.getElementById("coins").value = parseInt(getBytes(dataEncoded, offsets[12].offsetStart, offsets[12].offsetEnd, 1), 16);
}

function writeFile(filename) {
	// get values from editor forms, convert as necessary and replace sections of encoded data string

	// convert encoded data back into binary data array, THEN pass it to blob
	let bytes = new Uint8Array(dataEncoded.length / 2);

	for (let i = 0; i < dataEncoded.length; i += 2) {
        bytes[i / 2] = parseInt(dataEncoded.substr(i, 2), 16);
    }

	const blob = new Blob([bytes], {type: 'application/octet-stream'});
	const dl = document.createElement('a');

	dl.download = filename; // reuse name from imported file
	dl.href = URL.createObjectURL(blob);

	// append download to page and click to trigger
	document.body.appendChild(dl);
	dl.click();

	// my name is Guy Incognito!
	document.body.removeChild(dl);
	URL.revokeObjectURL(dl.href);
}

function readFile(f) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        let data = "";

        reader.onload = () => {
            const arrayBuffer = reader.result;
            const bytes = new Uint8Array(arrayBuffer);

            bytes.forEach(byte => {
                data += byte.toString(16).padStart(2, '0').toUpperCase();
            });

            resolve(data);
        };

        reader.readAsArrayBuffer(f);
    });
}

async function tryLoad(chosenFile) {
	try {
		log(cout, `Attempting to load "${chosenFile.name}"...`);

		// file size checks. save games should hover around 7-9kb.
		if (chosenFile.size < 7000 || chosenFile.size > 8000) {
			log(cout, "D'oh! File is too small or large. Is this a valid save game?");

			return;
		}
		log(cout, `File is of a reasonable size, confirming signatures...`)

		// it's a reasonable size, so we can load it at this point.
		dataEncoded = await readFile(chosenFile);
		
		// signature checks: unchanging sequences of bytes at various offsets.
		// if a check fails, unload the file and indicate load failure without continuing.
		if (getBytes(dataEncoded, 0x0) != "BA" && getBytes(dataEncoded, 0x99, 0x9A) != "6D30" && getBytes(dataEncoded, 0x1C37, 0x1C45) != "4C61756E6368657256657273696F6E") {
			log(cout, "D'oh! Signature check failed, file is either not a save game, or is too corrupted.");
			encodedData = "";

			return;
		}

		// if we made it here, all initial checks have passed.
		log(cout, "Woo-hoo! All checks passed, populating forms...");

		populateForms();

		// show the editor and allow exporting.
		document.getElementById("editor").style.display = "block";
		document.getElementById("picker-export").disabled = false;
	} catch (err) {
		console.error(err);
	}
}