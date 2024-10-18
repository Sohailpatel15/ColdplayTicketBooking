import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailsPage from './pages/DetailsPage';
import QueuePage from './pages/QueuePage';
import SeatSelectionPage from './pages/SeatSelectionPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DetailsPage />} />
                <Route path="/queue" element={<QueuePage />} />
                <Route path="/seat-selection" element={<SeatSelectionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
