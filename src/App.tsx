import gochLogo from "./assets/goch.svg";
import { SocialLinks } from "./components/SocialLinks";

function App() {
  return (
    <main className="container">
      <div className="content">
        <img src={gochLogo} alt="Goch Logo" className="logo" />
        <SocialLinks />
        <div className="construction">
          <p>This website is under construction</p>
        </div>
      </div>
    </main>
  );
}

export default App;
