import axios from 'axios';
import { getApiEndpoint } from '../services/env-config';

export default async function login(email, password){
    console.log(`try to login with ${email} and ${password}`);
    
    try {
        const API_BASE_URL = getApiEndpoint();
        const response = await axios.post(`${API_BASE_URL}/login`, 
            { username: email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false, // CORS対応
                timeout: 10000
            }
        );
        
        if (response.data && response.data.access_token) {
            return { 
                success: true, 
                data: response.data 
            };
        } else {
            return { 
                success: false, 
                error: 'ログインレスポンスが無効です'
            };
        }
        
    } catch (error) {
        console.error('Login API error:', error);
        
        if (axios.isAxiosError(error)) {
            if (error.response?.data?.error?.message) {
                return { 
                    success: false, 
                    error: error.response.data.error.message 
                };
            }
            if (error.response?.data?.detail) {
                return { 
                    success: false, 
                    error: error.response.data.detail 
                };
            }
            if (error.code === 'ECONNABORTED') {
                return { 
                    success: false, 
                    error: 'サーバーへの接続がタイムアウトしました' 
                };
            }
            if (error.message.includes('Network Error')) {
                return { 
                    success: false, 
                    error: 'ネットワーク接続に問題があります' 
                };
            }
        }
        
        return { 
            success: false, 
            error: 'ログインに失敗しました'
        };
    }
}