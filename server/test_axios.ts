import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testAxios() {
    const query = 'london';
    const apiKey = process.env.GEODB_API_KEY || '8b0c8377b7msh29e8ea9fdcfa9f8p1af2b2jsned81595c2a61';
    const host = process.env.GEODB_HOST || 'wft-geo-db.p.rapidapi.com';

    try {
        const response = await axios.get(`https://${host}/v1/geo/cities`, {
            params: {
                namePrefix: query,
                limit: 10,
                sort: '-population',
            },
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': host,
            },
            timeout: 3500,
        });
        console.log("Success with Axios:", response.data?.data?.length, "cities returned");
    } catch (err: any) {
        console.error("Axios Error:", err.message, err.response?.data);
    }
}

testAxios();
