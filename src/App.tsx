import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Main } from './pages/main';
import { Login } from './pages/login';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { Fiction } from './pages/sections/fiction';
import { Academic } from './pages/sections/academic';
import { Reviews } from './pages/sections/reviews';
import { CreatePost } from './pages/create-post/createpost';
import { Stories } from './pages/sections/stories';
import { Poems } from './pages/sections/poems';
import { PostDetails } from './components/PostDetails';
import AdminRoute from './components/AdminRoute';



function App() {
  const adminEmail = "saikat.starkish@gmail.com"; // Your admin email

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className='contents'>
          <Routes>
            <Route path='/' element={<Main />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/createpost' element={<AdminRoute element={<CreatePost />} adminEmail={adminEmail} />} />
            <Route path='/post/:postId' element={<PostDetails />} />
            <Route path='/sections/fiction' element={<Fiction />}/>
            <Route path='/sections/academic' element={<Academic />} />
            <Route path='/sections/reviews' element={<Reviews />} />
            <Route path='/sections/stories' element={<Stories />}/>
            <Route path='/sections/poems' element={<Poems />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
