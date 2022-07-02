import "./App.css";
import Footer from "./components/Footer";
import Monaco from "./components/Monaco";
import { ConfigProvider } from "./contexts/ConfigContext";

function App() {
    const id =
        window.location.pathname !== "/"
            ? window.location.pathname.slice(1)
            : null;

    return (
        <ConfigProvider id={id}>
            <div className="App">
                <Monaco />
                <Footer />
            </div>
        </ConfigProvider>
    );
}

export default App;
