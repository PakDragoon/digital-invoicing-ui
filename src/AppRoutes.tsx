import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router"
import { ROUTES } from "./common/routes"
import { useAuthStore } from "./features/auth/stores/authStore"
import { CompanyList } from "./features/companies/components"
import Dashboard from "./features/dashboard/components/Dashboard"
import BlankLayout from "./layout/BlankLayout"
import DefaultLayout from "./layout/DefaultLayout"
import InvoiceDetail from "./pages/InvoiceDetail"
import LoginPage from "./pages/login/LoginPage"
import NotificationsTable from "./pages/Notifications"
import InvoiceTable from "./pages/InvoiceTable"
import SignupPage from "./pages/signup/SignupPage"
import Profile from "./pages/Profile"
import NotFoundPage from "./pages/NotFound"
import UploadCsv from "./pages/UploadCSV"
import ForgotPasswordPage from "./pages/ForgotPassword"

/* ------------------------ Utility Guard Functions ------------------------ */
const waitForHydration = async () => {
  const store = useAuthStore.getState()
  while (!store.hasHydrated) {
    await new Promise((res) => setTimeout(res, 10))
  }
}

export const requireAuth = (allowedRoles?: string[]) => {
  return async () => {
    await waitForHydration()
    const { user } = useAuthStore.getState()

    if (!user) throw redirect({ to: ROUTES.ROOT })
    if (
      Array.isArray(allowedRoles) &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      throw redirect({ to: ROUTES.NOT_FOUND })
    }

    return null
  }
}

const redirectIfLoggedIn = async () => {
  await waitForHydration()
  const { user } = useAuthStore.getState()
  if (user) throw redirect({ to: ROUTES.DASHBOARD })
}

/* ----------------------------- Route Definitions ----------------------------- */

const RootRoute = createRootRoute({
  component: () => <Outlet />,
})

const BlankLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: "blankLayout",
  component: BlankLayout,
})

const DefaultLayoutRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: "defaultLayout",
  component: DefaultLayout,
})

const NotFoundRedirectRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "*",
  beforeLoad: () => {
    throw redirect({ to: ROUTES.NOT_FOUND })
  },
  component: () => null,
})

const UnauthorizeRoute = createRoute({
  getParentRoute: () => BlankLayoutRoute,
  path: ROUTES.NOT_FOUND,
  component: NotFoundPage,
})

const LoginRoute = createRoute({
  getParentRoute: () => BlankLayoutRoute,
  path: ROUTES.ROOT,
  component: LoginPage,
  beforeLoad: redirectIfLoggedIn,
})

const SignupRoute = createRoute({
  getParentRoute: () => BlankLayoutRoute,
  path: ROUTES.SIGNUP,
  component: SignupPage,
  beforeLoad: redirectIfLoggedIn,
})

const ForgotPasswordRoute = createRoute({
  getParentRoute: () => BlankLayoutRoute,
  path: ROUTES.USER_FORGOT_PASSWORD,
  component: ForgotPasswordPage,
  beforeLoad: redirectIfLoggedIn,
})

const DashboardRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.DASHBOARD,
  component: Dashboard,
  beforeLoad: requireAuth(),
})

const InvoiceTableRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.INVOICES,
  component: InvoiceTable,
  beforeLoad: requireAuth(),
})

const InvoiceDetailRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.INVOICE_DETAIL,
  component: InvoiceDetail,
  beforeLoad: requireAuth(),
})

const NotificationsRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.NOTIFICATIONS,
  component: NotificationsTable,
  beforeLoad: requireAuth(),
})

const CompaniesRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.COMPANIES,
  component: CompanyList,
  beforeLoad: requireAuth(),
})

const ProfileRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.PROFILE,
  component: Profile,
  beforeLoad: requireAuth(),
})

const UploadCSVRoute = createRoute({
  getParentRoute: () => DefaultLayoutRoute,
  path: ROUTES.CSV_UPLOAD,
  component: UploadCsv,
  beforeLoad: requireAuth(),
})

/* ----------------------------- Route Tree Setup ----------------------------- */

const routeTree = RootRoute.addChildren([
  BlankLayoutRoute.addChildren([LoginRoute, SignupRoute, ForgotPasswordRoute]),
  DefaultLayoutRoute.addChildren([
    ProfileRoute,
    DashboardRoute,
    CompaniesRoute,
    InvoiceTableRoute,
    InvoiceDetailRoute,
    NotificationsRoute,
    UnauthorizeRoute,
    NotFoundRedirectRoute,
    UploadCSVRoute
  ]),
])

export const router = createRouter({
  routeTree,
})
