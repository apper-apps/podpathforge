import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import MyProgress from '@/components/pages/MyProgress'
import PodFeed from '@/components/pages/PodFeed'
import Goals from '@/components/pages/Goals'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Layout>
          <Routes>
            <Route path="/" element={<MyProgress />} />
            <Route path="/pod-feed" element={<PodFeed />} />
            <Route path="/goals" element={<Goals />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App