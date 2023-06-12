import logo from './logo.svg';
import './App.css';
import ProductsContainer from './components/ProductsContainer';
import data from 'data/sample.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ProductsContainer data={data}/>
      </header>
    </div>
  );
}

export default App;
