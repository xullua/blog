document.addEventListener('DOMContentLoaded', function() {
    const colors = {
        blue: [0, 0, 255],
        yellow: [255, 255, 0],
        red: [255, 0, 0],
        purple: [158, 0, 158],
        teal: [0, 128, 122]
    };

    const colorRadios = document.querySelectorAll('input[name="color"]');

    colorRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const selectedColor = this.value;
            if (selectedColor) {
                const [r, g, b] = colors[selectedColor];
                const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

                // 背景色の計算
                const background = prefersDarkMode 
                    ? `rgb(${r * 0.1}, ${g * 0.1}, ${b * 0.1})`
                    : `rgb(${r + (255 - r) * 0.9}, ${g + (255 - g) * 0.9}, ${b + (255 - b) * 0.9})`;

                // テキストカラーの計算 (ライトモード: 80%黒、ダークモード: 90%白混ぜ)
                const textColor = prefersDarkMode 
                    ? `rgb(${r + (255 - r) * 0.9}, ${g + (255 - g) * 0.9}, ${b + (255 - b) * 0.9})`  // 90%白
                    : `rgb(${r * 0.2}, ${g * 0.2}, ${b * 0.2})`;  // 80%黒

                document.documentElement.style.setProperty('--articleback', background);
                document.documentElement.style.setProperty('--articletext', textColor);
            }
        });
    });
});
