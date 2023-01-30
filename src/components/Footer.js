import '../App.css';

function Footer(props) {
  return (
    <div  className={props.class}>
      <div className="eLpUJW">
        <h2>Integrations </h2>
        <div className="kikdAh">
          <a href="https://www.nftfi.com" target="_blank" rel="noopener noreferrer">
          <img src="https://www.ranch.finance/static/media/partners/nftfi.png" alt="aave"/></a>
        </div>
      </div>
      <div className="bTIjTR">
          <div className="dAkvW">
            <a  href="https://medium.com/@RanchFinance" target="_blank" rel="noreferrer">
              <img src="https://www.ranch.finance/static/media/social/medium.svg" alt="Medium Logo" className="mediumLogoColored" style={{height: "25px"}}/>
            </a>
            <a href="https://www.twitter.com/RanchFinance" target="_blank" rel="noreferrer">
              <img src="https://www.ranch.finance/static/media/social/twitter.svg" alt="twitter logo" className="twitterLogoColored" style={{height: "25px"}}/>
            </a>
            <a href="https://discord.gg/RgeVBpXfD8" target="_blank" rel="noreferrer">
              <img src="https://www.ranch.finance/static/media/social/discord.svg" alt="Discord logo" className="discordLogoColored" style={{height: "25px"}}/>
            </a>
          </div>
        </div>
    </div>

  );
}

export default Footer;
