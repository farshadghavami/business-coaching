import axios from 'axios';

const didApi = axios.create({
  baseURL: 'https://api.d-id.com',
  headers: {
    'Authorization': `Basic ${process.env.NEXT_PUBLIC_DID_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30 seconds timeout
});

export { didApi }; 