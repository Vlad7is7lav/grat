class VS_slider {
  constructor(options = {}) {
    this.mainClass = options.mainClass || '.slider';
    this.pos = options.pos || 1;
    this.isCycling = options.isCycling || true;

    this.slider = document.querySelector(this.mainClass);
    this.sliderWrap = document.querySelector('.slider-wrap');
    this.sliderWrapWidth = this.sliderWrap.getBoundingClientRect().width;
    this.itemsBox = document.querySelector('.slider-items');
    this.imgChildren = this.itemsBox.getElementsByTagName('IMG');

    this.prev_control = document.querySelector('.slider-pointer-left'); // move slide to the left
    this.next_control = document.querySelector('.slider-pointer-right'); // move slide to the right
    this.distance = 0;
    this.x = options.x || 0;
    this.shift = 0;
    this.slide = 0;

    this._vs_go_next = VS_slider._vs_go_next.bind(this); // For call static method from usual function, that don't lost "this"!
    this._vs_go_prev = VS_slider._vs_go_prev.bind(this); // For call static method from usual function, that don't lost "this"!
    this._vs_go_nav = VS_slider._vs_go_nav.bind(this); // For call static method from usual function, that don't lost "this"!
  }

  // action, when page is loaded
  _windowLoad() {
    window.onload = () => {
      const sliderWrapWidth = this.sliderWrap.getBoundingClientRect().width;
      const itemsCollection = this.itemsBox.getElementsByTagName('LI');

      // let itemsArray = Array.from(itemsCollection, item => item.style.width = sliderWrapWidth + "px"); // apply a width of .slider-wrap for every LI
      this.x -= (sliderWrapWidth * this.pos); // calc slide offset/start position
      this.itemsBox.style.marginLeft = `${this.x}px`;
      this.sliderWrapWidth = sliderWrapWidth;
      this.resize();
      this.navAnimation(this.pos - 1);
    };
  }

  // create method, the main method for start implementaion
  createSlider() {
    this._windowLoad();
    this.createClone();
    this.listener();
  }

  // create clone for LI element in the before and after tha main LI lide elements(pictures)
  createClone() {
    const newEl1 = this.itemsBox.firstElementChild.cloneNode(true);
    const newEl3 = this.itemsBox.lastElementChild.cloneNode(true);
    newEl1.classList.add('clone');
    newEl3.classList.add('clone');
    this.itemsBox.insertBefore(newEl3, this.itemsBox.firstElementChild);
    this.itemsBox.insertBefore(newEl1, null);
    // Delay to complete clone stage without animation effects when the page will loaded
    setTimeout(() => {
      this.itemsBox.style.transition = 'all 0.5s ease';
    }, 600);
  }

  // Listeners previous, next control and resize control
  listener() {
    let downPoint;
    let upPoint;
    const sliderNavigation = document.querySelector('.slider-number-block');
    if (!this._checkImg()) {
      return false;
    }

    this.prev_control.addEventListener('click', () => {
      this._vs_go_prev();
    });

    this.next_control.addEventListener('click', () => {
      this._vs_go_next();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });

    sliderNavigation.addEventListener('click', (e) => {
      this._vs_go_nav(e);
    });

    // Mobile touch event realization

    this.sliderWrap.addEventListener('touchstart', (event) => {
      downPoint = event.changedTouches[0];
    });

    this.sliderWrap.addEventListener('touchend', (event) => {
      upPoint = event.changedTouches[0];
      const dX = Math.abs(downPoint.pageX - upPoint.pageX);
      const dY = Math.abs(downPoint.pageY - upPoint.pageY);
      if (dX > 30) {
        if (downPoint.pageX < upPoint.pageX) {
          this._vs_go_prev();
        } else {
          this._vs_go_next();
        }
      }
    }, true);

 		// Windows click event realization

    document.onmousedown = (event) => {
      event.preventDefault();
      const { target } = event;
      downPoint = event.pageX;
      document.onmouseup = (event) => {
        if (target.tagName != 'IMG') {
          return;
        }
        upPoint = event.pageX;
        const dX = Math.abs(downPoint - upPoint);
        if (dX > 30) {
          if (downPoint < upPoint) {
            this._vs_go_prev();
          } else {
            this._vs_go_next();
          }
        }
      };
    };
  }

  // check the availability of pictures
  _checkImg() {
    const images = this.slider.querySelectorAll('IMG');

    if (images.length > 4) {
      return true;
    }

    return false;
  }

  // Move to the next slide
  static _vs_go_next() {
    this.sliderWrapWidth = this.sliderWrap.getBoundingClientRect().width;
    this.pos += 1;

    if (this.pos > 3) {
      this.slide = 0;
      this.x = 0;
      this.itemsBox.style.transition = 'all 0s';
      this.itemsBox.style.marginLeft = `${this.x}px`;
      this.pos = 1;

      setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
        this.x -= this.sliderWrapWidth;
        this.itemsBox.style.marginLeft = `${this.x}px`;
      }, 15);
    } else {
      this.slide += 1;
      this.x -= this.sliderWrapWidth;
      this.itemsBox.style.marginLeft = `${this.x}px`;
    }

    this.navAnimation();
  }

  // Move to the previous slide
  static _vs_go_prev() {
    this.pos -= 1;
    if (this.pos < 1) {
      this.slide = 2;
      this.x = -1 * this.sliderWrapWidth * 4;
      this.itemsBox.style.transition = 'all 0s';
      this.itemsBox.style.marginLeft = `${this.x}px`;
      this.pos = 3;

      setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
        this.x += this.sliderWrapWidth;
        this.itemsBox.style.marginLeft = `${this.x}px`;
      }, 15);
    } else {
      this.slide -= 1;
      this.x += this.sliderWrapWidth;
      this.itemsBox.style.marginLeft = `${this.x}px`;
    }

    this.navAnimation();
  }

  // move slide with slider button (01, 02 ,03)
  static _vs_go_nav(e) {
    e.preventDefault();
    let i = 0;

    const sliderNavigation = document.querySelector('.slider-number-block');
    const sliderNavigationBox = sliderNavigation.querySelectorAll('DIV');
    const sliderNavArray = Array.from(sliderNavigationBox, (el) => el.className);
    sliderNavArray.forEach((element, index) => {
      if (element == e.target.className) {
        i = index;
        return i;
      }
    });

    this.slide = i;
    this.pos = this.slide + 1;

    this.navAnimation();
    this.x = -this.sliderWrapWidth - (this.sliderWrapWidth * i);
    this.itemsBox.style.marginLeft = `${this.x}px`;
  }

  // animation's control for slide numeration
  navAnimation(startPos) {
    this.slide = startPos || this.slide;
    const sliderNavigation = document.querySelector('.slider-number-block');
    const sliderNavigationBox = sliderNavigation.querySelectorAll('DIV');

    sliderNavigationBox.forEach((element, index) => {
      element.classList.remove('active');
    });

    sliderNavigationBox[this.slide].classList.add('active');
  }

  // Parameter tracking of the 'slider' elements during window resizing
  resize() {
    const itemsCollection = this.itemsBox.getElementsByTagName('LI');
    this.sliderWrapWidth = this.sliderWrap.offsetWidth;
    // console.log(this.sliderWrap.offsetWidth, itemsCollection[2].offsetWidth)

    if (window.innerWidth >= 1200 & window.innerWidth < 1600) {
      // Array.from(itemsCollection, item => item.style.width = this.sliderWrapWidth + "px");
      this.x = -this.sliderWrapWidth * this.pos;

      this.itemsBox.style.transition = 'all 0s';
      this.itemsBox.style.marginLeft = `${this.x}px`;
      const x = setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
      }, 15);
    } else if (window.innerWidth < 768) {
      // Array.from(itemsCollection, item => item.style.width = this.sliderWrapWidth + "px");
      this.x = -this.sliderWrapWidth * this.pos;
      this.itemsBox.style.transition = 'all 0s';

      this.itemsBox.style.marginLeft = `${this.x}px`;

      setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
      }, 15);
    } else if (window.innerWidth < 1200) {
      // Array.from(itemsCollection, item => item.style.width = this.sliderWrapWidth + "px");
      this.x = -this.sliderWrapWidth * this.pos;
      this.itemsBox.style.transition = 'all 0s';

      this.itemsBox.style.marginLeft = `${this.x}px`;

      setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
      }, 15);
    } else if (window.innerWidth > 1600) {
      // Array.from(itemsCollection, item => item.style.width = this.sliderWrapWidth + "px");
      this.x = -this.sliderWrapWidth * this.pos;

      this.itemsBox.style.transition = 'all 0s';

      this.itemsBox.style.marginLeft = `${this.x}px`;

      setTimeout(() => {
        this.itemsBox.style.transition = 'all 0.4s ease';
      }, 15);
    }
  }
}

const slide = new VS_slider({ pos: 2 });
slide.createSlider();
