// -----------------------------------------------
// カスタム例外クラスの定義
// -----------------------------------------------

// バリデーションエラーの基底クラス
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 必須項目が未入力の場合のエラークラス
class RequiredError extends ValidationError {
  constructor(field_name) {
    super(`${field_name}は必須項目です。`);
    this.name = 'RequiredError';
  }
}

// メールアドレスの形式が不正な場合のエラークラス
class EmailFormatError extends ValidationError {
  constructor() {
    super('メールアドレスの形式が正しくありません。');
    this.name = 'EmailFormatError';
  }
}

// 電話番号の桁数が不正な場合のエラークラス
class PhoneFormatError extends ValidationError {
  constructor() {
    super('電話番号は10桁または11桁の数字で入力してください。');
    this.name = 'PhoneFormatError';
  }
}

// 文字数が上限を超えた場合のエラークラス
class MaxLengthError extends ValidationError {
  constructor(field_name, max_length) {
    super(`${field_name}は${max_length}文字以内で入力してください。`);
    this.name = 'MaxLengthError';
  }
}

// -----------------------------------------------
// バリデーション関数
// -----------------------------------------------

// 名前の検証（必須チェック）
const validate_name = (name) => {
  if (!name || name.trim() === '') {
    throw new RequiredError('名前');
  }
};

// メールアドレスの検証（必須チェック・形式チェック）
const validate_email = (email) => {
  if (!email || email.trim() === '') {
    throw new RequiredError('メールアドレス');
  }
  // メールアドレスの形式を正規表現でチェック
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email_regex.test(email.trim())) {
    throw new EmailFormatError();
  }
};

// 電話番号の検証（必須チェック・桁数チェック）
const validate_phone = (phone) => {
  if (!phone || phone.trim() === '') {
    throw new RequiredError('電話番号');
  }
  // ハイフンやスペースを除いた数字のみで桁数をチェック
  const digits_only = phone.replace(/[-\s]/g, '');
  if (!/^\d{10,11}$/.test(digits_only)) {
    throw new PhoneFormatError();
  }
};

// 問い合わせ内容の検証（必須チェック・最大文字数チェック）
const validate_inquiry = (inquiry) => {
  if (!inquiry || inquiry.trim() === '') {
    throw new RequiredError('問い合わせ内容');
  }
  if (inquiry.length > 500) {
    throw new MaxLengthError('問い合わせ内容', 500);
  }
};

// -----------------------------------------------
// DOM 操作ユーティリティ
// -----------------------------------------------

// 指定した要素にエラーメッセージを表示し、入力欄に error クラスを付与する
const show_error = (field_id, error_id, message) => {
  const error_element = document.getElementById(error_id);
  const field_element = document.getElementById(field_id);
  if (error_element) {
    error_element.textContent = message;
  }
  if (field_element) {
    field_element.classList.add('error');
  }
};

// 全フィールドのエラーメッセージと error クラスをクリアする
const clear_errors = () => {
  const fields = [
    { field_id: 'name',    error_id: 'name_error' },
    { field_id: 'email',   error_id: 'email_error' },
    { field_id: 'phone',   error_id: 'phone_error' },
    { field_id: 'inquiry', error_id: 'inquiry_error' },
  ];
  fields.forEach(({ field_id, error_id }) => {
    const error_element = document.getElementById(error_id);
    const field_element = document.getElementById(field_id);
    if (error_element) error_element.textContent = '';
    if (field_element) field_element.classList.remove('error');
  });
  // 成功メッセージもクリア
  const success_element = document.getElementById('success_message');
  if (success_element) success_element.textContent = '';
};

// -----------------------------------------------
// フォーム送信イベントハンドラ
// -----------------------------------------------

// フォームの送信時に各入力値を検証する
const handle_submit = (event) => {
  // デフォルトのフォーム送信を防止
  event.preventDefault();

  // 前回のエラー表示をクリア
  clear_errors();

  // 各フィールドの入力値を取得
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const phone   = document.getElementById('phone').value;
  const inquiry = document.getElementById('inquiry').value;

  // バリデーションエラーの有無を管理するフラグ
  let has_error = false;

  // 名前のバリデーション
  try {
    validate_name(name);
  } catch (error) {
    show_error('name', 'name_error', error.message);
    has_error = true;
  }

  // メールアドレスのバリデーション
  try {
    validate_email(email);
  } catch (error) {
    show_error('email', 'email_error', error.message);
    has_error = true;
  }

  // 電話番号のバリデーション
  try {
    validate_phone(phone);
  } catch (error) {
    show_error('phone', 'phone_error', error.message);
    has_error = true;
  }

  // 問い合わせ内容のバリデーション
  try {
    validate_inquiry(inquiry);
  } catch (error) {
    show_error('inquiry', 'inquiry_error', error.message);
    has_error = true;
  }

  // エラーがなければ送信成功メッセージを表示
  if (!has_error) {
    const success_element = document.getElementById('success_message');
    success_element.textContent = '送信が完了しました。お問い合わせありがとうございます。';
  }
};

// -----------------------------------------------
// 問い合わせ内容の文字数カウンター
// -----------------------------------------------

// テキストエリアの入力に応じてカウンターの表示を更新する
const update_char_counter = () => {
  const inquiry_element  = document.getElementById('inquiry');
  const counter_element  = document.getElementById('inquiry_counter');
  const current_length   = inquiry_element.value.length;
  const max_length       = 500;

  counter_element.textContent = `${current_length} / ${max_length}`;

  // 上限を超えた場合は警告スタイルを適用
  if (current_length > max_length) {
    counter_element.classList.add('over-limit');
  } else {
    counter_element.classList.remove('over-limit');
  }
};

// -----------------------------------------------
// イベントリスナーの設定
// -----------------------------------------------

// フォーム送信イベントを登録
const contact_form = document.getElementById('contact_form');
contact_form.addEventListener('submit', handle_submit);

// 問い合わせ内容の文字数カウンターを入力のたびに更新
const inquiry_element = document.getElementById('inquiry');
inquiry_element.addEventListener('input', update_char_counter);
