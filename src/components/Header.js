import '../App.css';

function Header() {
  return (
      <div className="top">
        <a href="https://ranch.finance/"><img src="https://www.ranch.finance/static/media/logo/hat.png" alt="Logo" width="100" height="100"/></a>
        <div id="logo-wrapper" className="text-logo"><a href="https://ranch.finance/"> <img src="https://www.ranch.finance/static/media/logo/ranch.finance_transparent.svg" alt="Logo-text"/></a></div>
      </div>
  );
}

export default Header;