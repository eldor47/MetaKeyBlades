import './Slideshow.css'
import React from 'react';

import one from './img/Slideshow/00.png'
import two from './img/Slideshow/01.png'
import three from './img/Slideshow/03.png'
import four from './img/Slideshow/5.png'
import five from './img/Slideshow/42.png'
import six from './img/Slideshow/48.png'
import seven from './img/Slideshow/Legendary.png'
import eight from './img/Slideshow/Legendary2.png'

const colors = [one, two, three, four, five, six, seven, eight];
const delay = 3500;

function Slideshow() {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {colors.map((image, index) => (
          <div
            className="slide"
            key={index}
            style={{ backGroundColor: "#0088FE" }}
          ><img className='slide-img' src={image}/></div>
        ))}
      </div>

      <div className="slideshowDots">
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;