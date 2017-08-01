import React from 'react';
import '../../scss/components/Carrusel.scss';

export default class Carrusel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalPosition: 0,
      currentPosition: 0
    }
    this.childrens = {};
  }//end constructor

  async componentDidMount() {
    const transitionTime = this.props.transitionTime || (1000*0.25);//0.25s in .transition css class

    if(this.props.lift) this.props.lift(this);
    let $container = $(".mask-elements");
    const $images = $container.find("li").find("img");
    if($images.length) {
      $.each($images, (index, image) => {
        image.addEventListener('load', () => {
          if(index === $images.length - 1) this.initialize();
        })
      })
      //await this.moveTo("tercero")
    } else {
      console.log("carga items que no son imagenes")
      this.initialize();
    }

    $(document).keydown((e) => {
      if(e.keyCode == 37) this.moveLeft();
      if(e.keyCode == 39) this.moveRight();
    })

    this.fitElements();

    $(window).resize(() => {
      this.fitElements();
      setTimeout(this.fitHeight, transitionTime);
    })
  }//end componentDidMount

  addChildren(name, child) {
    this.childrens[name] = child;
  }//end addChildren

  templateItems() {
    let elements = this.props.data;
    let data = elements.map(element => Object.assign({}, element));
    let current = data.find((element, index) => {
      element.originalIndex = index;
      return element.props.className.includes("current");
    })

    if(current) {
      //this.setState({originalPosition: current.originalIndex, currentPosition: current.originalIndex});
      data.splice(current.originalIndex, 1);
      data.unshift(current);
    }
    return (
      data.map((element, index) => {
        return <li className="slide" key={ index }>{ element }</li>
      })
    )
  }//end templateLoader

  selectNavigationPoint() {
    const currentPosition = this.state.currentPosition;
    const $point = $(".point").removeClass("point-selected");
    $point.eq(currentPosition).addClass("point-selected");
  }//end selectNavigationPoint

  async moveTo(id) {
    const self = this;
    const delay = this.props.delay || 0;
    return (
      new Promise(async (resolve, reject) => {
        const $mask = $(".mask-elements");
        const current = self.state.currentPosition;
        let position = 0;
        $.each($mask.find(".slide"), (index, item) => {
          if(id === $(item).children().attr("id")) position = index;
        })
        let steps = position - current;
        for (let i = 0; i < Math.abs(steps); i++) {
          if(steps < 0) {
            await self.moveLeft();
          } else if(steps > 0){
            //move right
            await self.moveRight();
            //move left
          }
        }
        resolve();
      })
    )
  }//end moveTo

  moveLeft() {
    const currentPosition = this.state.currentPosition;
    const delay = this.props.delay || 0;
    const animation = this.props.animation || "";
    const transitionTime = (this.props.transitionTime / 1000) || 0.25;
    if(currentPosition === 0) {
      if(this.props.forwardStart === true) this.moveTo.bind(this, this.props.data[this.props.data.length-1].props.id)();
      return;
    }
    return (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          let $container = $(".mask-elements");
          let $currentItem = $container.find(".current").parent();
          let $items = $container.find(".slide");
          $items.css("transition", `all ${transitionTime}s`);
          $items.eq(currentPosition - 1).css("margin-left", 0).children().addClass("current").addClass(animation);
          $items.eq(currentPosition).children().removeClass("current").removeClass(animation);

          this.setState({currentPosition: currentPosition - 1});
          this.initialize();
          this.selectNavigationPoint.bind(this)();
          resolve();
        }, delay)
      })
      )
  }//end moveLeft

  moveRight() {
    const currentPosition = this.state.currentPosition;
    const delay = this.props.delay || 0;
    const animation = this.props.animation || "";
    const transitionTime = (this.props.transitionTime / 1000)|| 0.25;
    if(currentPosition === this.props.data.length-1) {
      if(this.props.forwardEnd === true) this.moveTo.bind(this, this.props.data[0].props.id)();

      return; //close function
    }
    return (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          let $container = $(".mask-elements");
          let $currentItem = $container.find(".current").parent();
          let $items = $container.find(".slide");
          $items.css("transition", `all ${transitionTime}s`);
          $items.eq(currentPosition).css("margin-left", - $currentItem.width()).children().removeClass("current").removeClass(animation);
          $items.eq(currentPosition + 1).children().addClass("current").addClass(animation);

          this.setState({currentPosition: currentPosition+1});
          this.initialize();
          this.selectNavigationPoint.bind(this)();
          resolve();
        }, delay)
      })
      )
  }//end moveRight

  fitHeight() {
    let $container = $(".wrap-main-content");
    const $current = $container.find(".current");
    const HEIGHT = $current.height();
    $container.height(HEIGHT);
  }//end fitHeight

  fitElements() {
    let $container = $(".wrap-main-content");
    let windowWidth = $(window).width();
    let $items = $container.find(".slide");
    const MAX_WIDTH = Number($items.css("max-width").replace("px", ""));
    let hiddens = $items.filter((index, item) => item.style.marginLeft.includes("-"));
    let vissibles = $items.filter((index, item) => !item.style.marginLeft.includes("-"));
    let $arrows = $(".arrow-left, .arrow-right");
    let $arrowsMobile = $(".arrow-left-mob, .arrow-right-mob");

    if(windowWidth <= MAX_WIDTH+($arrows.width()*2)) {
      $arrows.addClass("hide");
      $arrowsMobile.removeClass("hide");
    } else {
      $arrows.removeClass("hide")
      $arrowsMobile.addClass("hide");
    }

    if(windowWidth <= MAX_WIDTH) {
      $container.width(windowWidth);
      hiddens.css({ "margin-left": -windowWidth, "width": windowWidth });
      vissibles.css("width", windowWidth);
    } else {
      if($container.width() === MAX_WIDTH) return;
      $container.width(MAX_WIDTH);
      hiddens.css({ "margin-left": -MAX_WIDTH, "width": MAX_WIDTH });
      vissibles.css("width", MAX_WIDTH);
    }
  }//end fitElements

  initialize() {
    let $container = $(".wrap-main-content");
    let $current = $container.find(".current");
    let $wrapCurrent = $current.parent();
    const WIDTH = $wrapCurrent.width();
    let imagesWidth = 0;
    $container.find(".slide").map((index, item) => imagesWidth += (item.offsetWidth));

    $container.find("ol").width(imagesWidth);
    $container.width(WIDTH);
    this.fitHeight();
  }//end initialize

  templateNavigation() {
    return (
      <nav className="navigation-points">
        <ul>
          {
            this.props.data.map((item, index) =>  {
              let style = index === 0 ? "point point-selected" : "point";
              return <li className={style}  onClick={this.moveTo.bind(this, item.props.id)} title={item.props.id} style={
                {transition: `all ${this.props.transitionTime/1000 || 0.25}s`}
              } key={ index }></li>
            })
          }
        </ul>
      </nav>
    )
  }//end templateNavigation

  render() {
    let style = this.state.style;
    let data = this.props.data;
    let navigationControls = this.props.navigationControls === true ? this.templateNavigation.bind(this)() : null;
    let arrowLeft = <span className="arrow-left" onClick={ this.moveLeft.bind(this) }></span>
    let arrowRight = <span className="arrow-right" onClick={ this.moveRight.bind(this) }></span>
    let arrowLeftMobile = <span className="arrow-left-mob hide" onClick={ this.moveLeft.bind(this) }></span>
    let arrowRightMobile = <span className="arrow-right-mob hide" onClick={ this.moveRight.bind(this) }></span>

    return (
      <div className="mask-elements">
        { this.props.noArrows === true ? null : arrowLeft }
        <div className="wrap-main-content">
          { arrowLeftMobile }
          <ol className="row wrap-slide">
            { this.templateItems.bind(this)() }
          </ol>
          { arrowRightMobile }
          { navigationControls }
        </div>{/*main content*/}
        { this.props.noArrows === true ? null : arrowRight }
      </div>
    )
  }//end render
}
