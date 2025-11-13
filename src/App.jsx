// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { menus } from "./config/menu";

import Login from './Pages/Auth/Login';
import DashBoardLayout from "./layouts/DashBoardLayout";
// Pages Imports
import DashBoard from "./Pages/Dashboard/DashBoard";
import Sales from "./Pages/SaleDashBoard/Sales";
import CreateInvoice from "./Pages/Invoice/CreateInvoice";

// Fund Request Pages
import PendingFundRequest from "./Pages/FundRequest/PendingFundRequest";
import FailedFundRequest from "./Pages/FundRequest/FailedFundRequest";
import SuccessFundRequest from "./Pages/FundRequest/SuccessFundRequest";
import BankMaster from "./Pages/FundRequest/BankMaster";
import SettlementSetting from "./Pages/SettlementRequest/SettlementSetting";
import PendingSettlementRequest from "./Pages/SettlementRequest/PendingSettlementRequest";
import ApprovedSettlementRequest from "./Pages/SettlementRequest/ApprovedSettlementRequest";

// Loan Request Pages
import LoanRequestReport from "./Pages/LoanRequest/LoanRequestReport";
import LoanLedgerReport from "./Pages/LoanRequest/LoanLedgerReport";
import LoanSummaryReport from "./Pages/LoanRequest/LoanSummaryReport";
import LoanRecovered from "./Pages/LoanRequest/LoanRecovered";
import LifeTimeLoanReport from "./Pages/LoanRequest/LifeTimeLoanReport";

// Utility Payments Pages
import UtilityReport from "./Pages/Utility/UtilityReport";

// Direct Commission Pages
import DirectSurchargeCreditDebit from "./Pages/DirectCommission/DirectSurchargeCreditDebit";
import PayinReport from "./Pages/DirectCommission/PayinReport";
import SurchargeDeduct from "./Pages/DirectCommission/SurchargeDeduct";
import SurchargeDeductSummary from "./Pages/DirectCommission/SurchargeDeductSummary";
import LifeTimeDeductReport from "./Pages/DirectCommission/LifeTimeDeductReport";

// Chargebacks Pages
import SearchChargeback from "./Pages/Chargeback/SearchChargeback";
import ChargebackReport from "./Pages/Chargeback/ChargebackReport";

// Lien Pages
import ManageLien from "./Pages/Lien/ManageLien";
import DeletedLien from "./Pages/Lien/DeletedLien";

// HelpDesk Pages
import TicketReport from "./Pages/HelpDesk/TicketReport";
import FraudCustomer from "./Pages/HelpDesk/FraudCustomer";

// Manage Customer Pages
import CreateCustomer from "./Pages/ManageCustomer/CreateCustomer";
import ManagePermission from "./Pages/ManageCustomer/ManagePermission";
import ManageInstantWallet from "./Pages/ManageCustomer/ManageInstantWallet";
import ActiveCustomers from "./Pages/ManageCustomer/ActiveCustomers";
import UserLoginHistory from "./Pages/ManageCustomer/UserLoginHistory";
// import PromoteUser from "./Pages/ManageCustomer/PromoteUser";
import InActiveCustomers from "./Pages/ManageCustomer/InActiveCustomers";
import UserWalletBalance from "./Pages/ManageCustomer/UserWalletBalance";
import ManageUserWallet from "./Pages/ManageCustomer/ManageUserWallet";
import ReconHistory from "./Pages/ManageCustomer/ReconHistory";
import UplineApiWallet from "./Pages/ManageCustomer/UplineApiWallet";
// import ApiMerchantDetails from "./Pages/ManageCustomer/ApiMerchantDetails";

// Smart Collect Pages
import CreateVA from "./Pages/SmartCollect/CreateVA";
import VAReport from "./Pages/SmartCollect/VAReport";
import ActiveVAReport from "./Pages/SmartCollect/ActiveVAReport";

