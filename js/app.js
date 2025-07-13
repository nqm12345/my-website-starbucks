let list = document.querySelectorAll('.carousel__list .carousel__item');
let carousel = document.querySelector('.carousel');
let dots = document.querySelectorAll('.carousel__dot');
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('prev');

let lastPosition = list.length - 1;
let active = 0;
let zIndex = 2;

nextBtn.onclick = () => {
    let newValue = active + 1 > lastPosition ? 0 : active + 1;
    setItemActive(newValue, showSlider);
};

prevBtn.onclick = () => {
    let newValue = active - 1 < 0 ? lastPosition : active - 1;
    setItemActive(newValue, showSlider);
};

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        setItemActive(index, showSlider);
    });
});

const setItemActive = (newValue, callbackFunction) => {
    if (newValue === active) return;
    let type = newValue > active ? 'next' : 'prev';
    active = newValue;
    callbackFunction(type);
};

let removeEffect;
let autoRun = setTimeout(() => {
    nextBtn.click();
}, 5000);

const showSlider = (type) => {
    carousel.style.pointerEvents = 'none';

    // remove old active item
    let itemActiveOld = document.querySelector('.carousel__item.carousel__item--active');
    if (itemActiveOld) itemActiveOld.classList.remove('carousel__item--active');

    zIndex++;
    list[active].style.zIndex = zIndex;
    list[active].classList.add('carousel__item--active');

    // apply slide direction
    if (type === 'next') {
        carousel.style.setProperty('--transform', '300px');
    } else {
        carousel.style.setProperty('--transform', '-300px');
    }

    carousel.classList.add('carousel--effect');

    // update active dot
    let dotActiveOld = document.querySelector('.carousel__dot.carousel__dot--active');
    if (dotActiveOld) dotActiveOld.classList.remove('carousel__dot--active');
    dots[active].classList.add('carousel__dot--active');

    clearTimeout(removeEffect);
    removeEffect = setTimeout(() => {
        carousel.classList.remove('carousel--effect');
        carousel.style.pointerEvents = 'auto';
    }, 1500);

    clearTimeout(autoRun);
    autoRun = setTimeout(() => {
        nextBtn.click();
    }, 5000);
};
