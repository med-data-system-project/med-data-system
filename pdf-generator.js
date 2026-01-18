const { jsPDF } = window.jspdf;

// Прибрали слово export, щоб функція була доступна глобально
function generatePatientPDF(patient) {
    const doc = new jsPDF();

    // === ПІДКЛЮЧЕННЯ ШРИФТУ ===
    // Беремо дані з глобальної змінної window.myUkrFont (з файлу font-data.js)
    if (window.myUkrFont) {
        try {
            doc.addFileToVFS("Roboto-Regular.ttf", window.myUkrFont);
            doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
            doc.setFont("Roboto");
        } catch (e) {
            console.error("Помилка додавання шрифту:", e);
            alert("Помилка шрифту. Звіт буде згенеровано стандартним шрифтом.");
        }
    } else {
        alert("Увага: Шрифт не знайдено у font-data.js");
    }

    // === ДИЗАЙН ===
    doc.setFontSize(18);
    doc.text('Звіт про пацієнта', 105, 20, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    doc.setFontSize(12);

    const startX = 20; 
    const valueX = 70; 
    let currentY = 40; 
    const lineHeight = 10;

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
