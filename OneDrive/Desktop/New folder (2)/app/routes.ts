import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { InvoiceUpload } from "./components/InvoiceUpload";
import { InvoiceReview } from "./components/InvoiceReview";
import { GSTR1Draft } from "./components/GSTR1Draft";
import { PlaceholderPage } from "./components/PlaceholderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    // Pathless layout route wraps all authenticated pages
    Component: Layout,
    children: [
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/invoices/upload",
        Component: InvoiceUpload,
      },
      {
        path: "/invoices/review",
        Component: InvoiceReview,
      },
      {
        path: "/invoices/history",
        Component: PlaceholderPage,
      },
      {
        path: "/gstr1",
        Component: GSTR1Draft,
      },
      {
        path: "/gstr3b",
        Component: PlaceholderPage,
      },
      {
        path: "/gstr9",
        Component: PlaceholderPage,
      },
      {
        path: "/einvoice",
        Component: PlaceholderPage,
      },
      {
        path: "/ledger",
        Component: PlaceholderPage,
      },
      {
        path: "/reports",
        Component: PlaceholderPage,
      },
      {
        path: "/settings",
        Component: PlaceholderPage,
      },
    ],
  },
]);
