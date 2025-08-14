import { getApiEndpoint } from '../services/env-config.js';

export default async function register(userData){
    try {
        console.log(`[DEBUG] Register attempt with userData:`, userData);
        
        // 動的なAPIエンドポイントを取得
        const apiUrl = getApiEndpoint();
        console.log(`[DEBUG] Using API endpoint:`, apiUrl);
        
        // 直接axiosで登録APIを呼び出す
        const payload = {
            username: userData.email || "test@example.com",
            email: userData.email || "test@example.com",
            password: userData.password || "testpass123",
            full_name: userData.name || "Test User",
            birth_date: userData.birthdate || "1990-01-01",
            konkatsu_status: userData.konkatsuStatus || "beginner",
            occupation: userData.occupation || "",
            birth_place: userData.birthplace || "",
            location: userData.location || "",
            hobbies: userData.hobbies || "",
            weekend_activity: userData.holidayStyle || ""
        };
        
        console.log(`[DEBUG] Sending payload:`, payload);
        console.log(`[DEBUG] Request URL:`, `${apiUrl}/api/auth/register`);
        
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',  // Cookie認証を使う場合
            body: JSON.stringify(payload)
        });
        
        // ネットワークは成功でもHTTPエラーはここで拾う
        if (!response.ok) {
            const text = await response.text();
            console.error(`[DEBUG] HTTP Error ${response.status}:`, text);
            throw new Error(`HTTP ${response.status}: ${text}`);
        }
        
        console.log(`[DEBUG] Response status:`, response.status);
        console.log(`[DEBUG] Response headers:`, Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log(`[DEBUG] Registration success:`, data);
            
            // 🔥 CRITICAL FIX: 登録成功時にトークンとユーザー情報をローカルストレージに保存
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                console.log('[DEBUG] Token saved to localStorage:', data.access_token.substring(0, 20) + '...');
            }
            
            // ユーザー情報もローカルストレージに保存
            const userInfo = {
                id: data.user?.id || data.id,
                name: userData.name || userData.full_name,
                username: userData.email,
                email: userData.email
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            console.log('[DEBUG] User info saved to localStorage:', userInfo);
            
            // hobbies文字列を配列に変換してプロフィール作成
            const { createOrUpdateProfile } = await import('../services/profileAPI');
            const hobbiesArray = userData.hobbies 
                ? userData.hobbies.split(/[,、\s]+/).filter(h => h.trim()) 
                : [];
            
            await createOrUpdateProfile({
                hometown: userData.birthplace || "",
                hobbies: hobbiesArray
            });
            
            return { 
                success: true, 
                data: data 
            };
        } else {
            const errorData = await response.text();
            console.error(`[DEBUG] Registration failed:`, errorData);
            return { 
                success: false, 
                error: `登録に失敗しました (${response.status}): ${errorData}` 
            };
        }
        
    } catch (error) {
        // TypeError: Failed to fetch はここに来る（CORS/ネットワーク/SSLなど）
        console.error('[DEBUG] register() failed:', error);
        console.error('[DEBUG] Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        
        return { 
            success: false, 
            error: `ネットワークエラー: ${error.message}` 
        };
    }
}