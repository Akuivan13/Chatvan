const inputText = document.getElementById('inputText');
const responseDiv = document.getElementById('response');
const doaApiUrl = 'https://rest-api.akuari.my.id/islami/doa';
const niatShalatApiUrl = 'https://rest-api.akuari.my.id/islami/niatshalat';
const animeApiUrl = 'https://rest-api.akuari.my.id/randomimganime/waifu';
const imageApiUrl = 'https://rest-api.akuari.my.id/ai/bing-ai2?text='; // URL API untuk pencarian gambar
const vanQuestionsUrl = 'https://raw.githubusercontent.com/Akuivan13/Database-/main/vanres.json';

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
        imgElement.style.width = '50%';
        imgElement.style.maxWidth = '100%';

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
        imgElement.style.width = '50%';
        imgElement.style.maxWidth = '100%';

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
async function fetchVanQuestions() {
    try {
        const response = await fetch(vanQuestionsUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch van questions');
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching van questions:', error.message);
        throw error;
    }
}

async function handleVanQuestion(query) {
    try {
        const vanQuestions = await fetchVanQuestions();
        
        // Mencari pertanyaan yang cocok dengan query
        const matchedQuestion = vanQuestions.find(question => {
            const title = question.title.toLowerCase();
            const queryWithoutSpacing = query.toLowerCase().replace(/\s/g, '');
            const titleWithoutSpacing = title.replace(/\s/g, '');
            return title.includes(queryWithoutSpacing) || titleWithoutSpacing.includes(queryWithoutSpacing);
        });
        
        if (matchedQuestion) {
            responses.push(`<p class="result-heading">Pertanyaan '${query}':</p>${matchedQuestion.respon}`);
        } else {
            responses.push(`<p class="result-heading">Maaf, tidak ada pertanyaan yang cocok dengan '${query}'.</p>`);
        }
        displayResponses();
    } catch (error) {
        console.error('Error handling van question:', error.message);
    }
}

async function fetchGPTResponse(query) {
    const apiKey = 'global';
    const apiUrl = `https://api.miftahganzz.my.id/api/ai/chatgpt?q=${encodeURIComponent(query)}&apikey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch GPT response');
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching GPT response:', error.message);
        throw error;
    }
}

function handleGPTCommand(query) {
    fetchGPTResponse(query)
        .then(result => {
            // Menambahkan respon GPT ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah hasil dari GPT ${query}:</p><p>${result}</p>`);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error handling GPT command:', error.message);
        });
}

async function fetchVGPTResponse(chat) {
    const apiUrl = `https://rest-api.akuari.my.id/ai/gpt?chat=${encodeURIComponent(chat)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch response from VGPT API');
        }
        const data = await response.json();
        return data.respon; // Mengambil respon dari objek JSON
    } catch (error) {
        console.error('Error fetching response from VGPT API:', error.message);
        throw error;
    }
}

async function handleVGPTCommand(query) {
    try {
        const response = await fetchVGPTResponse(query);
        responses.push(`<p class="result-heading">Ini adalah hasil dari VGPT:</p><p>${response}</p>`);
        displayResponses();
    } catch (error) {
        console.error('Error handling VGPT command:', error.message);
    }
}
function handlePlayCommand(title) {
    // Gunakan judul lagu yang diberikan oleh pengguna untuk membentuk URL API
    const apiUrl = `https://api.miftahganzz.my.id/api/download/play-youtube-audio?title=${encodeURIComponent(title)}&apikey=zex`;

    try {
        // Lakukan fetch terhadap URL API yang dibentuk
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch audio');
                    responses.push(`<p class="result-heading">Memainkan lagu:</p><p>(Kalau Tidak Muncul Ada Limit 5 menit, Sillahkan Ketik Fitur)</p>`);
                }
                return response.json();
            })
            .then(data => {
                // Dapatkan URL audio dari respons API
                const audioUrl = data.data.url;
                
                // Membuat elemen audio untuk memainkan lagu
                const audioElement = new Audio(audioUrl);
           /*     audioElement.play(); */
                
                audioElement.src = audioUrl;
                audioElement.controls = true;
                audioElement.style.width = '80%';
                audioElement.style.maxWidth = '100%';

                // Menambahkan pesan respon
                responses.push(`<p class="result-heading">Memainkan lagu:</p><p>Silakan nikmati lagunya (Kalau Tidak Muncul Ada Limit 5 menit)</p>`);
                responses.push(audioElement.outerHTML);
// Menampilkan semua respons
                displayResponses();
            })
            .catch(error => {
                console.error('Error fetching audio:', error.message);
            });
    } catch (error) {
        console.error('Error playing audio:', error.message);
    }
}

