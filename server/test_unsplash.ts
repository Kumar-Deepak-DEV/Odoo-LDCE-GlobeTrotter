import axios from 'axios';

async function testUnsplash() {
    const key = 'yHffHFyWZzx71fHmtn7YHN-xrTJaScXykub_pqKnG90';
    try {
        const res = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: { query: `Patna city landmarks`, orientation: 'landscape', per_page: 1 },
            headers: { Authorization: `Client-ID ${key}` },
        });
        console.log("Unsplash works!", res.data.results?.[0]?.urls?.regular);
    } catch (e: any) {
        console.error("Unsplash error:", e.response?.status, e.response?.data);
    }
}

testUnsplash();
