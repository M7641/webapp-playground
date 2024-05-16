import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ClientSideComponent from "./components/ClientSide";
import CallServerSide from "./components/CallServerSide";

function App() {
  return (
    <>
      <div>
        <ClientSideComponent />
        <CallServerSide />
      </div>
      <BrowserRouter>
        <div>
          <header>
            <div>
              <Link to="/" className="font-bold underline">
                Home
              </Link>
              <div style={{ height: "20px" }}></div>
              <Link to="/about" className="font-bold underline">
                About
              </Link>
              <div style={{ height: "20px" }}></div>
              <Link to="/contact" className="font-bold underline">
                Contact
              </Link>
            </div>
          </header>
          <section>
            <Routes>
              <Route path="/about" element={<h1>This is the about page!</h1>} />
              <Route
                path="/contact"
                element={<h1>This is the contact page!</h1>}
              />
              <Route path="/" element={<h1>This is the home page!</h1>} />
            </Routes>
          </section>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
