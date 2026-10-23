import React, { useState, useEffect } from 'react';
import { Gauge, Fuel, Wrench, Plus, RotateCcw } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentOdometer, setCurrentOdometer] = useState('');
  const [fuelLiters, setFuelLiters] = useState('');
  const [oilChangeInterval, setOilChangeInterval] = useState(1000);
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('car_logs') || '[]'));
  const [fuelLogs, setFuelLogs] = useState(() => JSON.parse(localStorage.getItem('fuel_logs') || '[]'));
  const [oilChangeKm, setOilChangeKm] = useState(() => Number(localStorage.getItem('oil_change_km') || 0));

  useEffect(() => {
    localStorage.setItem('car_logs', JSON.stringify(logs));
    localStorage.setItem('fuel_logs', JSON.stringify(fuelLogs));
    localStorage.setItem('oil_change_km', oilChangeKm);
  }, [logs, fuelLogs, oilChangeKm]);

  const lastOdometer = logs.length > 0 ? logs[logs.length - 1].odometer : 0;
  const totalDistance = logs.length > 0 ? lastOdometer - logs[0].odometer : 0;
  const kmSinceLastOil = lastOdometer - oilChangeKm;

  const handleAddOdometer = () => {
    const val = Number(currentOdometer);
    if (val > lastOdometer) {
      setLogs([...logs, { odometer: val, date: new Date().toLocaleDateString('ar-EG') }]);
      setCurrentOdometer('');
    } else { alert('العداد الجديد لازم يكون أكبر من القديم'); }
  };

  const handleAddFuel = () => {
    const val = Number(currentOdometer);
    const liters = Number(fuelLiters);
    if (val > lastOdometer && liters > 0) {
      const consumption = ((val - lastOdometer) / liters).toFixed(2);
      setLogs([...logs, { odometer: val, date: new Date().toLocaleDateString('ar-EG') }]);
      setFuelLogs([...fuelLogs, { odometer: val, liters, consumption, date: new Date().toLocaleDateString('ar-EG') }]);
      setCurrentOdometer(''); setFuelLiters('');
      alert(`تم تسجيل التموين. معدل الاستهلاك: ${consumption} كم/لتر`);
    } else { alert('تأكد من العداد واللترات'); }
  };

  const handleOilChange = () => { setOilChangeKm(lastOdometer); alert('تم تسجيل تغيير الزيت بنجاح!'); };

  return (
    <div dir="rtl" className="app-container">
      <header><h1>صيانة عربيتي 🚗</h1></header>
      <main>
        <div className="card">
          <h2><Gauge size={20} /> العداد</h2>
          <p>العداد الحالي: <strong>{lastOdometer} كم</strong></p>
          <p>إجمالي المسافة: <strong>{totalDistance} كم</strong></p>
          <div className="input-group">
            <input type="number" placeholder="العداد الجديد" value={currentOdometer} onChange={(e) => setCurrentOdometer(e.target.value)} />
            <button onClick={handleAddOdometer}><Plus size={18} /> تسجيل العداد</button>
          </div>
        </div>
        <div className="card">
          <h2><Fuel size={20} /> التموين</h2>
          <div className="input-group">
            <input type="number" placeholder="قراءة العداد" value={currentOdometer} onChange={(e) => setCurrentOdometer(e.target.value)} />
            <input type="number" placeholder="عدد اللترات" value={fuelLiters} onChange={(e) => setFuelLiters(e.target.value)} />
            <button onClick={handleAddFuel}><Plus size={18} /> تسجيل التموين</button>
          </div>
          {fuelLogs.length > 0 && (
            <div className="history"><h3>آخر معدلات الاستهلاك:</h3><ul>{fuelLogs.slice(-3).reverse().map((log, i) => <li key={i}>{log.date}: {log.consumption} كم/لتر</li>)}</ul></div>
          )}
        </div>
        <div className="card">
          <h2><Wrench size={20} /> تغيير الزيت</h2>
          <p>المسافة من آخر تغيير: <strong>{kmSinceLastOil} كم</strong></p>
          <div className="input-group">
            <input type="number" placeholder="كل كام كيلو (1000)" value={oilChangeInterval} onChange={(e) => setOilChangeInterval(Number(e.target.value))} />
            <button onClick={handleOilChange}><RotateCcw size={18} /> تم تغيير الزيت</button>
          </div>
          <p className="note">باقي {oilChangeInterval - kmSinceLastOil} كم</p>
        </div>
      </main>
    </div>
  );
}
