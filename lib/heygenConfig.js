import axios from 'axios';

const heygenApi = axios.create({
  baseURL: 'https://api.heygen.com',
  headers: {
    'Authorization': `Bearer MTg0YTU0YTFiOGY2NDNkODhkN2FjYTkxOTc3YzA3NzMtMTc0Mzg0NzY2OA==`,
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30 seconds timeout
});

export { heygenApi }; 