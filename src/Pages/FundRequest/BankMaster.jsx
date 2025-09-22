import React, { useEffect, useState } from 'react'
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
import { useForm } from 'react-hook-form';

const validationSchema = Yup.object().shape({
    role: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid role").required("Role is required"),
    user: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid user").required("User is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountHolder: Yup.string().required("Account holder is required"),
    accountNo: Yup.string().required("Account No is required"),
    ifsc: Yup.string().required("IFSC code is required"),
    upi: Yup.string().required("UPI is required")
});

const BankMaster=()=> {

  const [roleselectedValue, setRoleSelectedValue] = useState(0);
    const [userRoleList, setuserRoleListValue] = useState([]);
    const [userList, setuserListValue] = useState([]);
    const [userListSelectedValue, setuserListSelectedValue] = useState(0);
    const [userBankList, setuserBankList] = useState([]);
    const [editingId, setEditingId] = useState(0);


    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        BindDrowndownUserRole();
        BindUserBanktableList(0);
    }, []);


    const BindDrowndownUserRole = async () => {
        try {
            const data = await BindUserRole();
            setuserRoleListValue(data);
        } catch (err) {
            // Swal.fire({
            //     icon: "warning",
            //     title: "Warning",
            //     text: err.message || "An unexpected error occurred",
            //     confirmButtonText: "Ok"
            // });
        } finally {

        }
    }

    const BindDrowndownUserList = async (roleId) => {
        try {
            const userdataList = await BindUserListByRoleId(
                {
                    roleId: roleId
                }
            );
            setuserListValue(userdataList);
        } catch (err) {
            // Swal.fire({
            //     icon: "warning",
            //     title: "Warning",
            //     text: err.message || "An unexpected error occurred",
            //     confirmButtonText: "Ok"
            // });
        } finally {

        }
    }

    const BindUserBanktableList = async (Id) => {
        try {
            const userbanklist = await BindUserBankList(
                {
                    id: Id
                }
            );
            setuserBankList(userbanklist);
        } catch (err) {
            // Swal.fire({
            //     icon: "warning",
            //     title: "Warning",
            //     text: err.message || "An unexpected error occurred",
            //     confirmButtonText: "Ok"
            // });
        } finally {

        }
    }

    const handleChangeRoleId = (e) => {
        const roleId = parseInt(e.target.value, 0);
        setRoleSelectedValue(roleId);
        BindDrowndownUserList(roleId);
    }

    const handleChangeUserId = (e) => {
        const UserId = parseInt(e.target.value, 0);
        setuserListSelectedValue(UserId);
    }
    const handleEdit = (row) => {
        console.log(row);
        setEditingId(row.id);
        setuserListSelectedValue(row.UserId);
        setRoleSelectedValue(row.RoleId);
        BindDrowndownUserList(row.RoleId);
        reset({
            role: row.RoleId || 0,
            user: row.UserId || 0,
            bankName: row.BankName || "",
            accountHolder: row.AccountHolderName || "",
            accountNo: row.AccountNo || "",
            ifsc: row.IfscCode || "",
            upi: row.UpiId || ""
        });
    };

    const onSubmit = (data) => {
        SaveBankMaster(data, editingId);
        reset({
            role: 0,
            user: 0,
            bankName: "",
            accountHolder: "",
            accountNo: "",
            ifsc: "",
            upi: ""
        });
        BindUserBanktableList();
    }

    const SaveBankMaster = async (data, Id = 0) => {
        try {
            const _result = await SaveUpdateBankMaster(
                {
                    id: Id,
                    userId: data.user,
                    accountHolderName: data.accountHolder,
                    bankName: data.bankName,
                    accountNo: data.accountNo,
                    ifscCode: data.ifsc,
                    accountType: "",
                    upiId: data.upi
                }
            );

            if (_result.statuscode === 200) {
                // Swal.fire({
                //     icon: "success",
                //     title: "Success",
                //     text: _result.message || "Bank details saved successfully",
                //     confirmButtonText: "Ok"
                // });
            } else {
                // Swal.fire({
                //     icon: "error",
                //     title: "Error",
                //     text: _result.message || "something went wrong",
                //     confirmButtonText: "Ok"
                // });
            }

        } catch (err) {
            // Swal.fire({
            //     icon: "warning",
            //     title: "Warning",
            //     text: err.message || "An unexpected error occurred",
            //     confirmButtonText: "Ok"
            // });
        } finally {

        }
    }

    const DeleteBankMasterDetails = async (Id = 0) => {
        try {
            const _result = await DeleteBankDetails(
                {
                    Id: Id
                }
            );
            if (_result.statuscode === 200) {
                // Swal.fire({
                //     icon: "success",
                //     title: "Success",
                //     text: _result.message || "Bank details deleted successfully",
                //     confirmButtonText: "Ok"
                // });
                BindUserBanktableList();
            } else {
                // Swal.fire({
                //     icon: "error",
                //     title: "Error",
                //     text: _result.message || "something went wrong",
                //     confirmButtonText: "Ok"
                // });
            }
        } catch (err) {
            // Swal.fire({
            //     icon: "warning",
            //     title: "Warning",
            //     text: err.message || "An unexpected error occurred",
            //     confirmButtonText: "Ok"
            // });
        } finally {

        }
    }


  return (
    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-md-6">
        <label className="form-label">Select Role</label>
        <select className={`form-control ${errors.role ? "is-invalid" : ""}`} {...register("role")} onChange={handleChangeRoleId} value={roleselectedValue}>
          <option value={0} key={0}>Select Role</option>
          {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
            userRoleList.data.filter(item => item.id !== 1 && item.id !== 2).map((item) => (
              <option value={item.id}>{item.roleName}</option>
            )) : (
              <option>No Data Found</option>
            )
          }
        </select>
        {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
      </div>
      <div className="col-md-6">
        <label className="form-label">Select User</label>
        <select className={`form-control ${errors.user ? "is-invalid" : ""}`} {...register("user")} onChange={handleChangeUserId}>
          <option value={0} key={0}>Select User</option>
          {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
            userList.data.map((item) => (
              <option value={item.UserId}>{item.NameWithCompanyName}</option>
            )) : (
              <option>No Data Found</option>
            )
          }
        </select>
        {errors.user && <div className="invalid-feedback">{errors.user.message}</div>}
      </div>
      <div className="col-md-6">
        <label>Bank Name</label>
        <input type="text" className={`form-control ${errors.bankName ? "is-invalid" : ""}`} name="bankname" {...register("bankName")} />
        {errors.bankName && <div className="invalid-feedback">{errors.bankName.message}</div>}
      </div>
      <div className="col-md-6">
        <label>Account Holder Name</label>
        <input type="text" className={`form-control ${errors.accountHolder ? "is-invalid" : ""}`} name="accountholdername" {...register("accountHolder")} />
        {errors.accountHolder && <div className="invalid-feedback">{errors.accountHolder.message}</div>}
      </div>
      <div className="col-md-6">
        <label>Account Number</label>
        <input type="text" className={`form-control ${errors.accountNo ? "is-invalid" : ""}`} name="accountno" {...register("accountNo")} />
        {errors.accountNo && <div className="invalid-feedback">{errors.accountNo.message}</div>}

      </div>
      <div className="col-md-6">
        <label>IFSC Code</label>
        <input type="text" className={`form-control ${errors.ifsc ? "is-invalid" : ""}`} name="ifsccode" {...register("ifsc")} />
        {errors.ifsc && <div className="invalid-feedback">{errors.ifsc.message}</div>}
      </div>
      <div className="col-md-6">
        <label>UPI I'd</label>
        <input type="text" className={`form-control ${errors.upi ? "is-invalid" : ""}`} name="upiid" {...register("upi")} />
        {errors.upi && <div className="invalid-feedback">{errors.upi.message}</div>}
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-success me-2">Submit</button>
        <button className="btn btn-secondary me-2">Back</button>
      </div>
    </form>
  )
}

export default BankMaster