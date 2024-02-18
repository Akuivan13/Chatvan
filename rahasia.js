const inputText = document.getElementById('inputText');
const responseDiv = document.getElementById('response');
let responses = []; // Array untuk menyimpan respons-respons sebelumnya

function displayResponses() {
    // Menampilkan semua respons yang ada dalam array responses
    responseDiv.innerHTML = responses.join("<br><br><br>");
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

function submitText() {
    const text = inputText.value.trim().toLowerCase();
    if (text === '') {
        return;
    }
    const parts = text.split(" ");
    const command = parts[0];
    const query = parts.slice(1).join(" ");


    switch (command) {


case 'asupanrandom':
    fetch('https://api.zenext.xyz/randomasupan/asupan?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const videoUrl = URL.createObjectURL(blob);

            // Membuat elemen video
            const videoElement = document.createElement('video');
            // Mengatur sumber video dengan URL asupan random
            videoElement.src = videoUrl;
            // Mengatur atribut lainnya
            videoElement.controls = true;
            videoElement.autoplay = true;

            videoElement.style.width = '50%';
videoElement.style.maxWidth = '100%';

            // Menambahkan video asupan random ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah video asupan random:</p>`);
            responses.push(videoElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching asupan random content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten asupan random: ${error.message}</p>`);
            displayResponses();
        });
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
    
    https://api.fgmods.xyz/api/img/asupan-la?apikey=HzEHPOgA