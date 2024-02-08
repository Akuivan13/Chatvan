const inputText = document.getElementById('inputText');
    const responseDiv = document.getElementById('response');
    const doaApiUrl = 'https://rest-api.akuari.my.id/islami/doa';
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
  async function getRealtimeWaktu(zonaWaktu) {
    try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${zonaWaktu}`);
        if (!response.ok) {
            throw new Error('Failed to fetch waktu');
        }
        const data = await response.json();
        const waktu = new Date(data.utc_datetime).toLocaleString('id-ID', { timeZone: zonaWaktu });
        responses.push(`<p class="result-heading">Ini adalah hasil dari waktu:</p><p>Waktu saat ini di ${zonaWaktu.replace('/', ', ')}: ${waktu}</p>`);
        displayResponses();
    } catch (error) {
        console.error('Error fetching waktu:', error);
        responses.push(`<p class="result-heading">Ini adalah hasil dari waktu:</p><p>Maaf, gagal mendapatkan informasi waktu di ${zonaWaktu.replace('/', ', ')}.</p>`);
        displayResponses();
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
        const count = parseInt(parts[1]) || 1;
// =====================
        switch (command) {
            case 'doaislami':
                handleDoaCommand();
                break;
            case 'faktamenarik':
                fetchFaktamenarik(count);
                break;
            case 'halo':
                responses.push('<p class="result-heading">Ini adalah hasil dari halo:</p><p>Halo juga Kak!</p>');
                displayResponses();
                break;
            case 'owner':
                responses.push('<p class="result-heading">Ini adalah hasil dari owner:</p><p>Ownerku Namanya Ivan 🐈 🐕</p>');
                displayResponses();
                break;
            case 'help':
                responses.push('<p class="result-heading">Ini adalah hasil dari help:</p><p>Kata </p>');
                displayResponses();
                break;
            case 'waktu':
        getRealtimeWaktu('Asia/Jakarta'); // Default zona waktu Jakarta jika tidak ada zona waktu yang ditentukan
        break;    
            case 'clear':
                responses = []; // Menghapus semua respons dari array
                responseDiv.innerHTML = ''; // Menghapus semua isi dari responseDiv
                responseDiv.style.display = 'none';
                break;
            default:
                responses.push('<p class="result-heading">Ini adalah hasil dari perintah yang tidak dikenali:</p><p>Pastikan Kamu Sudah Mengetik Dengan Benar 😇</p>');
                displayResponses();
        }

        inputText.value = '';
    }

// =======================================
    inputText.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitText();
        }
    });
