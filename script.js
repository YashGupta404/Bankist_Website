'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const section1 = document.querySelector('#section--1');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling to section 1
btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' }); // Smooth behavior is not working
});

// Page navigation
// We need to add the event to the entire parent container so that when the event is captured at any
// target element inside the container then it will bubble and will execute at the parent element.
//This is called Event Delegation. To do this we need to do these 2 steps :

// 1. Add event to the parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // 2. Determine from which element the event was captured and match only those child elements that
  // we want through the matching

  if (e.target.classList.contains('nav__link')) {
    const idOfSection = e.target.getAttribute('href');

    //e = event(here click)||target = element where event was captured(here element clicked)||id = id of section||this = the current element in a function where the function will be executed

    console.log(idOfSection);
    document.querySelector(idOfSection).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed components
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

//Event delegation
tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause it will retun nothing and the rest of the code will not be executed
  if (!clicked) return; // To avoid clicks other than tabs

  // Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  tabContents.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// HandleOver function
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(s => {
      if (s !== link) {
        s.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

//Menu fade animation when MOUSEOVER
const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', handleOver.bind(0.5));

//Menu fade animation when MOUSEOUT
nav.addEventListener('mouseout', handleOver.bind(1));
//bind function returns a copied function of a called function and sets value of this variable inside that
//function to the argument passed in

// Intersection observer api to implement stickyNavigation(reload page if not working)
// Callback function
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // height of the nav element
// console.log(navHeight);
const stikyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry); //To display and check entries
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};
const observerOptions = {
  root: null, //root means from where the obsever will oberve the header(or any object)
  threshold: 0, //means how much to observe (will be decimal) 0 means will observe only the entry and exit
  //1 means entire object or element to be observed will be viewed.
  //can include an array of values as well.
  rootMargin: `-${navHeight}px`, // This means the margin where observing should end (here navHeight) before header end.
  //
};

const headerOberver = new IntersectionObserver(stikyNav, observerOptions); //Api requiring callback function and observer options
headerOberver.observe(header);

// Reveal Sections
//Callback function
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;
  else {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
    //This is done so that if network if slow, the img will be fully displayed once it is completely downloaded or loaded
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});
imgTargets.forEach(i => {
  imgObserver.observe(i);
});

// Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

let curSlide = 0; // Current slide
const maxSlide = slides.length; // Maximum number of slides

// Function to go to slides or change slides
const goToSlide = function (cur) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - cur)}%)`;
  });
};
goToSlide(curSlide); // To separate the slides clustered together
//Functions to go to next or previous slides
const goNext = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
const goPrevious = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
btnLeft.addEventListener('click', goPrevious);
btnRight.addEventListener('click', goNext);

// Implementing the left and right arrow keys to change slider
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') goPrevious();
  e.key === 'ArrowRight' && goNext();
});

// Implementing dots

const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button  class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();
activateDot(0);
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

// Activate dot
function activateDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}