// Payout Reports Pages
import PayoutReport from "./Pages/PayoutReports/PayoutReport";
import PendingPayoutReport from "./Pages/PayoutReports/PendingPayoutReport";
import FailedPayoutReport from "./Pages/PayoutReports/FailedPayoutReport";
import PayoutLedger from "./Pages/PayoutReports/PayoutLedger";
import GarbagePayout from "./Pages/PayoutReports/GarbagePayout";
import BulkPayout from "./Pages/PayoutReports/BulkPayout";

// Unsettled Reports Pages
import UnSettledPayinReport from "./Pages/UnSettledPayinReports/UnSettledPayinReport";
import UnSettledPendingPayinReport from "./Pages/UnSettledPayinReports/UnSettledPendingPayinReport";
import UnSettledFailedPayinReport from "./Pages/UnSettledPayinReports/UnSettledFailedPayinReport";
import UnSettledPayinLedgerReport from "./Pages/UnSettledPayinReports/UnSettledPayinLedgerReport";

// Settled Reports Pages
import SettledPayinReport from "./Pages/SettledPayinReports/SettledPayinReport";
import SettledPedingPayinReport from "./Pages/SettledPayinReports/SettledPedingPayinReport";
import SettledFailedPayinReport from "./Pages/SettledPayinReports/SettledFailedPayinReport";
import SettledLedgerPayinReport from "./Pages/SettledPayinReports/SettledLedgerPayinReport";

// Settled Wallet Pages
import SettledCreditReport from "./Pages/SettledWalletReports/SettledCreditReport";
import SettledDebitReport from "./Pages/SettledWalletReports/SettledDebitReport";
import SettledLedgerReport from "./Pages/SettledWalletReports/SettledLedgerReport";

// UnSettled Wallet Pages
import UnSettledCreditReport from "./Pages/UnSettledWalletReports/UnSettledCreditReport";
import UnSettledDebitReport from "./Pages/UnSettledWalletReports/UnSettledDebitReport";
import UnSettledLedgerReport from "./Pages/UnSettledWalletReports/UnSettledLedgerReport";

// Manage API Pages
import GivenAPIProfit from "./Pages/ManageApi/GivenAPIProfit";
import APIFund from "./Pages/ManageApi/APIFund";
import APIwiseFund from "./Pages/ManageApi/APIwiseFund";
import APIFundLedger from "./Pages/ManageApi/APIFundLedger";
import ApiCompanyDetails from "./Pages/ManageApi/ApiCompanyDetails";
import ManageSlab from "./Pages/ManageApi/ManageSlab";
import SwitchPayin from "./Pages/ManageApi/SwitchPayin";
import SetPayoutLimit from "./Pages/ManageApi/SetPayoutLimit";
import PayinSetup from "./Pages/ManageApi/PayinSetup";

// Commission Pages
import CreateCategory from "./Pages/Commission/CreateCategory";
import SetValue from "./Pages/Commission/SetValue";
import CommissionLedger from "./Pages/Commission/CommissionLedger";

// Search Pages
import PayinSearch from "./Pages/Search/PayinSearch";
import PayoutSearch from "./Pages/Search/PayoutSearch";
import TopPayinTxn from "./Pages/Search/TopPayinTxn";
import DuplicateUTR from "./Pages/Search/DuplicateUTR";
import DuplicateUnSettledLedger from "./Pages/Search/DuplicateUnSettledLedger";

// BroadCast Pages
import Notification from "./Pages/BroadCast/Notification";
import PopUp from "./Pages/BroadCast/PopUp";
import ShootEmail from "./Pages/BroadCast/ShootEmail";
import ShootWhatsApp from "./Pages/BroadCast/ShootWhatsApp";
import Banners from "./Pages/BroadCast/Banners";
import SendChromeNt from "./Pages/BroadCast/SendChromeNt";