function handlePlayVideoCommand(title) {
    // Bentuk URL API dengan judul yang diberikan oleh pengguna
    const apiUrl = `https://api.miftahganzz.my.id/api/download/play-youtube-video?title=${encodeURIComponent(title)}&apikey=global`;

    try {
        // Lakukan fetch terhadap URL API yang dibentuk
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
                return response.json();
            })
            .then(data => {
                // Dapatkan URL video dari respons API
                const videoUrl = data.data.url;
                
                // Buat elemen video untuk memainkan video
                const videoElement = document.createElement('video');
                videoElement.src = videoUrl;
                videoElement.controls = true;
                
                videoElement.style.width = '80%';
                videoElement.style.maxWidth = '100%';


          /*      // Tambahkan elemen video ke dalam halaman
                document.body.appendChild(videoElement); 

                // Mulai memutar video
                videoElement.play(); */

                // Tambahkan pesan respon
                responses.push(`<p class="result-heading">Memainkan video:</p><p>Silakan nikmati videonya</p>`);
                responses.push(videoElement.outerHTML);
// Tampilkan semua respon
                displayResponses();
            })
            .catch(error => {
                console.error('Error fetching video:', error.message);
            });
    } catch (error) {
        console.error('Error playing video:', error.message);
    }
}






function handlePlayVideoLolhuman(title) {
    // Masukkan API key di sini
    const apiKey = 'GataDios';

    // Bentuk URL API dengan judul yang diberikan oleh pengguna
    const apiUrl = `https://api.lolhuman.xyz/api/ytplay2?apikey=${apiKey}&query=${encodeURIComponent(title)}`;

    try {
        // Lakukan fetch terhadap URL API yang dibentuk
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch video');
                }
                return response.json();
            })
            .then(data => {
                // Dapatkan URL video dan audio dari respons API
                const videoUrl = data.result.video;
                const audioUrl = data.result.audio;
                
                // Buat elemen video untuk memainkan video
                const videoElement = document.createElement('video');
                videoElement.src = videoUrl;
                videoElement.controls = true;
                
                videoElement.style.width = '80%';
                videoElement.style.maxWidth = '100%';

                // Buat elemen audio untuk memainkan audio
                const audioElement = document.createElement('audio');
                audioElement.src = audioUrl;
                audioElement.controls = true;

                audioElement.style.width = '80%';
                audioElement.style.maxWidth = '100%';

                // Hapus semua elemen video dan audio yang ada di halaman sebelumnya, jika ada
                const existingMediaElements = document.querySelectorAll('video, audio');
                existingMediaElements.forEach(element => element.remove());

                // Tambahkan elemen video dan audio ke dalam halaman
     /*           document.body.appendChild(videoElement); 
                document.body.appendChild(audioElement);

                // Mulai memutar video
                videoElement.play();
                audioElement.play(); */
                
                responses.push(`<p class="result-heading">Memainkan video:</p><p>Silakan nikmati Video Dan Audionya</p>`);
                responses.push(videoElement.outerHTML);
                responses.push(audioElement.outerHTML);
                // Tampilkan semua respon
                displayResponses();
            })
            .catch(error => {
                console.error('Error fetching video:', error.message);
            });
    } catch (error) {
        console.error('Error playing video:', error.message);
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

            
        case 'halo':
        case 'hi':
        case 'hay':
        case 'salam':
        case 'test':
        case 'helo':
        case 'hey':
        case 'tes':
        case 'oi':
        case 'p':
            // Menampilkan respon yang sama dengan kata kunci
            responses.push(`<p class="result-heading">Ini adalah hasil dari ${command}:</p><p>${command} juga Kak!</p>`);
            displayResponses();
            break;
            
 case 'halaman':
 case 'help':
        case 'fitur':
        case 'menu':
    redirectToPage();
    break;

function redirectToPage() {
    // Ganti "halaman-baru.html" dengan nama file HTML halaman tujuan
    window.location.href = "help.html";
}
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
            window.location.href = "https://instagram.com/ivaannkan";
    
            break;
            
            case 'tiktok':
            window.location.href ="https://akuivan13.github.io/tiktokunduh/";
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
            case 'gpt':
    if (query !== '') {
        handleGPTCommand(query);
    } else {
        responses.push('<p class="result-heading">Mohon sertakan pertanyaan untuk menggunakan fitur GPT.</p>');
        displayResponses();
    }
    break;
            case 'vgpt':
            if (query !== '') {
                handleVGPTCommand(query);
            } else {
                responses.push('<p class="result-heading">Mohon sertakan pertanyaan untuk chat VGPT.</p>');
                displayResponses();
            }
            break;
    
        case 'van':
    if (query !== '') {
        handleVanQuestion(query);
    } else {
        responses.push('<p class="result-heading">Mohon sertakan pertanyaan tentang "van" untuk mendapatkan respon yang tepat.</p>');
        displayResponses();
    }
    break;
case 'play':
            if (query !== '') {
                handlePlayCommand(query);
            } else {
                responses.push('<p class="result-heading">Mohon sertakan judul lagu untuk memainkan lagu.</p>');
                displayResponses();
            }
            break;
            
case 'youtube2':
            if (query !== '') {
                handlePlayVideoCommand(query);
            } else {
                responses.push('<p class="result-heading">Mohon sertakan judul Youtube untuk memainkan YouTube.</p>');
                displayResponses();
            }
            break;            




// Menjalankan proses pengunduhan video saat kasus youtube2 dipicu dengan query yang diberikan pengguna
case 'youtube':
    if (query !== '') {
        handlePlayVideoLolhuman(query);
    } else {
        responses.push('<p class="result-heading">Mohon sertakan judul Youtube untuk memainkan YouTube.</p>');
        displayResponses();
    }
    break;


        
        
    

case 'meme':
    fetch('https://api.zenext.xyz/randomimage/memeindo?apikey=zenzkey_0f2e74746f')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch meme');
            }
            return response.blob(); // Mengambil respons sebagai blob (gambar)
        })
        .then(blob => {
            // Membuat URL objek untuk menampilkan gambar
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL meme
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.maxWidth = '100%';

            // Menambahkan gambar meme ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah meme random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching meme:', error.message);
            responses.push('<p class="result-heading">Maaf, gagal mengambil meme.</p>');
            displayResponses();
        });
    break;

