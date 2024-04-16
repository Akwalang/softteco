import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserPage, PostsPage, PostPage, PostCreatePage, PostUpdatePage } from './pages';

export const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/posts/:alias" element={<PostPage />} />
        <Route path="/editor/new" element={<PostCreatePage />} />
        <Route path="/editor/update/:alias" element={<PostUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
};
