// Якщо ви використовуєте звичайний <script src="script.js">, залиште цей рядок:
const { jsPDF } = window.jspdf;

// Якщо ви використовуєте модулі (import), розкоментуйте наступний рядок:
// import { jsPDF } from "jspdf"; 

export function generatePatientPDF(patient) {
    const doc = new jsPDF();

    // === КРОК 1: Активуємо український шрифт ===
    // Це працює, бо ви додали <script src="Roboto-Regular-normal.js"> в HTML
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

    // Масив даних (Переклав назви полів українською)
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
        // Малюємо назву поля
        doc.text(`${item.label}:`, startX, currentY);
        
        // Малюємо значення
        const valueText = item.value ? String(item.value) : '-';
        doc.text(valueText, valueX, currentY);
        
        currentY += lineHeight;
    });

    // Футер
    doc.setFontSize(10);
    doc.setTextColor(150); // Сірий колір
    doc.text("Згенеровано автоматично системою обліку", 105, 280, { align: 'center' });

    // Зберігаємо файл (Назва файлу теж може бути кирилицею)
    doc.save(`${patient.lastName}_${patient.firstName}_звіт.pdf`);
}
