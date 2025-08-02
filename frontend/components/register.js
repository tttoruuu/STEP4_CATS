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
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/register', 
        {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(payload),
        }
    );
    
    if (res.ok) {
        const data = await res.json();
        return { success: true, data };
    } else {
        const errorData = await res.json();
        return { 
            success: false, 
            error: errorData.detail || '登録に失敗しました'
        };
    }
}