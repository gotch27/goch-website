import logo from "../assets/3d-logo.svg";

export function SiteLogo() {
  return (
    <div className="site-logo-wrap" aria-hidden="true">
      <img src={logo} alt="" draggable="false" className="site-logo" />
    </div>
  );
}
