'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// how to use an Event listener in forEach method
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation ----------
document.querySelectorAll('.nav__link').forEach(function (el) {
  // instead of doing this in each button
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // add the addEventlistener to his parent and filter the children element
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

///////////////////////////////////////////////
// tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    //the this keyword will be this value that you use in the bind method
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: intersection observer api
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    // when this image change, it will emit this load event, and only when change the image, here will executed the exit of the blur in the image
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    // entry.target.classList.remove('lazy-img'); // if you d othis, first the blur will get out, and then you will see the image changing
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  // functions
  const createDots = function () {
    slides.forEach((_, i) => {
      //each slide will receive this element as a child
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `
    <button class="dots__dot" data-slide="${i}"></button>
    `
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  let curSlide = 0;
  let maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${i - slide}00%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;

    curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// Selecing Elements -----------------------------------------------------------
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header'); // this will return the first element in this selector here
const allSections = document.querySelectorAll('.section'); // this is a node list
console.log(allSections);

document.getElementById('section--1'); // only in querySelector we have to use the selector of the class/id name
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
// this method return a HTMLCollection, that's different from node list, because if the DOM changes, this collection is automatically updated.
console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// .insetAdjacentHTML  - some times this is useful to create the element from scratch
const message = document.createElement('div'); // you are creating a div here
message.classList.add('cookie-message');
message.innerHTML = // we can use this property to read and set content
  'we use cookies for improve funcionality and analytics. <button class="btn btn--close-cookie"> Got it! </button>';
// the element was already inseted here in the prepend, so with the append you are just moving the element
header.prepend(message); // prepend adds the element as the FIRST child of this element
header.append(message); // append adds the element as the LAST child of this element
header.append(message.cloneNode(true)); // here you are cloning the element and using the same element in different palces

header.before(message); // add the element BEFORE the header
header.after(message); // add the element AFTER the header

// // Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });v

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '100%';

getComputedStyle(message).height; // use this get the value of the element selector

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // increasing the value in 30 px

document.documentElement.style.setProperty('--color-primary', 'orangered'); // here you are changing the value of the ':root'

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo'; // updating the attribute

// Non-standard
console.log(logo.desiner);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// the difference between getAttribute and this thing
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data  attributes
console.log(logo.dataset.versionNumber); //with data attributes, you need use this, and here you use camelCase

// Classes
logo.classList.add('c', 'a'); // you can add one or more classes
logo.classList.remove('c', 'a'); // you can add one or more classes
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use
logo.className = 'jonas';


// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
// console.log(s1coords);
// console.log(e.target.getBoundingClientRect());

// console.log('current scroll x/y', window.pageXOffset, pageYOffset);

// console.log(
//   'height/width viewport',
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );

// // Scrolling
// window.scrollTo(s1coords);

// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );
// old school
//   window.scrollTo({
//     left: s1coords.left + window.pageXOffset,
//     top: s1coords.top + window.pageYOffset,
//     behavior: 'smooth',
//   });

//   // more modern way
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('alert message');
// };
// h1.addEventListener('mouseenter', alertH1); // this is a standard way

// // h1.onmouseenter = function (e) {
// //   // this is a old school way
// //   alert('omg gu');
// // };

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000); //to remove an EventListener

// rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () => `rgb(${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

const h1 = document.querySelector('h1');

// Goin downwards: child
console.log(h1.querySelectorAll('.highlight')); // this returns the child of h1 with this class
console.log(h1.childNodes); // this is no that used
console.log(h1.children); //this works only for direct children, and returns a list with every children in h1
h1.firstElementChild.style.color = 'white'; //the name already says everything
h1.lastElementChild.style.color = 'darkgray';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);
h1.closest('.header').style.background = 'darkgray'; // the closest is like querySelector, it will search for a parent with this class or id, no matter how far up in the DOM tree.
h1.closest('h1').style.background = 'var(--gradient-primary)'; // this will select the own h1

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previouSibling);
console.log(h1.nextSibling);
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
