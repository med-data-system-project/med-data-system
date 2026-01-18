// Отримуємо доступ до бібліотеки jsPDF
const { jsPDF } = window.jspdf;

// --- ЧАСТИНА 1: Функція створення PDF ---
function generatePatientPDF(patient) {
    const doc = new jsPDF();

    // === Активація українського шрифту ===
    // (Працює завдяки підключеному файлу Roboto-Regular-normal.js)
    doc.setFont("Roboto-Regular"); 

    // === ДИЗАЙН ЗВІТУ ===

    // Заголовок
    doc.setFontSize(18);
    doc.text('Звіт про пацієнта', 105, 20, { align: 'center' });
    
    // Розділювальна лінія
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Налаштування основного тексту
    doc.setFontSize(12);
    
    const startX = 20;     
    const valueX = 70;     
    let currentY = 40;     
    const lineHeight = 10; 

    // Масив даних
    const data = [
        { label: "Ім’я",             value: patient.firstName },
        { label: "Прізвище",         value: patient.lastName },
        { label: "Дата народження",  value: patient.birthDate },
        { label: "Стать",            value: patient.gender },
        { label: "Телефон",          value: patient.phone || '-' },
        { label: "Зріст",            value: `${patient.height} см` },
        { label: "Вага",             value: `${patient.weight} кг` },
        { label: "ІМТ",              value: patient.bmi },
        { label: "Коментар",         value: patient.note || '-' },
        { label: "Дата звіту",       value: new Date().toLocaleString('uk-UA') }
    ];

    data.forEach(item => {
        // Малюємо назву
        doc.text(`${item.label}:`, startX, currentY);
        
        // Малюємо значення
        const valueText = item.value ? String(item.value) : '-';
        doc.text(valueText, valueX, currentY);
        
        currentY += lineHeight;
    });

    // Футер
    doc.setFontSize(10);
    doc.setTextColor(150); 
    doc.text("Згенеровано автоматично системою обліку", 105, 280, { align: 'center' });

    // Зберігаємо файл
    doc.save(`${patient.lastName}_${patient.firstName}_звіт.pdf`);
}

// --- ЧАСТИНА 2: Логіка роботи форми (index.html) ---

const patientForm = document.getElementById('patient-form');
const successSection = document.getElementById('success-section');
const generatePdfBtn = document.getElementById('generate-pdf');
let currentPatientData = null;

// 1. Коли натискаємо "Зберегти"
if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Зупиняємо перезавантаження сторінки
        
        const formData = new FormData(patientForm);
        
        // Розрахунок ІМТ (BMI)
        const weight = parseFloat(formData.get('weight'));
        const height = parseFloat(formData.get('height')) / 100; // переводимо см у метри
        let bmi = '-';
        
        if (weight > 0 && height > 0) {
            bmi = (weight / (height * height)).toFixed(1);
        }

        // Зберігаємо дані в змінну
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

        // Показуємо кнопку для скачування PDF
        successSection.style.display = 'block';
        alert("Дані пацієнта збережено! Тепер ви можете завантажити PDF.");
    });
}

// 2. Коли натискаємо "Отримати звіт (PDF)"
if (generatePdfBtn) {
    generatePdfBtn.addEventListener('click', () => {
        if (currentPatientData) {
            generatePatientPDF(currentPatientData);
        } else {
            alert("Спочатку заповніть форму та натисніть 'Зберегти'");
        }
    });
}
