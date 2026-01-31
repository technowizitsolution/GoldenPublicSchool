import React, { useState, useCallback } from 'react';
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
  const [studentFees, setStudentFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);

  // Books
  const [studentBooks, setStudentBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // Uniforms
  const [studentUniforms, setStudentUniforms] = useState([]);
  const [uniformsLoading, setUniformsLoading] = useState(false);

  // Profile Methods
  const fetchStudentProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const response = await axios.get('/student/profile', { 
        headers: { token } 
      });
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
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, [axios, token]);

  // Classes Methods
  const fetchStudentClasses = useCallback(async () => {
    try {
      setClassesLoading(true);
      const response = await axios.get('/student/classes', { 
        headers: { token } 
      });
      setStudentClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching student classes:', error);
    } finally {
      setClassesLoading(false);
    }
  }, [axios, token]);

  // Fees Methods
  const fetchStudentFees = useCallback(async () => {
    try {
      setFeesLoading(true);
      const response = await axios.get('/student/fees', { 
        headers: { token } 
      });
      setStudentFees(response.data.fees || []);
    } catch (error) {
      console.error('Error fetching student fees:', error);
    } finally {
      setFeesLoading(false);
    }
  }, [axios, token]);

  // Books Methods
  const fetchStudentBooks = useCallback(async () => {
    try {
      setBooksLoading(true);
      const response = await axios.get('/student/books', { 
        headers: { token } 
      });
      setStudentBooks(response.data.books || []);
    } catch (error) {
      console.error('Error fetching student books:', error);
    } finally {
      setBooksLoading(false);
    }
  }, [axios, token]);

  // Uniforms Methods
  const fetchStudentUniforms = useCallback(async () => {
    try {
      setUniformsLoading(true);
      const response = await axios.get('/student/uniforms', { 
        headers: { token } 
      });
      setStudentUniforms(response.data.uniforms || []);
    } catch (error) {
      console.error('Error fetching student uniforms:', error);
    } finally {
      setUniformsLoading(false);
    }
  }, [axios, token]);

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
    fetchStudentClasses,

    // Fees
    studentFees,
    feesLoading,
    fetchStudentFees,

    // Books
    studentBooks,
    booksLoading,
    fetchStudentBooks,

    // Uniforms
    studentUniforms,
    uniformsLoading,
    fetchStudentUniforms,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};