// Admin Wallet Pages
import CreditYourself from "./Pages/AdminWallet/CreditYourself";
import DebitYourself from "./Pages/AdminWallet/DebitYourself";
import AdminProfit from "./Pages/AdminWallet/AdminProfit";
import LifeTimeComm from "./Pages/AdminWallet/LifeTimeComm";
import EarnComm from "./Pages/AdminWallet/EarnComm";
import UnsettledComm from "./Pages/AdminWallet/UnsettledComm";
import ManualComm from "./Pages/AdminWallet/ManualComm";
import ManualCommCrDr from "./Pages/AdminWallet/ManualCommCrDr";
import ManualCommCrDrLedger from "./Pages/AdminWallet/ManualCommCrDrLedger";

// GST Pages
import GSTReport from "./Pages/GST/GSTReport";
import PayGST from "./Pages/GST/PayGST";
import GSTLedger from "./Pages/GST/GSTLedger";
import UserWiseGST from "./Pages/GST/UserWiseGST";

// TDS Pages
import TDSReport from "./Pages/TDS/TDSReport";
import PayTDS from "./Pages/TDS/PayTDS";
import TDSLedger from "./Pages/TDS/TDSLedger";
import UserWiseTDS from "./Pages/TDS/UserWiseTDS";

// Manage Employee Pages
import CreateEmployee from "./Pages/Employee/CreateEmployee";
import ActiveEmployee from "./Pages/Employee/ActiveEmployee";
import InActiveEmployee from "./Pages/Employee/InActiveEmployee";
import EmployeeLoginHistory from "./Pages/Employee/EmployeeLoginHistory";
//import { loadCsrfToken } from "./services/api";

