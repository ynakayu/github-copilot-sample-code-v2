const RATE_JPY_TO_USD = 0.0067;

const jpyInput = document.getElementById("jpyInput");
const convertButton = document.getElementById("convertButton");
const result = document.getElementById("result");
const error = document.getElementById("error");

const validateInput = (rawValue) => {
	if (rawValue.trim() === "") {
		return "金額を入力してください。";
	}

	const value = Number(rawValue);

	if (!Number.isFinite(value)) {
		return "数値を入力してください。";
	}

	if (value < 0) {
		return "0以上の金額を入力してください。";
	}

	return null;
};

const convertCurrency = () => {
	const rawValue = jpyInput.value;
	const validationError = validateInput(rawValue);

	if (validationError) {
		error.textContent = validationError;
		result.textContent = "";
		return;
	}

	const jpy = Number(rawValue);
	const usd = jpy * RATE_JPY_TO_USD;

	error.textContent = "";
	result.textContent = `${jpy.toLocaleString("ja-JP")} JPY = ${usd.toFixed(2)} USD`;
};

convertButton.addEventListener("click", convertCurrency);

jpyInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		convertCurrency();
	}
});
