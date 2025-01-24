const scriptURL = 'https://script.google.com/macros/s/AKfycbxHWPFh63FxGWI22z0CBoHy6flAyuu_w24ikrbtqVdaa6Glfz-2I0jOjlDrLaF-5HWL/exec';
const form = document.forms['contact-form'];

form.addEventListener('submit', async e => {
    e.preventDefault();

    // Majburiy maydonlarni tekshirish
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim() || input.value === "0") {
            isValid = false;
            input.style.border = "2px solid red"; // Xatolik bo‘lsa, chegarani qizil qiling
        } else {
            input.style.border = ""; // Xato bo‘lmasa, chegarani olib tashlang
        }
    });

    if (!isValid) {
        alert("Iltimos, barcha majburiy maydonlarni to‘ldiring!");
        return;
    }

    // Yuborish tugmasini va matnni ko‘rsatish
    const submitButton = form.querySelector('input[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Yuborilmoqda... / Загружается...";

    // Ekran hiralashishi uchun
    document.body.style.opacity = "0.5";  // Ekranni shaffof qilish
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = "Yuborilmoqda... / Загружается...";
    loadingMessage.style.position = "fixed";
    loadingMessage.style.top = "50%";
    loadingMessage.style.left = "50%";
    loadingMessage.style.transform = "translate(-50%, -50%)";
    loadingMessage.style.fontSize = "24px";
    loadingMessage.style.color = "#000000";
    loadingMessage.style.zIndex = "1000";
    document.body.appendChild(loadingMessage);

    // Form ma'lumotlarini yuborish
    try {
        const formData = new FormData(form);
        formData.append('unique_id', Date.now()); // Har bir yuborishga noyob identifikator qo‘shish

        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        const result = await response.json();

        if (result.result === 'success') {
            // Yuborish muvaffaqiyatli bo'lsa, sahifa o'zgartirish
            setTimeout(() => {
                window.open('index2.html', '_parent');
            }, 1000);  // 1 soniya kutib keyin ochish
        } else {
            alert("Xatolik yuz berdi: " + (result.message || "Noma'lum xatolik!"));
        }
    } catch (error) {
        console.error('Error!', error.message);
        alert("Ma'lumot yuborishda xatolik yuz berdi!");
    } finally {
        // Yuborish tugmasini qayta yoqish
        submitButton.disabled = false;
        submitButton.textContent = "Yuborish";
        document.body.style.opacity = "1"; // Ekranni asl holatiga qaytarish
        document.body.removeChild(loadingMessage);  // Yuborish matnini olib tashlash
    }
});
