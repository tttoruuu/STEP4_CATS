import { getApiEndpoint } from '../services/env-config';

export default async function register(userData){
    const payload = {
        username:         userData.email,           // emailをusernameとして使用
        full_name:        userData.name,           // バックエンドの期待フィールド名
        email:            userData.email,
        password:         userData.password,       // バックエンドの期待フィールド名
        birth_date:       userData.birthdate,      // camel → snake
        konkatsu_status:  userData.konkatsuStatus,
        occupation:       userData.occupation ?? "",
        birth_place:      userData.birthplace ?? "",
        location:         userData.location ?? "",
        hobbies:          userData.hobbies ?? "",
        weekend_activity: userData.holidayStyle ?? "",
    };
    console.log(`try to register with ${JSON.stringify(payload)}`);
    const apiUrl = getApiEndpoint();
    console.log(`API URL: ${apiUrl}`);
    const fullUrl = `${apiUrl}/register`;
    console.log(`Full registration URL: ${fullUrl}`);
    
    const res = await fetch(fullUrl, 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        }
    );
    
    if (res.ok) {
        const data = await res.json();
        return { success: true, data };
    } else {
        console.error(`Registration failed with status: ${res.status}`);
        try {
            const errorData = await res.json();
            console.error('Error response:', errorData);
            // エラーレスポンスの形式に対応
            const errorMessage = errorData.error?.message || errorData.detail || '登録に失敗しました';
            return { 
                success: false, 
                error: errorMessage
            };
        } catch (e) {
            console.error('Failed to parse error response:', e);
            return { 
                success: false, 
                error: '登録に失敗しました'
            };
        }
    }
}