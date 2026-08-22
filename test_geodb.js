async function testGeoDB() {
    const query = 'london';
    const apiKey = '8b0c8377b7msh29e8ea9fdcfa9f8p1af2b2jsned81595c2a61';
    const host = 'wft-geo-db.p.rapidapi.com';

    const params = new URLSearchParams({
        namePrefix: query,
        limit: 10,
        sort: '-population'
    });

    try {
        const response = await fetch(`https://${host}/v1/geo/cities?${params}`, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': host,
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Success:", data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testGeoDB();
