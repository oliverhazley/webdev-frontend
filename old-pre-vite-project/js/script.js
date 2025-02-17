document.getElementById('calculateBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    // Basic validation
    if (!weight || !height || weight <= 0 || height <= 0) {
        alert('Anna kelvolliset paino- ja pituusarvot.');
        return;
    }

    // Calculate BMI
    const bmi = weight / ((height / 100) ** 2);
    const roundedBmi = Math.round(bmi * 10) / 10;
    document.getElementById('bmiValue').textContent = roundedBmi;

    // Remove previous highlights
    document.getElementById('underweightRow').classList.remove('highlightBmi');
    document.getElementById('normalRow').classList.remove('highlightBmi');
    document.getElementById('overweightRow').classList.remove('highlightBmi');

    // Analysis & highlighting
    let analysisText = '';
    if (bmi < 19) {
        analysisText = 'Alipaino: Painoindeksisi on alle suositellun rajan. Keskustele tarvittaessa ammattilaisen kanssa.';
        document.getElementById('underweightRow').classList.add('highlightBmi');
    } else if (bmi >= 19 && bmi <= 24.9) {
        analysisText = 'Normaali: Painoindeksisi on välillä 19–24.9, joka on terveydelle ihanteellinen alue.';
        document.getElementById('normalRow').classList.add('highlightBmi');
    } else {
        analysisText = 'Ylipaino: Painoindeksisi on 25 tai enemmän. Pyri tasapainoiseen ruokavalioon ja liikuntaan.';
        document.getElementById('overweightRow').classList.add('highlightBmi');
    }

    // Display final message
    document.getElementById('analysisMessage').textContent = analysisText;
});
