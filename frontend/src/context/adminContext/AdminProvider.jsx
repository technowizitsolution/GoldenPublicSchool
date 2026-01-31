import React, { useState, useCallback, useEffect } from 'react';
import AdminContext from './AdminContext';
import { useAuth } from '../authContext/AuthContext';

export const AdminProvider = ({ children }) => {
  const { axios, token } = useAuth();
  
  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
  });

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Students
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Teachers
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Classes
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);

  //Fees Data
  const [feesData, setFeesData] = useState({});
  const [feesLoading, setFeesLoading] = useState(false);

  // Announcements Methods
  const fetchAnnouncements = useCallback(async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await axios.get('/admin/announcements', { 
        headers: { token } 
      });
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, [axios, token]);


  // Students Methods
  const fetchStudents = useCallback(async () => {
    try {
      setStudentsLoading(true);
      const response = await axios.get('/admin/students', { 
        headers: { token } 
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  }, [axios, token]);

  // Teachers Methods
  const fetchTeachers = useCallback(async () => {
    try {
      setTeachersLoading(true);
      const response = await axios.get('/admin/teachers', { 
        headers: { token } 
      });
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setTeachersLoading(false);
    }
  }, [axios, token]);

  // Classes Methods
  const fetchClasses = useCallback(async () => {
    try {
      setClassesLoading(true);
      const response = await axios.get('/admin/classes', { 
        headers: { token } 
      });
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setClassesLoading(false);
    }
  }, [axios, token]);

  const getFeesData = useCallback(async () => {
    try {
      setFeesLoading(true);
      const response = await axios.get('/admin/student/feesRecords', { headers: { token } });
      if (response.status === 200) {
        const feesMap = {};
        response.data.fees?.forEach(fee => {
          feesMap[fee.student._id] = {
            _id: fee._id,
            totalFees: fee.totalFees,
            paidAmount: fee.paidAmount,
            remaining: fee.totalFees - fee.paidAmount,
            status: fee.status,
            dueDate: fee.dueDate,
            paymentHistory: fee.paymentHistory
          };
        });

        setFeesData(feesMap);
      }
    } catch (error) {
      console.warn("Fees data endpoint not available, using defaults:", error.message);
    } finally {
      setFeesLoading(false);
    }
  },[axios, token]);



  useEffect(() =>{
    fetchStudents();
    fetchClasses();
    fetchTeachers();
    fetchAnnouncements(); 
    getFeesData();  
  },[]);




  const value = {
    // Dashboard
    dashboardData,
    setDashboardData,

    // Announcements
    announcements,
    setAnnouncements,
    announcementsLoading,
    fetchAnnouncements,

    // Students
    students,
    studentsLoading,
    fetchStudents,

    // Teachers
    teachers,
    teachersLoading,
    fetchTeachers,

    // Classes
    classes,
    classesLoading,
    fetchClasses,

    // Fees
    feesData,
    feesLoading,
    getFeesData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};