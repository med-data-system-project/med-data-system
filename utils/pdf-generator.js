import { jsPDF } from "jspdf";

// КРОК 1: Вам потрібен довгий Base64-рядок файлу шрифту .ttf, що підтримує кирилицю (наприклад, Roboto-Regular).
// Ви можете згенерувати його тут: https://rawgit.com/MrRio/jsPDF/master/fontconverter/fontconverter.html
// Скопіюйте отриманий рядок і вставте змінну нижче.
const myFontBase64 = "ВАШ_ДОВГИЙ_BASE64_РЯДОК_ТУТ..."; 

export function generatePatientPDF(patient) {
    const doc = new jsPDF();

    // КРОК 2: Додаємо шрифт у віртуальну файлову систему jsPDF
    doc.addFileToVFS("Roboto-Regular.ttf", myFontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto"); // Активуємо шрифт

    // === ДИЗАЙН ЗВІТУ ===

    // Заголовок
    doc.setFontSize(18);
    doc.text('Звіт про пацієнта', 105, 20, { align: 'center' }); // Центрування
    
    // Розділювальна лінія
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Основний текст
    doc.setFontSize(12);
    
    const startX = 20;
    const valueX = 70; // Відступ для значень, щоб вони були рівно в стовпчик
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
        // Малюємо назву поля (можна додати жирний шрифт, якщо завантажити Roboto-Bold)
        doc.text(`${item.label}:`, startX, currentY);
        
        // Малюємо значення
        doc.text(`${item.value}`, valueX, currentY);
        
        currentY += lineHeight;
    });

    // Футер (опціонально)
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Згенеровано автоматично системою обліку", 105, 280, { align: 'center' });

    doc.save(`${patient.lastName}_${patient.firstName}_звіт.pdf`);
}