// Page mapping
const pageMap = {
  "/": Login,
  "/DashBoard": DashBoard,
  "/Sales": Sales,
  "/CreateInvoice": CreateInvoice,
  "/PendingFundRequest": PendingFundRequest,
  "/FailedFundRequest": FailedFundRequest,
  "/SuccessFundRequest": SuccessFundRequest,
  "/BankMaster": BankMaster,
  "/SettlementSetting": SettlementSetting,
  "/PendingSettlementRequest": PendingSettlementRequest,
  "/ApprovedSettlementRequest": ApprovedSettlementRequest,
  "/LoanRequestReport": LoanRequestReport,
  "/LoanLedgerReport": LoanLedgerReport,
  "/LoanSummaryReport": LoanSummaryReport,
  "/LoanRecovered": LoanRecovered,
  "/LifeTimeLoanReport": LifeTimeLoanReport,
  "/UtilityReport": UtilityReport,
  "/DirectSurchargeCreditDebit": DirectSurchargeCreditDebit,
  "/PayinReport": PayinReport,
  "/SurchargeDeduct": SurchargeDeduct,
  "/SurchargeDeductSummary": SurchargeDeductSummary,
  "/LifeTimeDeductReport": LifeTimeDeductReport,
  "/SearchChargeback": SearchChargeback,
  "/ChargebackReport": ChargebackReport,
  "/ManageLien": ManageLien,
  "/DeletedLien": DeletedLien,
  "/TicketReport": TicketReport,
  "/FraudCustomer": FraudCustomer,
  "/CreateCustomer": CreateCustomer,
  "/ManagePermission": ManagePermission,
  "/ManageInstantWallet": ManageInstantWallet,
  "/ActiveCustomers": ActiveCustomers,
  "/UserLoginHistory": UserLoginHistory,
  // "/PromoteUser": PromoteUser,
  "/InActiveCustomers": InActiveCustomers,
  "/UserWalletBalance": UserWalletBalance,
  "/ManageUserWallet": ManageUserWallet,
  "/ReconHistory": ReconHistory,
  "/UplineApiWallet": UplineApiWallet,
  // "/ApiMerchantDetails": ApiMerchantDetails,
  "/CreateVA": CreateVA,
  "/VAReport": VAReport,
  "/ActiveVAReport": ActiveVAReport,
  "/PayoutReport": PayoutReport,
  "/PendingPayoutReport": PendingPayoutReport,
  "/FailedPayoutReport": FailedPayoutReport,
  "/PayoutLedger": PayoutLedger,
  "/GarbagePayout": GarbagePayout,
  "/BulkPayout": BulkPayout,
  "/UnSettledPayinReport": UnSettledPayinReport,
  "/UnSettledPendingPayinReport": UnSettledPendingPayinReport,
  "/UnSettledFailedPayinReport": UnSettledFailedPayinReport,
  "/UnSettledPayinLedgerReport": UnSettledPayinLedgerReport,
  "/SettledPayinReport": SettledPayinReport,
  "/SettledPedingPayinReport": SettledPedingPayinReport,
  "/SettledFailedPayinReport": SettledFailedPayinReport,
  "/SettledLedgerPayinReport": SettledLedgerPayinReport,
  "/SettledCreditReport": SettledCreditReport,
  "/SettledDebitReport": SettledDebitReport,
  "/SettledLedgerReport": SettledLedgerReport,
  "/UnSettledCreditReport": UnSettledCreditReport,
  "/UnSettledDebitReport": UnSettledDebitReport,
  "/UnSettledLedgerReport": UnSettledLedgerReport,
  "/GivenAPIProfit": GivenAPIProfit,
  "/APIFund": APIFund,
  "/APIFundLedger": APIFundLedger,
  "/APIwiseFund": APIwiseFund,
  "/APICompanyDetails": ApiCompanyDetails,
  "/ManageSlab": ManageSlab,
  "/SwitchPayin": SwitchPayin,
  "/SetPayoutLimit": SetPayoutLimit,
  "/PayinSetup": PayinSetup,
  "/CreateCategory": CreateCategory,
  "/SetValue": SetValue,
  "/CommissionLedger": CommissionLedger,
  "/PayinSearch": PayinSearch,
  "/PayoutSearch": PayoutSearch,
  "/TopPayinTxn": TopPayinTxn,
  "/DuplicateUTR": DuplicateUTR,
  "/DuplicateUnSettledLedger": DuplicateUnSettledLedger,
  "/Notification": Notification,
  "/PopUp": PopUp,
  "/ShootEmail": ShootEmail,
  "/ShootWhatsApp": ShootWhatsApp,
  "/Banners": Banners,
  "/SendChromeNt": SendChromeNt,
  "/CreditYourself": CreditYourself,
  "/DebitYourself": DebitYourself,
  "/AdminProfit": AdminProfit,
  "/LifeTimeComm": LifeTimeComm,
  "/EarnComm": EarnComm,
  "/UnsettledComm": UnsettledComm,
  "/ManualComm": ManualComm,
  "/ManualCommCrDr": ManualCommCrDr,
  "/ManualCommCrDrLedger": ManualCommCrDrLedger,
  "/GSTReport": GSTReport,
  "/PayGST": PayGST,
  "/GSTLedger": GSTLedger,
  "/UserWiseGST": UserWiseGST,
  "/TDSReport": TDSReport,
  "/PayTDS": PayTDS,
  "/TDSLedger": TDSLedger,
  "/UserWiseTDS": UserWiseTDS,
  "/CreateEmployee": CreateEmployee,
  "/ActiveEmployee": ActiveEmployee,
  "/InActiveEmployee": InActiveEmployee,
  "/EmployeeLoginHistory": EmployeeLoginHistory
};

// Recursive route generator
const renderRoutes = (menus) => {
  const routes = [];
  menus.forEach((menu) => {
    if (menu.path && pageMap[menu.path]) {
      routes.push(<Route key={menu.path} path={menu.path} element={React.createElement(pageMap[menu.path])} />);
    }
    if (menu.children) {
      routes.push(...renderRoutes(menu.children));
    }
  });
  return routes;
};
function App() {
  //const token = localStorage.getItem("token");
  // useEffect(() => {
  //   loadCsrfToken();
  // }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectRoute>  <DashBoardLayout /></ProtectRoute>}>
          {renderRoutes(menus)}
        </Route>
      </Routes>
    </Router>
  );
}

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
}


function ProtectRoute({ children }) {  
  var token = getCsrfToken();
  return token ? children : <Navigate to="/" replace />;
}
export default App;
