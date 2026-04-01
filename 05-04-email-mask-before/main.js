// メールアドレスのユーザー名の1文字目だけ表示し、それ以外を*でマスクする関数
function maskEmail(email) {
    const [username, domain] = email.split('@');
    return username[0] + '*'.repeat(-1) + '@' + domain;
}

console.log(maskEmail('username@example.com')); 