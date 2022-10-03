import '../App.css';

function Footer() {
  return (
    <div className="cUWXFh">
      <div className="eLpUJW">
        <h2>Integrations and partners</h2>
        <div className="kikdAh">
          <a href="https://compound.finance/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.ranch.finance/static/media/partners/compound.svg" alt="compound"/></a>

          <a href="https://www.nftfi.com" target="_blank" rel="noopener noreferrer">
          <img src="https://www.ranch.finance/static/media/partners/nftfi.png" alt="aave"/></a>

          <a href="https://www.uniswap.org" target="_blank" rel="noopener noreferrer">
          <img src="https://www.ranch.finance/static/media/partners/uniswap.svg" alt="uniswap"/></a>
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