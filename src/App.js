// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import Login from "./components/Login";
// import UserForm from "./components/UserForm";
// import Dashboard from "./pages/Dashboard";
// import UserInfo from "./components/UserInfo";
// import TodayTask from "./components/TodayTask";
// import UserList from "./components/UserList";
// import WorkoutPage from "./pages/WorkoutPage";
// import LandingPage from "./pages/LandingPage";

// // Protected Route Component
// function ProtectedRoute({ children }) {
//     const isLoggedIn = localStorage.getItem("userId");
//     return isLoggedIn ? children : <Login />;
// }

// function App() {
//     return (
//         <BrowserRouter>
//             <Layout>
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={<LandingPage />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/user-form" element={<UserForm />} />
//                     <Route path="/users" element={<UserList />} />
                    
//                     {/* Protected Routes (require login) */}
//                     <Route path="/dashboard" element={
//                         <ProtectedRoute>
//                             <Dashboard />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/userInfo" element={
//                         <ProtectedRoute>
//                             <UserInfo />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/todayTask/:id" element={
//                         <ProtectedRoute>
//                             <TodayTask />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/workout/:userId" element={
//                         <ProtectedRoute>
//                             <WorkoutPage />
//                         </ProtectedRoute>
//                     } />
//                 </Routes>
//             </Layout>
//         </BrowserRouter>
//     );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import UserForm from "./components/UserForm";
import Dashboard from "./pages/Dashboard";
import UserInfo from "./components/UserInfo";
import TodayTask from "./components/TodayTask";
import UserList from "./components/UserList";
import WorkoutPage from "./pages/WorkoutPage";
import LandingPage from "./pages/LandingPage";

function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem("userId");
    return isLoggedIn ? children : <Login />;
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-form" element={<UserForm />} />
                    <Route path="/users" element={<UserList />} />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/userInfo" element={
                        <ProtectedRoute>
                            <UserInfo />
                        </ProtectedRoute>
                    } />
                    <Route path="/todayTask/:id" element={
                        <ProtectedRoute>
                            <TodayTask />
                        </ProtectedRoute>
                    } />
                    <Route path="/workout/:userId" element={
                        <ProtectedRoute>
                            <WorkoutPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;