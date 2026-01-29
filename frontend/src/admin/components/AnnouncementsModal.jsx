import React, { useState, useEffect } from "react";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementsList from "./AnnouncementsList";
import { useAuth } from '../../context/AuthContext';

const AnnouncementsModal = ({ onClose }) => {
    const [showForm, setShowForm] = useState(false);
    const { token, axios } = useAuth();
    const [announcements, setAnnouncements] = useState([]);

    const getAllAnnouncements = async () => {
        try {
            const response = await axios.get('/admin/announcements', { headers: { token } });
            console.log("Announcements fetched : ", response.data.announcements);
            setAnnouncements(response.data.announcements);
        } catch (error) {
            console.error("Error fetching announcements : ", error);
        }
    }

    useEffect(() => {
        getAllAnnouncements();
    }, []);

    // Mock data - will be replaced with API calls
    

    const handleAddAnnouncement = async (newAnnouncement) => {
        try {
            const response = await axios.post('/admin/announcement/create', newAnnouncement, { headers: { token } });
            setAnnouncements([response.data.announcement, ...announcements]);
            setShowForm(false);
        } catch (error) {
            console.error("Error creating announcement:", error);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
        if (confirmDelete) {
            try {
                await axios.delete(`/admin/announcement/${id}`, { headers: { token } });
                setAnnouncements(announcements.filter(ann => ann._id !== id));
            } catch (error) {
                console.error("Error deleting announcement:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-light"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 scrollbar-hidden overflow-y-auto p-6">
                    {!showForm ? (
                        <>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mb-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition"
                            >
                                + Create New Announcement
                            </button>
                            <AnnouncementsList
                                announcements={announcements}
                                onDelete={handleDeleteAnnouncement}
                            />
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowForm(false)}
                                className="mb-4 text-purple-500 hover:text-purple-700 font-semibold"
                            >
                                ← Back to Announcements
                            </button>
                            <AnnouncementForm
                                onSubmit={handleAddAnnouncement}
                                onCancel={() => setShowForm(false)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsModal;