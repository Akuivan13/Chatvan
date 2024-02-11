const inputText = document.getElementById('inputText');
const responseDiv = document.getElementById('response');
const doaApiUrl = 'https://rest-api.akuari.my.id/islami/doa';
const niatShalatApiUrl = 'https://rest-api.akuari.my.id/islami/niatshalat';
const animeApiUrl = 'https://rest-api.akuari.my.id/randomimganime/waifu';
const imageApiUrl = 'https://rest-api.akuari.my.id/ai/bing-ai2?text='; // URL API untuk pencarian gambar
let responses = []; // Array untuk menyimpan respons-respons sebelumnya

function displayResponses() {
    // Menampilkan semua respons yang ada dalam array responses
    responseDiv.innerHTML = responses.join("<br><br>");
    responseDiv.style.display = 'block';
}

async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        throw error;
    }
}

async function handleDoaCommand() {
    try {
        const doaInfo = await fetchData(doaApiUrl);

        const title = doaInfo.title;
        const arabic = doaInfo.arabic;
        const latin = doaInfo.latin;
        const translation = doaInfo.translation;

        const messageText = `
            <strong>Title:</strong> ${title}<br>
            <strong>Arabic:</strong> ${arabic}<br>
            <strong>Latin:</strong> ${latin}<br>
            <strong>Translation:</strong> ${translation}<br>
            <br>
            <strong>Follow TikTok @akuivan13</strong>
        `;

        console.log('Menampilkan pesan doa:');
        // Menambahkan pesan doa ke dalam array responses
        responses.push(`<p class="result-heading">Ini adalah hasil dari doaislami:</p>${messageText}`);
        // Menampilkan semua respons
        displayResponses();

    } catch (error) {
        console.error('Error handling doa command:', error.message);
    }
}

async function handleNiatShalatQuery(query) {
    try {
        const niatShalatData = await fetchData(niatShalatApiUrl);
        const matchedNiatShalat = niatShalatData.find(niat => {
            const namaShalat = niat.name.toLowerCase();
            const queryWithoutSpacing = query.toLowerCase().replace(/\s/g, '');
            const shalatWithoutSpacing = namaShalat.replace(/\s/g, '');
            return namaShalat.includes(queryWithoutSpacing) || shalatWithoutSpacing.includes(queryWithoutSpacing);
        });
        
        if (matchedNiatShalat) {
            const messageText = `
                <strong>Jenis Shalat:</strong> ${matchedNiatShalat.name}<br>
                <strong>Niat (Arabic):</strong> ${matchedNiatShalat.arabic}<br>
                <strong>Niat (Latin):</strong> ${matchedNiatShalat.latin}<br>
                <strong>Terjemahan:</strong> ${matchedNiatShalat.terjemahan}<br>
                <br>
                <strong>Follow TikTok @akuivan13</strong>
            `;
            responses.push(`<p class="result-heading">Niat Shalat ${matchedNiatShalat.name}:</p>${messageText}`);
        } else {
            responses.push(`<p class="result-heading">Maaf, tidak ada niat shalat yang cocok dengan query '${query}'.</p>`);
        }
        displayResponses();
    } catch (error) {
        console.error('Error handling niat shalat query:', error.message);
    }
}
async function fetchRandomAnimeImage() {
    try {
        const response = await fetch(animeApiUrl); // Menggunakan konstanta animeApiUrl
        if (!response.ok) {
            throw new Error('Failed to fetch random anime image');
        }
        const blob = await response.blob(); // Ambil respons sebagai blob
        return URL.createObjectURL(blob); // Dapatkan URL objek untuk menampilkan gambar
    } catch (error) {
        console.error('Error fetching random anime image:', error.message);
        throw error;
    }
}

async function handleAnimeCommand() {
    try {
        const imageUrl = await fetchRandomAnimeImage();

        // Membuat elemen img
        const imgElement = document.createElement('img');
        // Mengatur sumber gambar dengan URL yang diperoleh dari API
        imgElement.src = imageUrl;
        // Mengatur ukuran gambar
        imgElement.style.width = '250px';
        imgElement.style.height = '250px';

        // Menambahkan gambar anime ke dalam array responses
        responses.push(`<p class="result-heading">Ini adalah gambar anime random:</p>`);
        responses.push(imgElement.outerHTML);
        // Menampilkan semua respons
        displayResponses();
    } catch (error) {
        console.error('Error handling anime command:', error.message);
    }
}

async function fetchImage(query) {
    try {
        // Mengonversi query menjadi format yang dapat digunakan dalam URL
        const formattedQuery = encodeURIComponent(query);
        // Menyusun URL API dengan query yang diformat
        const apiUrl = `${imageApiUrl}${formattedQuery}`;
        // Melakukan pengambilan data dari API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }
        // Ambil respons sebagai blob
        const blob = await response.blob();
        // Dapatkan URL objek untuk menampilkan gambar
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching image:', error.message);
        throw error;
    }
}


