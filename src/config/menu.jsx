import { RiHome2Fill, RiMoneyDollarBoxFill, RiAdminFill } from "react-icons/ri";
import { MdSell, MdOutlineAccountBalance, MdOutlineAttachMoney } from "react-icons/md";
import { FaFileInvoice, FaFileInvoiceDollar, FaUsers, FaWallet, FaSearch, FaUserTie, FaChartLine, FaChartPie } from "react-icons/fa";
import { GiMoneyStack, GiTakeMyMoney, GiCash } from "react-icons/gi";
import { AiOutlineCreditCard, AiOutlineApi, AiFillBank } from "react-icons/ai";
import { IoMdCash, IoMdMegaphone } from "react-icons/io";
import { BiDollarCircle } from "react-icons/bi";
import { BsQuestionCircle, BsCircleFill } from "react-icons/bs";
import { FaFileInvoice as FaGST } from "react-icons/fa";

export const menus = [
  { text: "Dashboard", icon: RiHome2Fill, path: "/" },
  { text: "Sale", icon: MdSell, path: "/Sales", badge: 25 },
  { text: "Create Invoice", icon: FaFileInvoice, path: "/CreateInvoice" },
  {
    text: "Fund Request",
    icon: GiMoneyStack,
    badge: 12,
    children: [
      { text: "Pending Fund", icon: BsCircleFill, path: "/PendingFundRequest", badge: 5 },
      { text: "Failed Fund", icon: BsCircleFill, path: "/FailedFundRequest" },
      { text: "Success Fund", icon: BsCircleFill, path: "/SuccessFundRequest" },
      { text: "Bank Master", icon: BsCircleFill, path: "/BankMaster" }
    ]
  },
  {
    text: "Settlement",
    icon: AiFillBank,
    children: [
      { text: "Settlement Setting", icon: BsCircleFill, path: "/SettlementSetting" },
      { text: "Pending Settlement Request", icon: BsCircleFill, path: "/PendingSettlementRequest" },
      { text: "Approved Settlement Request", icon: BsCircleFill, path: "/ApprovedSettlementRequest" }
    ]
  },
  {
    text: "Loan Request",
    icon: AiOutlineCreditCard,
    children: [
      { text: "Loan Request Report", icon: BsCircleFill, path: "/LoanRequestReport" },
      { text: "Loan Ledger Report", icon: BsCircleFill, path: "/LoanLedgerReport" },
      { text: "Loan Summary Report", icon: BsCircleFill, path: "/LoanSummaryReport" },
      { text: "Loan Recovered", icon: BsCircleFill, path: "/LoanRecovered" },
      { text: "LifeTime Loan Report", icon: BsCircleFill, path: "/LifeTimeLoanReport" }
    ]
  },
  {
    text: "Utility Payments",
    icon: IoMdCash,
    children: [
      { text: "Utility Reports", icon: BsCircleFill, path: "/UtilityReport" }
    ]
  },
  {
    text: "Direct Commission",
    icon: BiDollarCircle,
    children: [
      { text: "Direct Surcharge Cr/Dr", icon: BsCircleFill, path: "/DirectSurchargeCreditDebit" },
      { text: "Payin Report", icon: BsCircleFill, path: "/PayinReport" },
      { text: "Surcharge Deduct", icon: BsCircleFill, path: "/SurchargeDeduct" },
      { text: "Surcharge Deduct Summary", icon: BsCircleFill, path: "/SurchargeDeductSummary" },
      { text: "Life Time Deduct Report", icon: BsCircleFill, path: "/LifeTimeDeductReport" }
    ]
  },
  {
    text: "Chargebacks",
    icon: FaFileInvoiceDollar,
    children: [
      { text: "Chargebacks", icon: BsCircleFill, path: "/SearchChargeback" },
      { text: "Charge Report", icon: BsCircleFill, path: "/ChargebackReport" }
    ]
  },
  {
    text: "Lien",
    icon: MdOutlineAccountBalance,
    children: [
      { text: "Manage Lien", icon: BsCircleFill, path: "/ManageLien" },
      { text: "Remove Lien Report", icon: BsCircleFill, path: "/DeletedLien" }
    ]
  },
  {
    text: "HelpDesk",
    icon: BsQuestionCircle,
    children: [
      { text: "Ticket Report", icon: BsCircleFill, path: "/TicketReport" },
      { text: "Fraud Customers", icon: BsCircleFill, path: "/FraudCustomer" }
    ]
  },
  {
    text: "Manage Customer",
    icon: FaUsers,
    children: [
      { text: "Create Customer", icon: BsCircleFill, path: "/CreateCustomer" },
      { text: "Manage Permission", icon: BsCircleFill, path: "/ManagePermission" },
      { text: "Manage InstantWallet", icon: BsCircleFill, path: "/ManageInstantWallet" },
      { text: "Active Customers", icon: BsCircleFill, path: "/ActiveCustomers" },
      { text: "User Login History", icon: BsCircleFill, path: "/UserLoginHistory" },
      { text: "Promote User", icon: BsCircleFill, path: "/PromoteUser" },
      { text: "InActive Customers", icon: BsCircleFill, path: "/InActiveCustomers" },
      { text: "User Wallet Balance", icon: BsCircleFill, path: "/UserWalletBalance" },
      { text: "Manage User Wallet", icon: BsCircleFill, path: "/ManageUserWallet" },
      { text: "Recon History", icon: BsCircleFill, path: "/ReconHistory" },
      { text: "Upline ApiWallet", icon: BsCircleFill, path: "/UplineApiWallet" },
      { text: "Api Merchant Details", icon: BsCircleFill, path: "/ApiMerchantDetails" }
    ]
  },
  {
    text: "Smart Collect",
    icon: GiTakeMyMoney,
    children: [
      { text: "Create VA", icon: BsCircleFill, path: "/CreateVA" },
      { text: "VA Report", icon: BsCircleFill, path: "/VAReport" },
      { text: "Active VA Report", icon: BsCircleFill, path: "/ActiveVAReport" }
    ]
  },
  {
    text: "Payout Reports",
    icon: RiMoneyDollarBoxFill,
    children: [
      { text: "Payout Report", icon: BsCircleFill, path: "/PayoutReport" },
      { text: "Pending Payout", icon: BsCircleFill, path: "/PendingPayoutReport" },
      { text: "Failed Payout", icon: BsCircleFill, path: "/FailedPayoutReport" },
      { text: "Payout Ledger", icon: BsCircleFill, path: "/PayoutLedger" },
      { text: "Garbage Payout", icon: BsCircleFill, path: "/GarbagePayout" },
      { text: "Bulk Payout", icon: BsCircleFill, path: "/BulkPayout" }
    ]
  },
  {
    text: "Unsettled Reports",
    icon: FaChartLine,
    children: [
      { text: "Unsettled Payin", icon: BsCircleFill, path: "/UnSettledPayinReport" },
      { text: "Pending Unsettled", icon: BsCircleFill, path: "/UnSettledPendingPayinReport" },
      { text: "Failed Unsettled", icon: BsCircleFill, path: "/UnSettledFailedPayinReport" },
      { text: "Unsettled Ledger", icon: BsCircleFill, path: "/UnSettledPayinLedgerReport" }
    ]
  },
  {
    text: "Settled Reports",
    icon: FaChartPie,
    children: [
      { text: "Settled Payin", icon: BsCircleFill, path: "/SettledPayinReport" },
      { text: "Pending Settled", icon: BsCircleFill, path: "/SettledPedingPayinReport" },
      { text: "Failed Settled", icon: BsCircleFill, path: "/SettledFailedPayinReport" },
      { text: "Settled Ledger", icon: BsCircleFill, path: "/SettledLedgerPayinReport" }
    ]
  },
  {
    text: "Settled Wallet",
    icon: FaWallet,
    children: [
      { text: "Credit Report", icon: BsCircleFill, path: "/SettledCreditReport" },
      { text: "Debit Report", icon: BsCircleFill, path: "/SettledDebitReport" },
      { text: "Cr/Dr Ledger", icon: BsCircleFill, path: "/SettledLedgerReport" }
    ]
  },
  {
    text: "UnSettled Wallet",
    icon: FaWallet,
    children: [
      { text: "Credit Report", icon: BsCircleFill, path: "/UnSettledCreditReport" },
      { text: "Debit Report", icon: BsCircleFill, path: "/UnSettledDebitReport" },
      { text: "Cr/Dr Ledger", icon: BsCircleFill, path: "/UnSettledLedgerReport" }
    ]
  },
  {
    text: "Manage API",
    icon: AiOutlineApi,
    children: [
      { text: "Given API Profit", icon: BsCircleFill, path: "/GivenAPIProfit" },
      { text: "API Fund", icon: BsCircleFill, path: "/APIFund" },
      { text: "API Fund Ledger", icon: BsCircleFill, path: "/APIFundLedger" },
      { text: "API Company Details", icon: BsCircleFill, path: "/APICompanyDetails" },
      { text: "Manage Slab", icon: BsCircleFill, path: "/ManageSlab" },
      { text: "Switch Payin", icon: BsCircleFill, path: "/SwitchPayin" },
      { text: "Set Payout Limit", icon: BsCircleFill, path: "/SetPayoutLimit" },
      { text: "Payin Setup", icon: BsCircleFill, path: "/PayinSetup" }
    ]
  },
  {
    text: "Commission",
    icon: GiCash,
    children: [
      { text: "Create Category", icon: BsCircleFill, path: "/CreateCategory" },
      { text: "Set Value", icon: BsCircleFill, path: "/SetValue" },
      { text: "Commission Ledger", icon: BsCircleFill, path: "/CommissionLedger" }
    ]
  },
  {
    text: "Search",
    icon: FaSearch,
    children: [
      { text: "Payin Search", icon: BsCircleFill, path: "/PayinSearch" },
      { text: "Payout Search", icon: BsCircleFill, path: "/PayoutSearch" },
      { text: "Top Payin Txn", icon: BsCircleFill, path: "/TopPayinTxn" },
      { text: "Duplicate UTR", icon: BsCircleFill, path: "/DuplicateUTR" },
      { text: "Duplicate UnSettled Ledger", icon: BsCircleFill, path: "/DuplicateUnSettledLedger" }
    ]
  },
  {
    text: "BroadCast",
    icon: IoMdMegaphone,
    children: [
      { text: "Notification", icon: BsCircleFill, path: "/Notification" },
      { text: "PopUp", icon: BsCircleFill, path: "/PopUp" },
      { text: "Shoot Email", icon: BsCircleFill, path: "/ShootEmail" },
      { text: "Shoot WhatsApp", icon: BsCircleFill, path: "/ShootWhatsApp" },
      { text: "Banners", icon: BsCircleFill, path: "/Banners" },
      { text: "Send Chrome Nt.", icon: BsCircleFill, path: "/SendChromeNt" }
    ]
  },
  {
    text: "Admin Wallet",
    icon: RiAdminFill,
    children: [
      { text: "Credit Yourself", icon: BsCircleFill, path: "/CreditYourself" },
      { text: "Debit Yourself", icon: BsCircleFill, path: "/DebitYourself" },
      { text: "Admin Profit", icon: BsCircleFill, path: "/AdminProfit" },
      { text: "LifeTime Comm.", icon: BsCircleFill, path: "/LifeTimeComm" },
      { text: "Earn Comm.", icon: BsCircleFill, path: "/EarnComm" },
      { text: "Unsettled Comm.", icon: BsCircleFill, path: "/UnsettledComm" },
      { text: "Manual Comm.", icon: BsCircleFill, path: "/ManualComm" },
      { text: "Manual Comm Cr/Dr", icon: BsCircleFill, path: "/ManualCommCrDr" },
      { text: "Manual Comm Cr/Dr Ledger", icon: BsCircleFill, path: "/ManualCommCrDrLedger" }
    ]
  },
  {
    text: "GST",
    icon: FaGST,
    children: [
      { text: "GST Report", icon: BsCircleFill, path: "/GSTReport" },
      { text: "Pay GST", icon: BsCircleFill, path: "/PayGST" },
      { text: "GST Ledger", icon: BsCircleFill, path: "/GSTLedger" },
      { text: "User Wise Gst", icon: BsCircleFill, path: "/UserWiseGST" }
    ]
  },
  {
    text: "TDS",
    icon: MdOutlineAttachMoney,
    children: [
      { text: "TDS Report", icon: BsCircleFill, path: "/TDSReport" },
      { text: "Pay TDS", icon: BsCircleFill, path: "/PayTDS" },
      { text: "TDS Ledger", icon: BsCircleFill, path: "/TDSLedger" },
      { text: "User Wise Tds", icon: BsCircleFill, path: "/UserWiseTDS" }
    ]
  },
  {
    text: "Manage Employee",
    icon: FaUserTie,
    children: [
      { text: "Create Employee", icon: BsCircleFill, path: "/CreateEmployee" },
      { text: "Active Employee", icon: BsCircleFill, path: "/ActiveEmployee" },
      { text: "InActive Employee", icon: BsCircleFill, path: "/InActiveEmployee" },
      { text: "Employee Login History", icon: BsCircleFill, path: "/EmployeeLoginHistory" }
    ]
  }
];
