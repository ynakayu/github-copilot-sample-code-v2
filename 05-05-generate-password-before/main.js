// シンプルなパスワードジェネレーター
function generatePassword(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}

// 生成されたパスワードを画面に表示
function displayPassword() {
    const password = generatePassword(12);
    document.getElementById('passwordDisplay').innerText = password;
}