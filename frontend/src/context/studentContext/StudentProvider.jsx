import React, { useState, useCallback, useEffect } from 'react';
import StudentContext from './StudentContext';
import { useAuth } from '../authContext/AuthContext';

export const StudentProvider = ({ children }) => {
  const { axios, token } = useAuth();

  // Student Profile
  const [studentProfile, setStudentProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  // Classes
  const [studentClasses, setStudentClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);

  // Fees
  const [feesData, setFeesData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);

  // Books
  const [issuedBooks, setIssuedBooks] = useState([]);


  // Uniforms
  const [studentUniforms, setStudentUniforms] = useState([]);

  // Profile Methods
  const fetchStudentProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get('/student/profile', { 
        headers: { token } 
      });
      console.log("Fetched student profile:", response.data.student);
      setStudentProfile(response.data.student);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [axios, token]);

  // Announcements Methods
  const fetchAnnouncements = useCallback(async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await axios.get('/student/announcements', { 
        headers: { token } 
      });
      console.log("Fetched announcements:", response);
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, [axios, token]);

  

  // Fees Methods
  const fetchFeesData = useCallback(async () => {
    try {
      setFeesLoading(true);
      const response = await axios.get("/student/fees", {
        headers: {
          token
        },
      });

      console.log("Fees Response:", response.data.fees[0]);

      if (response.data.success) {
        setFeesData(response.data.fees[0]);
        setPaymentHistory(response.data.fees[0].paymentHistory || []);
        console.log("Fees history:", response.data.fees[0].paymentHistory || []);
      } else {
        console.error("Failed to fetch fees data");
      }
    } catch (error) {
      console.error("Error fetching fees data:", error);
    } finally {
      setFeesLoading(false);
    }
  },[axios, token]);

  // Books Methods
  const fetchStudentBooks = useCallback(async () => {
    try {
      const response = await axios.get('/student/issuedBooks', { 
        headers: { token } 
      });
      console.log("Fetched student books:", response);
      setIssuedBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching student books:', error);
    } 
  }, [axios, token]);

  // Uniforms Methods
  const fetchStudentUniforms = useCallback(async () => {
    try {
      
      const response = await axios.get('/student/studentUniforms', { 
        headers: { token } 
      });
      console.log("Fetched student uniforms:", response);
      setStudentUniforms(response.data.studentUniforms[0].uniforms || []);
    } catch (error) {
      console.error('Error fetching student uniforms:', error);
    } 
  }, [axios, token]);

  useEffect(() => {
    fetchAnnouncements();
    fetchStudentProfile();
    fetchFeesData();
    fetchStudentBooks();
    fetchStudentUniforms();
  },[]);

  const value = {
    // Profile
    studentProfile,
    profileLoading,
    fetchStudentProfile,

    // Announcements
    announcements,
    announcementsLoading,
    fetchAnnouncements,

    // Classes
    studentClasses,
    classesLoading,
    

    // Fees
    feesData,
    feesLoading,
    paymentHistory,
    fetchFeesData,

    // Books
    issuedBooks,
    fetchStudentBooks,

    // Uniforms
    studentUniforms,
    fetchStudentUniforms,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};