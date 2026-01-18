import { jsPDF } from "jspdf";

export function generatePatientPDF(patient) {
    // Створюємо документ (за замовчуванням використовується шрифт Helvetica)
    const doc = new jsPDF();

    // === ДИЗАЙН ЗВІТУ (REPORT DESIGN) ===

    // Заголовок (Header)
    doc.setFontSize(18);
    doc.text('Patient Report', 105, 20, { align: 'center' });
    
    // Розділювальна лінія (Divider line)
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Налаштування основного тексту
    doc.setFontSize(12);
    
    const startX = 20;     // Відступ зліва для назв полів
    const valueX = 70;     // Відступ зліва для значень (щоб був рівний стовпчик)
    let currentY = 40;     // Початкова висота
    const lineHeight = 10; // Відстань між рядками

    // Масив даних для виводу (Label = Назва поля англійською)
    const data = [
        { label: "First Name",    value: patient.firstName },
        { label: "Last Name",     value: patient.lastName },
        { label: "Date of Birth", value: patient.birthDate },
        { label: "Gender",        value: patient.gender },
        { label: "Phone",         value: patient.phone || '-' },
        { label: "Height",        value: `${patient.height} cm` },
        { label: "Weight",        value: `${patient.weight} kg` },
        { label: "BMI",           value: patient.bmi },
        { label: "Notes",         value: patient.note || '-' },
        { label: "Report Date",   value: new Date().toLocaleString('en-US') }
    ];

    data.forEach(item => {
        // Малюємо назву поля (Label)
        doc.text(`${item.label}:`, startX, currentY);
        
        // Малюємо значення (Value)
        // Перевіряємо, щоб не було помилки, якщо значення відсутнє
        const valueText = item.value ? String(item.value) : '-';
        doc.text(valueText, valueX, currentY);
        
        currentY += lineHeight;
    });

    // Футер (Footer)
    doc.setFontSize(10);
    doc.setTextColor(150); // Сірий колір
    doc.text("Automatically generated system report", 105, 280, { align: 'center' });

    // Зберігаємо файл (Filename)
    doc.save(`${patient.lastName}_${patient.firstName}_Report.pdf`);
}
