const slides = document.querySelector('.slides'); // スライド全体をまとめているdiv
const images = document.querySelectorAll('.slides img'); // スライド内の画像をすべて取得

let index = 0; // 今どの画像を表示しているか（0 = 最初の画像）

// 最初の画像を複製して最後に追加（ループするため）
const firstClone = images[0].cloneNode(true);
slides.appendChild(firstClone);

const total = images.length + 1; // 画像の合計（複製分を足す）

// スライドを移動する関数
function moveToSlide() {
    slides.style.transition = "transform 1s ease-in-out"; // アニメーション有効
    slides.style.transform = `translateX(${-index * 100}vw)`; // indexに応じて横に移動
}

// 次の画像へ
function nextSlide() {
    index++; // 画像番号を1つ進める
    moveToSlide();

    // 最後（複製画像）に来たら一瞬で最初に戻す
    if (index === total - 1) {
        setTimeout(() => {
            slides.style.transition = "none"; // アニメーションを切る
            slides.style.transform = "translateX(0)"; // 一瞬で最初に戻す
            index = 0; // カウンターをリセット
        }, 1000); // 1秒待ってから戻す
    }
}



// 自動再生（4秒ごとに次の画像へ）
setInterval(nextSlide, 3000);



// スライド画像をタッチ（クリック）したら別のページへジャンプ
document.querySelectorAll('.slides img').forEach((img, idx) => {
    img.style.cursor = "pointer"; // カーソルをポインターに
    img.addEventListener('click', () => {
        // 画像ごとにジャンプ先を設定
        if (idx === 0) {
            window.location.href = "kobe.html"; // 1枚目なら神戸ページ
        } else if (idx === 1) {
            window.location.href = "shibuya.html"; // 2枚目なら渋谷ページ
        }
        // 画像が増えた場合はelse ifで追加
    });
});

