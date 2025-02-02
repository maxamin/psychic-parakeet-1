import {
  Welcome,
  EthereumChart,
  Footer,
  AboutCard,
  Transactions,
  Cursor,
} from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Cursor />
      <Welcome />
      <EthereumChart />
    </div>
    <AboutCard />
    <Transactions />
    <Footer />
  </div>
);

export default App;
