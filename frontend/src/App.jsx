import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Home from "./pages/home";
import Authentication from "./pages/auth";
import Dashboard from "./pages/dashboard/Dashboard";
import GroupView from "./pages/dashboard/groups/GroupView";
import CreateGroup from "./pages/dashboard/groups/CreateGroup";
import ShowGroups from "./pages/dashboard/groups/ShowGroups";
import CreateTest from "./pages/dashboard/groups/CreateTest";
import ViewTests from "./pages/dashboard/groups/ViewTests";
import TeacherViewTests from "./pages/dashboard/groups/TeacherViewTests";
import ViewTest from "./pages/dashboard/groups/ViewTest";
import VerifyStudent from "./pages/dashboard/student/VerifyStudent";
import StudentViewTest from "./pages/dashboard/student/StudentViewTest";
import Root from "./components/Root";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="" element={<Home />} />

          <Route path="dashboard" element={<Dashboard />}>
            <Route path="teacher">
              <Route path="groups">
                <Route path="" element={<ShowGroups />} />
                <Route path=":id">
                  <Route path="" element={<GroupView />} />
                  <Route path="test/create-new" element={<CreateTest />} />
                </Route>
                <Route path="create" element={<CreateGroup />} />
                <Route path="view" element={<GroupView />} />
              </Route>

              <Route path="view/tests">
                <Route path="" element={<TeacherViewTests />} />
                <Route path=":id" element={<ViewTest />} />
                <Route path="verify-student/:id" element={<VerifyStudent />} />
              </Route>
            </Route>

            <Route path="student">
              <Route path="tests">
                <Route path="" element={<ViewTests />} />
                <Route path=":id" element={<StudentViewTest />} />
                <Route />
              </Route>
            </Route>
          </Route>

          <Route path="/signup" element={<Authentication isActive={false} />} />
          <Route path="/login" element={<Authentication isActive={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
