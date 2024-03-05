import React, { useState } from 'react';
import axios from 'axios';

const REST_API_BASE_URL = 'http://localhost:8080';
axios.defaults.headers.common['X-API-KEY'] = 'nasipadang';

function BankingApp() {
  const [selectedOperation, setSelectedOperation] = useState('');
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [responseTable, setResponseTable] = useState([]);
  const [errors, setErrors] = useState({});

  const handleOperationChange = (event) => {
    setSelectedOperation(event.target.value);
  };

  const handleExecuteOperation = async () => {
    try {
      let response;
      switch (selectedOperation) {
        case 'getCustomerById':
          if (!/^\d+$/.test(formData.customerId)) {
            setErrors({ ...errors, customerId: 'Customer ID must contain only numbers' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/customers/get`, { custId: formData.customerId });
          setResponseTable([response.data]);
          break;
        case 'getAccountById':
          if (!/^\d+$/.test(formData.accountId)) {
            setErrors({ ...errors, accountId: 'Account ID must contain only numbers' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/accounts/get`, { accountId: formData.accountId });
          setResponseTable([response.data]);
          break;
        case 'createCustomer':
            if (!formData.customerName || !/^[a-zA-Z\s]+$/.test(formData.customerName)) {
            setErrors({ ...errors, customerName: 'Customer name must contain only alphabet letters' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/customers/create`, { custName: formData.customerName });
          setResponseTable([response.data]);
          break;
        case 'createAccount':
          if (!formData.accountType || !/^[a-zA-Z\s]+$/.test(formData.accountType)) {
            setErrors({ ...errors, accountType: 'Account type must contain only alphabet letters' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/accounts/create`, { accountType: formData.accountType });
          setResponseTable([response.data]);
          break;
        case 'depositCash':
          if (!/^\d+$/.test(formData.accountId)) {
            setErrors({ ...errors, accountId: 'Account ID must contain only numbers' });
            return;
          }
          if (!/^\d+(\.\d{1,2})?$/.test(formData.transactionAmount)) {
            setErrors({ ...errors, transactionAmount: 'Invalid amount. Please enter a valid number' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/accounts/deposit`, { accountId: formData.accountId, amount: formData.transactionAmount });
          setResponseTable([response.data]);
          break;
        case 'withdrawCash':
          if (!/^\d+$/.test(formData.accountId)) {
            setErrors({ ...errors, accountId: 'Account ID must contain only numbers' });
            return;
          }
          if (!/^\d+(\.\d{1,2})?$/.test(formData.transactionAmount)) {
            setErrors({ ...errors, transactionAmount: 'Invalid amount. Please enter a valid number' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/accounts/withdraw`, { accountId: formData.accountId, amount: formData.transactionAmount });
          setResponseTable([response.data]);
          break;
        case 'closeAccount':
          if (!/^\d+$/.test(formData.accountId)) {
            setErrors({ ...errors, accountId: 'Account ID must contain only numbers' });
            return;
          }
          response = await axios.post(`${REST_API_BASE_URL}/api/accounts/close`, { accountId: formData.accountId });
          alert("Account Closed successfully");
          break;
        default:
          break;
      }
    } catch (error) {
        debugger;
        if (error.response.data) {
          alert(error.response.data);
        } else {
          console.error('Error:', error.message);
          alert('Request failed');
        }
      }
  };

  const handleBack = () => {
    setSelectedOperation('');
    setFormData({});
    setMessage('');
    setResponseTable([]);
    setErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="mb-4 text-center">AccountZen</h3>
          <select className="form-select mb-3" onChange={handleOperationChange} value={selectedOperation}>
            <option value="">Select Operation</option>
            <option value="getCustomerById">Inquire Customer</option>
            <option value="getAccountById">Inquire Account</option>
            <option value="createCustomer">Create Customer</option>
            <option value="createAccount">Create Account</option>
            <option value="depositCash">Deposit Cash</option>
            <option value="withdrawCash">Withdraw Cash</option>
            <option value="closeAccount">Close Account</option>
          </select>
          {selectedOperation === 'getCustomerById' && (
            <>
              <input type="text" className="form-control mb-3" value={formData.customerId || ''} name="customerId" onChange={handleInputChange} placeholder="Enter customer ID" required />
              {errors.customerId && <span className="text-danger">{errors.customerId}</span>}
            </>
          )}
          {selectedOperation === 'getAccountById' && (
            <>
              <input type="text" className="form-control mb-3" value={formData.accountId || ''} name="accountId" onChange={handleInputChange} placeholder="Enter account ID" required />
              {errors.accountId && <span className="text-danger">{errors.accountId}</span>}
            </>
          )}
          {selectedOperation === 'createCustomer' && (
            <>
              <input type="text" className="form-control mb-3" value={formData.customerName || ''} name="customerName" onChange={handleInputChange} placeholder="Enter customer name" required />
              {errors.customerName && <span className="text-danger">{errors.customerName}</span>}
            </>
          )}
          {selectedOperation === 'createAccount' && (
            <>
              <input type="text" className="form-control mb-3" value={formData.accountType || ''} name="accountType" onChange={handleInputChange} placeholder="Enter account type" required />
              {errors.accountType && <span className="text-danger">{errors.accountType}</span>}
            </>
          )}
          {(selectedOperation === 'depositCash' || selectedOperation === 'withdrawCash') && (
            <>
              <input type="text" className="form-control mb-3" value={formData.accountId || ''} name="accountId" onChange={handleInputChange} placeholder="Enter account ID" required />
              {errors.accountId && <span className="text-danger">{errors.accountId}</span>}
              <input type="text" className="form-control mb-3" value={formData.transactionAmount || ''} name="transactionAmount" onChange={handleInputChange} placeholder="Enter amount" required />
              {errors.transactionAmount && <span className="text-danger">{errors.transactionAmount}</span>}
            </>
          )}
          {selectedOperation === 'closeAccount' && (
            <>
              <input type="text" className="form-control mb-3" value={formData.accountId || ''} name="accountId" onChange={handleInputChange} placeholder="Enter account ID" required />
              {errors.accountId && <span className="text-danger">{errors.accountId}</span>}
            </>
          )}
          {selectedOperation && (
            <button className="btn btn-primary w-100" onClick={handleExecuteOperation}>Execute Operation</button>
          )}
          {message && <p className="mt-3">{message}</p>}
          {responseTable.length > 0 && (
            <>
              <br/><br/><button className="btn btn-primary mb-3" onClick={handleBack}>Back</button>
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(responseTable[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
  {responseTable.map((row, index) => (
    <tr key={index}>
      {Object.values(row).map((value, index) => (
        <td key={index}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</td>
      ))}
    </tr>
  ))}
</tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BankingApp;