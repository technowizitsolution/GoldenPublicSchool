// import {Routes, Route, Navigate} from 'react-router-dom';
// import Admin from './admin/Admin';
// import Dashboard from './admin/pages/Dashboard';
// import TeacherListPage from './admin/pages/Teachers';
// import StudentListPage from './admin/pages/Students';
// import Parents from './admin/pages/Parents';
// import Subjects from './admin/pages/Subjects';
// import Fees from './admin/pages/Fees';
// import Books from './admin/pages/Books';
// import Uniforms from './admin/pages/Uniforms';
// import Profile from './admin/pages/Profile';
// import ClassListPage from './admin/pages/Classes';
// import Login from './admin/pages/Login';
// import ProtectedRoute from './admin/components/ProtectedRoute';

// const App = () => {
//   return (
//     <>
//       <Routes>
//         {/* Login Route */}
//         <Route path="/adminLogin" element={<Login />} />

//         {/* Admin Routes - Protected */}
//         <Route
//           path="admin"
//           element={
//             <ProtectedRoute>
//               <Admin />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<Dashboard />} />
//           <Route path="/admin/teachers" element={<TeacherListPage />} />
//           <Route path="/admin/students" element={<StudentListPage />} />
//           <Route path="/admin/parents" element={<Parents />} />
//           <Route path="/admin/subjects" element={<Subjects />} />
//           <Route path="/admin/fees" element={<Fees />} />
//           <Route path="/admin/books" element={<Books />} />
//           <Route path="/admin/uniforms" element={<Uniforms />} />
//           <Route path="/admin/profile" element={<Profile />} />
//           <Route path="/admin/classes" element={<ClassListPage />} />
//         </Route>

//         {/* Redirect root to admin or login */}
//         <Route path="/" element={<Navigate to="/admin" replace />} />
//       </Routes>
//     </>
//   );
// };

// export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Login from './components/Login';

// Admin Components
import Admin from './admin/Admin';
import Dashboard from './admin/pages/Dashboard';
import TeacherListPage from './admin/pages/Teachers';
import StudentListPage from './admin/pages/Students';
import Parents from './admin/pages/Parents';
import Subjects from './admin/pages/Subjects';
import Fees from './admin/pages/Fees';
import Books from './admin/pages/Books';
import Uniforms from './admin/pages/Uniforms';
import Profile from './admin/pages/Profile';
import ClassListPage from './admin/pages/Classes';





const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Universal Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
        <Route
          path="admin"
          element={
            <RoleProtectedRoute requiredRole="admin">
              <Admin />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/admin/teachers" element={<TeacherListPage />} />
          <Route path="/admin/students" element={<StudentListPage />} />
          <Route path="/admin/parents" element={<Parents />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/fees" element={<Fees />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/uniforms" element={<Uniforms />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/classes" element={<ClassListPage />} />
        </Route>

        {/* Student Routes - Protected */}
        <Route
          path="student"
          element={
            <RoleProtectedRoute requiredRole="student">
              
            </RoleProtectedRoute>
          }
        >
          
        </Route>

        

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </AuthProvider>
  );
};

export default App;