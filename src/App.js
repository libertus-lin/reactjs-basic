import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
   return (
      <div className="App">
         <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
               {/* Edit <code>src/App.js</code> and save to reload. */}
               Edit <code>src/App.js</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org/"
               target="_blank" rel="noopener noreferrer" >
               Checkout Button
            </a>
         </header>
      </div>
   );
}

class ShoppingList extends React.Component {
   render() {
      return (
         <div className="shopping-list">
            <h1>Daftar Belanja untuk {this.props.name}</h1>
            <ul>
               <li>Instagram</li>
               <li>WhatsApp</li>
               <li>Oculus</li>
            </ul>
         </div>
      );
   }
}

function ProdukInfo(props) {
   const { category, name } = props;
   return (
      <div>
         <div className="Deskripsi">
            <p className="Cate">{category}</p>
            <p className="Title">{name}</p>
            <p className="Price">IDR 73.309.399</p>
         </div>
      </div>
   );
}