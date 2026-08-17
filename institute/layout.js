async function includeLayout() {
    try {
        const hRes = await fetch('header.html');
        const hData = await hRes.text();
        document.body.insertAdjacentHTML('afterbegin', hData);

        const fRes = await fetch('footer.html');
        const fData = await fRes.text();
        document.body.insertAdjacentHTML('beforeend', fData);

        initEliteMenu();
    } catch (err) {
        console.error("Layout Injection Failed:", err);
    }
}

function initEliteMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!mobileToggle) return;

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const spans = mobileToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

function logout() {
    localStorage.clear();
    location.href = "../login.html";
}

includeLayout();