case 'kpop':
    fetch('https://api.zenext.xyz/randomasupan/kpop?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL Kpop
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.maxWidth = '100%';

            // Menambahkan gambar Kpop ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah konten Kpop random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching Kpop content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten Kpop: ${error.message}</p>`);
            displayResponses();
        });
    break;
    
    case 'blackpink':
    fetch('https://api.zenext.xyz/randomasupan/kpop?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL Kpop
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.maxWidth = '100%';

            // Menambahkan gambar Kpop ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah konten Blackpink random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching Kpop content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten Kpop: ${error.message}</p>`);
            displayResponses();
        });
    break;
    
    case 'wallhp':
    fetch('https://api.zenext.xyz/randomimage/wallhp?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL Wallhp
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.maxWidth = '100%';

            // Menambahkan gambar Kpop ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah Wallpaper handphone :</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching Teknologi content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten Wallhp: ${error.message}</p>`);
            displayResponses();
        });
    break;
    
    case 'pubg':
    fetch('https://api.zenext.xyz/randomimage/pubg?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL Pubg
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.maxWidth = '100%';

            // Menambahkan gambar Kpop ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah konten Pubg random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching Kpop content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten Pubg: ${error.message}</p>`);
            displayResponses();
        });
    break;


    
      // Menambahkan fitur darkjokes ke dalam switch case
case 'darkjokes':
    fetch('https://api.zenext.xyz/randomimage/darkjoke?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL darkjokes
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.height = 'auto';

            // Menambahkan gambar darkjokes ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah gambar darkjokes random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching darkjokes content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten darkjokes: ${error.message}</p>`);
            displayResponses();
        });
    break;
      
     case 'kucing':
    fetch('https://api.zenext.xyz/randomimage/kucing?apikey=zenzkey_0f2e74746f')
        .then(response => response.blob())
        .then(blob => {
            // Membuat objek URL untuk blob yang diperoleh dari respons
            const imageUrl = URL.createObjectURL(blob);

            // Membuat elemen img
            const imgElement = document.createElement('img');
            // Mengatur sumber gambar dengan URL darkjokes
            imgElement.src = imageUrl;
            // Mengatur ukuran gambar
            imgElement.style.width = '50%';
            imgElement.style.height = 'auto';

            // Menambahkan gambar darkjokes ke dalam array responses
            responses.push(`<p class="result-heading">Ini adalah gambar kucing random:</p>`);
            responses.push(imgElement.outerHTML);
            // Menampilkan semua respons
            displayResponses();
        })
        .catch(error => {
            console.error('Error fetching darkjokes content:', error.message);
            responses.push(`<p class="result-heading">Gagal mengambil konten kucing: ${error.message}</p>`);
            displayResponses();
        });
    break;       

        


      
        default:
            responses.push('<p class="result-heading">Ini adalah hasil dari perintah yang tidak dikenali:</p><p>Pastikan Kamu Sudah Mengetik Dengan Benar 😇 , <strong><mark>Coba Ketik Fitur</mark></strong></p>');
            displayResponses();
    }

    inputText.value = '';
}

inputText.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        submitText();
    }
});
