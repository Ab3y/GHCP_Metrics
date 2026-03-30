import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Completions } from './pages/Completions';
import { Chat } from './pages/Chat';
import { PRSummaries } from './pages/PRSummaries';
import { Seats } from './pages/Seats';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/completions" element={<Completions />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pr-summaries" element={<PRSummaries />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
