import { useEffect, useState } from 'react';
import Card from './Card';
import { BindAPI } from '../../services/Commonapi';
import { GetSaleDashBoard } from '../../services/SaleDashBoard';

const Sales = (apiId, startDate, endDate) => {
  const [saledata, setSales] = useState([]);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [filterType, setFilterType] = useState("today");
  const [apiOptions, setApiOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);


  useEffect(() => {
    apiFetchData();
    handleDateChange("today");

    console.log("useeffect working")
  }, []);

  const apiFetchData = async () => {
    try {
      const data = await BindAPI(
        {
          RoleId: 2
        }
      )
      setApiOptions(data);
    } catch (err) {
      setError(err.message || "something went wrong");
    } finally {

    }
  }

  const fetchData = async (range, apiId) => {
    try {
      //setLoading(true);
      const data = await GetSaleDashBoard(
        {
          apiId: apiId,
          startDate: range.startDate,
          endDate: range.endDate
        }
      );      
      setSales(data);
    } catch (err) {
      setError(err.message || "something went wrong");
    } finally {
      //setLoading(false);
    }
  };

  const handleApiChange = (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedValue(apiId);
    fetchData(dateRange, apiId);
  }
  const handleDateChange = (type) => {
    setFilterType(type);
    const today = new Date();
    switch (type) {
      case "today":
        startDate = endDate = today.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        break;
      case "yesterday":
        const yest = new Date(today);
        yest.setDate(today.getDate() - 1);
        startDate = endDate = yest.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        break;
      case "7days":
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        startDate = last7.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        endDate = today.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        break;
      case "30days":
        const last30 = new Date(today);
        last30.setDate(today.getDate() - 30);
        startDate = last30.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        endDate = today.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
        break;
      default:
        startDate = endDate = today.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata" // force IST
        });
    }
    const range = { startDate, endDate };
    setDateRange(range);
    fetchData(range, selectedValue);
  }

  return (
    <div className="p-lg-8 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-8 mb-8">
        {/* Recent Sale Transaction */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Transaction</h2>
          </div>
          <select className="form-control" onChange={handleApiChange} id="ddlapi">
            <option value={0}>Select API</option>
            {apiOptions && Array.isArray(apiOptions.data) && apiOptions.data.length > 0 ?
              apiOptions.data.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              )) : (
                <option>No Data Found</option>
              )}
          </select>
          <button type="button" variant="dark" className="rounded-pill px-3" onClick={(e) => { e.preventDefault(); handleDateChange("today") }}>TODAY</button>
          <button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("yesterday")}>YESTERDAY</button>
          <button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("7days")}>7 DAYS</button>
          <button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("30days")}>30 DAYS</button>
          <button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("custom")}>CUSTOM DATE</button>
          {filterType == "custom" && (
            <div>
              <input type="date" onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })
              } />
              <input type="date" onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })
              } />
              <button onClick={() => fetchData(dateRange)}>Search</button>
            </div>
          )}
          {saledata && Array.isArray(saledata.data) && saledata.data.length > 0 ? (
            saledata.data.map((item, index) => (
              <div key={index} className="col-sm-4 mb-3">
                <Card
                  title={item.metric}
                  value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.value)}
                  color={[]} />
              </div>
            ))
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sales