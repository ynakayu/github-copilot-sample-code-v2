// 1から6のサイコロを1回振って結果を返す関数
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

console.log(`サイコロの目: ${rollDie()}`);