async function handleImageCommand(query) {
    try {
        // Menyusun query untuk mengambil gambar berdasarkan input pengguna
        const imageUrl = await fetchImage(query);

        // Membuat elemen img
        const imgElement = document.createElement('img');
        // Mengatur sumber gambar dengan URL yang diperoleh dari API
        imgElement.src = imageUrl;
        // Mengatur ukuran gambar
        imgElement.style.width = '250px';
        imgElement.style.height = '250px';

        // Menambahkan gambar ke dalam array responses
        responses.push(`<p class="result-heading">Ini adalah gambar untuk query '${query}':</p>`);
        responses.push(imgElement.outerHTML);
        // Menampilkan semua respons
        displayResponses();
    } catch (error) {
        console.error('Error handling image command:', error.message);
    }
}


function fetchFaktamenarik(count) {
    fetch('https://raw.githubusercontent.com/vani360/database/main/faktamenarik.json')
        .then(response => response.json())
        .then(data => {
            // Mengacak array faktamenarik
            const shuffledFacts = data.sort(() => Math.random() - 0.5);
            // Mengambil sejumlah fakta yang diminta
            const facts = shuffledFacts.slice(0, count);
            // Menambahkan fakta-fakta ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah hasil dari faktamenarik:</p><ul>${facts.map(fact => "<li>" + fact + "</li>").join("")}</ul>`);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function submitText() {
    const text = inputText.value.trim().toLowerCase();
    if (text === '') {
        return;
    }
    const parts = text.split(" ");
    const command = parts[0];
    const query = parts.slice(1).join(" ");

    switch (command) {
        case 'help':
        case 'fitur':
        case 'menu':
            // Tampilkan fitur
            responses.push(`<p><strong>────────────────────────</strong></p>
<p><strong>⟨FITUR ISLAMI⟩</strong></p>
<p>✦Dᴏᴀ (Random)</p>
<p>✦Nɪᴀᴛ Sʜᴏʟᴀᴛ (?)</p>
<br>
<p><strong>⟨FITUR AI⟩</strong></p>
<p>✦Gambar (Pegunungan)</p>
<br>
<p><strong>⟨FITUR LAINYA]⟩</strong></p>
<p>✦Oᴡɴᴇʀ</p>
<p>✦Hᴇʟᴘ</p>
<p>✦Fitur</p>
<br>
<p><strong>⟨FITUR RANDOM⟩</strong></p>
<p>✦Faktamenarik (Jumlah)</p>
<p>✦Anime</p>
<br>
<p><strong>⟨HAPUS CHAT] </strong></p>
<p>✦Cʟᴇᴀʀ</p>
<br>
<p><strong>⟨Jumlah Fitur⟩</strong></p>
<p>✦Jumlah =9</p>
<br>
<p>##CHATVAN ᴠ1.0.0</p>
<p><strong>────────────────────────</strong></p>`);
            displayResponses();
            break;
        case 'halo':
        case 'hi':
        case 'hay':
        case 'salam':
        case 'test':
        case 'helo':
        case 'p':
            // Menampilkan respon yang sama dengan kata kunci
            responses.push(`<p class="result-heading">Ini adalah hasil dari ${command}:</p><p>${command} juga Kak!</p>`);
            displayResponses();
            break;
        case 'doa':
            handleDoaCommand();
            break;
        case 'niat':
            if (query !== '') {
                handleNiatShalatQuery(query);
            } else {
                responses.push('<p class="result-heading">Mohon sertakan jenis shalat dalam query untuk menampilkan niat shalat.</p>');
                displayResponses();
            }
            break;
        case 'faktamenarik':
            // Parse the count parameter from query if provided
            const count = parseInt(query);
            if (!isNaN(count) && count > 0) {
                fetchFaktamenarik(count);
            } else {
                // If count is not provided or invalid, fetch default number of facts
                fetchFaktamenarik(3); // Default count is 3
            }
            break;
        case 'owner':
            responses.push('<p class="result-heading">Ini adalah hasil dari owner:</p><p>Ownerku Namanya Ivan 🐈 🐕</p>');
            displayResponses();
            break;
        case 'anime':
            handleAnimeCommand();
            break;
        case 'gambar': // Menambahkan case untuk perintah "gambar"
            handleImageCommand(query);
            break;
        case 'clear':
            responses = [];
            responseDiv.innerHTML = '';
            responseDiv.style.display = 'none';
            break;
        default:
            responses.push('<p class="result-heading">Ini adalah hasil dari perintah yang tidak dikenali:</p><p>Pastikan Kamu Sudah Mengetik Dengan Benar 😇</p>');
            displayResponses();
    }

    inputText.value = '';
}

inputText.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        submitText();
    }
});
