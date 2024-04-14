import { Routes, Route } from 'react-router-dom';

import { User, Posts, Post } from './pages';

function App(): JSX.Element {
  return (
    <Routes>
      <Route exact path="/" element={<Posts />} />
      <Route path="/user" element={<User />} />
      <Route path="/posts/:alias" element={<Post />} />
    </Routes>
  );
}

export default App;
