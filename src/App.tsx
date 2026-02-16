import Navbar from "./components/layout/Navbar";
import Home from "./components/sections/HomeScreen";

function App() {
  return (
    <div className="min-h-screen bg-(--color-background)">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
