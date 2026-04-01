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
    const lengthInput = document.getElementById('passwordLength');
    const countInput = document.getElementById('passwordCount');
    const passwordDisplay = document.getElementById('passwordDisplay');

    const length = Number(lengthInput.value);
    const count = Number(countInput.value);

    if (!Number.isInteger(length) || length < 1) {
        alert('桁数は1以上の整数を入力してください。');
        return;
    }

    if (!Number.isInteger(count) || count < 1) {
        alert('個数は1以上の整数を入力してください。');
        return;
    }

    passwordDisplay.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = generatePassword(length);
        passwordDisplay.appendChild(listItem);
    }
}