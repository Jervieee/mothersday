const fineBtn = document.getElementById('fineBtn');
const notGoodBtn = document.getElementById('notGoodBtn');

// Not So Good button movement
let moving = false;
let moveInterval = null;
let stopTries = 0;

notGoodBtn.addEventListener('mouseenter', function () {
    if (stopTries < 3) {
        moving = true;
        moveButton();
    }
});

notGoodBtn.addEventListener('mouseleave', function () {
    moving = false;
    clearInterval(moveInterval);
    notGoodBtn.style.position = '';
    notGoodBtn.style.left = '';
    notGoodBtn.style.top = '';
});

notGoodBtn.addEventListener('click', function () {
    if (stopTries < 3) {
        stopTries++;
        if (stopTries >= 3) {
            moving = false;
            clearInterval(moveInterval);
            notGoodBtn.style.position = '';
            notGoodBtn.style.left = '';
            notGoodBtn.style.top = '';
        }
    }
    Swal.fire({
        title: 'Sending Love',
        html: "<b>If you feel Not so Good today, Mom...</b><br><br>I'm here to remind you that you are my everything. You make me proud by being so strong for us. Thank you for being our great soldier, for providing everything, and for your endless love. Even if I'm far away, I'm always your little 'ate'.<br><br><span style='color:#e75480;font-weight:bold;'>I love you Mama and I miss you so much! 💖</span>",
        icon: 'info',
        confirmButtonText: 'I love you too!',
        background: '#fff0f6',
        color: '#d72660',
        confirmButtonColor: '#e75480',
        customClass: {
            popup: 'swal2-rounded',
            confirmButton: 'swal2-btn-custom'
        }
    });
});

function moveButton() {
    notGoodBtn.style.position = 'relative';
    moveInterval = setInterval(() => {
        if (!moving) return;
        const x = Math.random() * 120 - 60;
        const y = Math.random() * 60 - 30;
        notGoodBtn.style.left = `${x}px`;
        notGoodBtn.style.top = `${y}px`;
    }, 180);
}

fineBtn.addEventListener('click', function () {
    Swal.fire({
        title: 'Happy Mothers Day!',
        html: `
            <div class='heart-bounce'>
                <div class='heart-anim'><div class='heart-shape'></div></div>
                <div class='sparkle sparkle1'></div>
                <div class='sparkle sparkle2'></div>
                <div class='sparkle sparkle3'></div>
            </div>
            <div style='margin-top:8px;'>
                <b>I love you mama</b>, thank you for being My Great Soldier, My Inspiration and My Everything.<br>
                Happy Mothers Day to my great Mom.<br>
                <span style='color:#e75480;font-weight:bold;'>I LOVE YOU WITH MY ALL HEART. 💖</span>
            </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'I love you too!',
        background: '#fff0f6',
        color: '#d72660',
        confirmButtonColor: '#e75480',
        customClass: {
            popup: 'swal2-rounded',
            confirmButton: 'swal2-btn-custom'
        }
    });
});
