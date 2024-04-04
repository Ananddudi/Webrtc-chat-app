import backimage from "../statics/forArrow.gif";
import bluebackimage from "../statics/forArrow2.gif";
import firework from "../statics/fireworks.gif";

const Content = ({ showcontent }) => {
  if (showcontent) {
    return (
      <article className="textProfile">
        <h1 className="headertextProfile">Thanks For Visiting</h1>
        <div>
          <span className="frontandback">Name :</span>
          <span className="myname name">Anand dudi</span>
        </div>
        <div>
          <span className="frontandback">Project-Details:</span>
          <span className="myname desc">
            Used <font color="lightcoral">REACT</font> as Frontend and python's
            framework <font color="lightcoral">DJANGO</font> as backend.Building
            UI and animation was kind of tricky because i wanted to give look of
            3D rendering
          </span>
        </div>
      </article>
    );
  } else {
    return intro();
  }
};

const intro = () => (
  <>
    <img src={backimage} className="backimage" alt="cool" />
    <div className="redArrow"></div>
    <img src={bluebackimage} className="bluebackimage" alt=" " />
    <div className="blueArrow"></div>
    <img src={firework} className="fireworks" alt=" " />
    <div className="profileText">Anand dudi</div>
  </>
);

export default Content;
