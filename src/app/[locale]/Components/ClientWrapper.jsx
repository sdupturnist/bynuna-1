"use client"; // Mark this component as a client component

import { Provider } from 'react-redux';
import { store } from '../Redux/store';
import Footer from './Footer';
import Header from './Header';

const ClientWrapper = ({ children }) => {
  return (
   
       <Provider store={store}>
      <Header />
      <div className="container">
        <main>{children}</main>
      </div>
      <Footer />
      </Provider>
   
  );
};

export default ClientWrapper;
