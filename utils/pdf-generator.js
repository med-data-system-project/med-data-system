const { jsPDF } = window.jspdf;

function generatePatientPDF(patient) {
    const doc = new jsPDF();

    // === ПІДКЛЮЧЕННЯ ШРИФТУ ===
    // Беремо дані з файлу font-data.js
    if (window.myUkrFont) {
        doc.addFileToVFS("Roboto-Regular.ttf", window.myUkrFont);
        doc.addFont("Roboto-Regular.ttf", "Roboto-Regular", "normal");
        doc.setFont("Roboto-Regular");
    } else {
        alert("Помилка: Шрифт не знайдено! Перевірте font-data.js");
        return; 
    }

    // === ДИЗАЙН ===
    doc.setFontSize(18);
    doc.text('Звіт про пацієнта', 105, 20, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);

    const startX = 20; valueX = 70; let currentY = 40; const lineHeight = 10;

    const data = [
        { label: "Ім’я", value: patient.firstName },
        { label: "Прізвище", value: patient.lastName },
        { label: "Дата народження", value: patient.birthDate },
        { label: "Стать", value: patient.gender },
        { label: "Телефон", value: patient.phone || '-' },
        { label: "Зріст", value: `${patient.height} см` },
        { label: "Вага", value: `${patient.weight} кг` },
        { label: "ІМТ", value: patient.bmi },
        { label: "Коментар", value: patient.note || '-' },
        { label: "Дата звіту", value: new Date().toLocaleString('uk-UA') }
    ];

    data.forEach(item => {
        doc.text(`${item.label}:`, startX, currentY);
        doc.text(item.value ? String(item.value) : '-', valueX, currentY);
        currentY += lineHeight;
    });

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Згенеровано автоматично", 105, 280, { align: 'center' });

    doc.save(`${patient.lastName}_звіт.pdf`);
}

// ... (решта коду обробки форми залишається без змін) ...
// (Код обробки кнопок, який я надавав у попередньому повідомленні)
const patientForm = document.getElementById('patient-form');
const successSection = document.getElementById('success-section');
const generatePdfBtn = document.getElementById('generate-pdf');
let currentPatientData = null;

if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(patientForm);
        const weight = parseFloat(formData.get('weight'));
        const height = parseFloat(formData.get('height')) / 100;
        let bmi = (weight > 0 && height > 0) ? (weight / (height * height)).toFixed(1) : '-';

        currentPatientData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            birthDate: formData.get('birthDate'),
            gender: formData.get('gender'),
            phone: formData.get('phone'),
            height: formData.get('height'),
            weight: formData.get('weight'),
            note: formData.get('note'),
            bmi: bmi
        };
        successSection.style.display = 'block';
        alert("Дані збережено!");
    });
}

if (generatePdfBtn) {
    generatePdfBtn.addEventListener('click', () => {
        if (currentPatientData) generatePatientPDF(currentPatientData);
    });
}
