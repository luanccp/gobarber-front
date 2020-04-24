import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import { AuthProvider } from './hooks/AuthContext';
import TostContainer from './components/ToastContainer';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
    </AuthProvider>

    <TostContainer />
    <GlobalStyle />
  </>
);

export default App;
