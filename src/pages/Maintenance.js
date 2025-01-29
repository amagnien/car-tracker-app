// src/pages/Maintenance.js
import React, { useEffect, useState } from 'react';
import MaintenanceForm from '../components/MaintenanceForm';
import {getMaintenance, deleteMaintenance} from "../services/dataService";
import { useAuth } from '../hooks/useAuth';

const MaintenancePage = () => {
  const [maintenanceList, setMaintenanceList] = useState([]);
    const { userId } = useAuth();
    useEffect(() => {
        if(userId) {
           const unsubscribe = getMaintenance(userId, (maintenanceList) => {
            setMaintenanceList(maintenanceList);
           });
           return () => unsubscribe()
        }
    }, [userId]);

  const handleDeleteMaintenance = async (maintenanceId) => {
    if (userId) {
      await deleteMaintenance(userId, maintenanceId)
    }
  };

  return (
    <div>
      <h2>Maintenance</h2>
      <MaintenanceForm />
        <ul>
          {maintenanceList.map((maintenance) => (
              <li key={maintenance.id}>
                {maintenance.task} - ${maintenance.cost} - {maintenance.date}
                <button onClick={() => handleDeleteMaintenance(maintenance.id)}>Delete</button>
              </li>
          ))}
        </ul>
    </div>
  );
};

export default MaintenancePage;
