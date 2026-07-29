import Header from "./components/Header/Header";
import MainLayout from "./components/Layout/MainLayout";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <MainLayout />
      <Footer />
    </div>
  );
}

export default App;