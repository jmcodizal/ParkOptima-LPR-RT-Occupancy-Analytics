import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const checkBalance = (plateNumber, pin) => {
  // Mock response for development
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (plateNumber && pin === "1234") {
        resolve({
          data: {
            balance: 50.00,
            plateNumber: plateNumber,
            ownerName: "Harry Potter",
            vehicleType: "Motor",
            registeredDate: "06/06/2026"
          }
        });
      } else {
        reject({ response: { status: 404 } });
      }
    }, 1000);
  });
};

export const registerAccount = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { success: true } });
    }, 1000);
  });
};