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
import StudentProfile from "./admin/pages/StudentProfile";
import ClassDetails from "./admin/pages/ClassDetails";
import TeacherProfile from './admin/pages/TeacherProfile';
import Settings  from './admin/pages/Settings'
import UniformInventory from './admin/pages/UniformInventory';
import BookInventory from './admin/pages/BookInventory';


// Student Components
import Student from './student/Student';
import StudentHome from './student/pages/Home';
import SProfile from './student/pages/SProfile';
import SFees from './student/pages/SFees';
import SBooks from './student/pages/SBooks';
import SUniforms from './student/pages/SUniforms';
import SAnnouncements from './student/pages/SAnnouncements';
import SSettings from './student/pages/SSettings';

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
          <Route path="/admin/student/:id" element={<StudentProfile />} />
          <Route path="/admin/parents" element={<Parents />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/fees" element={<Fees />} />
          <Route path="/admin/books" element={<Books />} />
          <Route path="/admin/uniforms" element={<Uniforms />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/classes" element={<ClassListPage />} />
          <Route path="/admin/class/:id" element={<ClassDetails />} />
          <Route path="/admin/teacher/:id" element={<TeacherProfile />}/>
          <Route path="/admin/settings" element={<Settings />}/>
          <Route path="/admin/uniforms/inventory" element={<UniformInventory />} />
          <Route path='/admin/books/inventory' element={<BookInventory />}/>
        </Route>

        {/* Student Routes - Protected */}
        <Route
          path="student"
          element={
            <RoleProtectedRoute requiredRole="student">
              <Student />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<StudentHome />} />
          <Route path="/student/profile" element={<SProfile />} />
          <Route path="/student/fees" element={<SFees />} />
          <Route path="/student/books" element={<SBooks />} />
          <Route path="/student/uniforms" element={<SUniforms />} />
          <Route path="/student/announcements" element={<SAnnouncements />} />
          <Route path='/student/settings' element={<SSettings />}/>
        </Route>

        

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </AuthProvider>
  );
};

export default App;