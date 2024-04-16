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
            Thanks for visiting the site.Here you can chat with anyone who
            registered with site and have decent conversation with them.You can
            also do live video chat if you want to. <br />
            There is no upper data limit of sending videos,images,mp3 songs.Hope
            you will like it.THanks again :)
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
