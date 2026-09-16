import { Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import DashboardLayout from './layouts/DashboardLayout';
import TraineeDashboard from './pages/TraineeDashboard';
import RoleDashboard from './pages/RoleDashboard';
import TraineeProfile from './pages/TraineeProfile';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Resources from './pages/Resources';
import Assessments from './pages/Assessments';
import AssessmentWorkspace from './pages/AssessmentWorkspace';
import Feedback from './pages/Feedback';
import TrainerProfile from './pages/TrainerProfile';
import TrainerLibrary from './pages/TrainerLibrary';
import Questionnaires from './pages/Questionnaires';
import CreateQuestionnaire from './pages/CreateQuestionnaire';
import TrainerPerformance from './pages/TrainerPerformance';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminResources from './pages/AdminResources';
import AdminCertificates from './pages/AdminCertificates';
import AdminAnnouncements from './pages/AdminAnnouncements';
import { AdminAssessments, AdminInsights, AdminSettings } from './pages/SimpleAdminPages';
import Placeholder from './pages/Placeholder';
import Notifications from './pages/Notifications';
import CompetencyPage from './pages/trainee/CompetencyPage';
import CompetencyPassportPage from './pages/trainee/CompetencyPassportPage';
import AdminCompetencyInsights from './pages/AdminCompetencies';
import ProtectedRoute, { RoleRedirect } from './components/ProtectedRoute';

const traineeRoutes = [['/trainee/profile', <TraineeProfile />], ['/trainee/courses', <Courses />], ['/trainee/courses/:id', <CourseDetails />], ['/trainee/resources', <Resources />], ['/trainee/assessments', <Assessments />], ['/trainee/assessments/:id', <AssessmentWorkspace />], ['/trainee/feedback', <Feedback />], ['/trainee/competency', <CompetencyPage />], ['/trainee/competency-passport', <CompetencyPassportPage />], ['/trainee/notifications', <Notifications />]];
const trainerRoutes = [['/trainer/profile', <TrainerProfile />], ['/trainer/library', <TrainerLibrary />], ['/trainer/questionnaires', <Questionnaires />], ['/trainer/questionnaires/create', <CreateQuestionnaire />], ['/trainer/performance', <TrainerPerformance />], ['/trainer/notifications', <Placeholder title="Notifications" description="Your latest announcements are surfaced on the trainer dashboard." />]];
const adminRoutes = [['/admin/users', <AdminUsers />], ['/admin/courses', <AdminCourses />], ['/admin/resources', <AdminResources />], ['/admin/assessments', <AdminAssessments />], ['/admin/certificates', <AdminCertificates />], ['/admin/announcements', <AdminAnnouncements />], ['/admin/competencies', <AdminCompetencyInsights />], ['/admin/insights', <AdminInsights />], ['/admin/settings', <AdminSettings />]];
// function RoleRoutes({ role, dashboard, routes }) {
//   return (
//     <Routes>
//       <Route
//         element={
//           <ProtectedRoute roles={[role]}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={dashboard} />

//         {routes.map(([path, element]) => {
//           const relativePath = path
//             .replace(`/${role}/`, "")
//             .replace(/^\//, "");

//           return (
//             <Route
//               key={path}
//               path={relativePath}
//               element={element}
//             />
//           );
//         })}
//       </Route>
//     </Routes>
//   );
// }
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/dashboard" element={<RoleRedirect />} />

      {/* Trainee routes */}
      <Route
        element={
          <ProtectedRoute roles={["trainee"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/trainee/dashboard"
          element={<TraineeDashboard />}
        />
        <Route path="/trainee/profile" element={<TraineeProfile />} />
        <Route path="/trainee/courses" element={<Courses />} />
        <Route
          path="/trainee/courses/:id"
          element={<CourseDetails />}
        />
        <Route path="/trainee/resources" element={<Resources />} />
        <Route
          path="/trainee/assessments"
          element={<Assessments />}
        />
        <Route
          path="/trainee/assessments/:id"
          element={<AssessmentWorkspace />}
        />
        <Route path="/trainee/feedback" element={<Feedback />} />
        <Route
          path="/trainee/competency"
          element={<CompetencyPage />}
        />
        <Route
          path="/trainee/competency-passport"
          element={<CompetencyPassportPage />}
        />
        <Route
          path="/trainee/notifications"
          element={<Notifications />}
        />
      </Route>

      {/* Trainer routes */}
      <Route
        element={
          <ProtectedRoute roles={["trainer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/trainer/dashboard"
          element={<RoleDashboard />}
        />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/library" element={<TrainerLibrary />} />
        <Route
          path="/trainer/questionnaires"
          element={<Questionnaires />}
        />
        <Route
          path="/trainer/questionnaires/create"
          element={<CreateQuestionnaire />}
        />
        <Route
          path="/trainer/performance"
          element={<TrainerPerformance />}
        />
        <Route
          path="/trainer/notifications"
          element={
            <Placeholder
              title="Notifications"
              description="Your latest announcements are surfaced on the trainer dashboard."
            />
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/resources" element={<AdminResources />} />
        <Route
          path="/admin/assessments"
          element={<AdminAssessments />}
        />
        <Route
          path="/admin/certificates"
          element={<AdminCertificates />}
        />
        <Route
          path="/admin/announcements"
          element={<AdminAnnouncements />}
        />
        <Route
          path="/admin/competencies"
          element={<AdminCompetencyInsights />}
        />
        <Route path="/admin/insights" element={<AdminInsights />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}