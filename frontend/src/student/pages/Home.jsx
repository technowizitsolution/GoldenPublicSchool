import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const studentInfo = {
        name: "Rohan",
        class: "10-A",
        rollNumber: "STU001",
        avgGrade: "A",
    }

    const quickStats = [
        { label: "Classes", value: "4", icon: "📚" },
        { label: "Fees Pending", value: "₹10,000", icon: "💰" },
        { label: "Books Issued", value: "3", icon: "📕" },
        { label: "Announcements", value: "5", icon: "📢" },
    ]


    const recentAnnouncements = [
        { title: "Annual Sports Day", date: "28 Jan 2026", description: "Annual sports day will be held on 15th February" },
        { title: "Exam Schedule Released", date: "25 Jan 2026", description: "Final exams schedule has been released" },
        { title: "Holiday Notice", date: "20 Jan 2026", description: "School will remain closed on 26th January" },
    ]

    const quickLinks = [
        { label: "My Profile", path: "/student/profile", icon: "👤" },
        { label: "Classes", path: "/student/classes", icon: "📚" },
        { label: "Fees", path: "/student/fees", icon: "💰" },
        { label: "Messages", path: "/student/messages", icon: "💬" },
        { label: "Books", path: "/student/books", icon: "📕" },
        { label: "Teachers", path: "/student/teachers", icon: "👨‍🏫" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-6 space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Welcome, {studentInfo.name}!
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Class {studentInfo.class} | Roll No. {studentInfo.rollNumber}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-500 text-xs">Current Grade</p>
                            <p className="text-3xl font-bold text-blue-600 mt-1">
                                {studentInfo.avgGrade}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QUICK STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickStats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
                        >
                            <div className="text-3xl">{stat.icon}</div>
                            <p className="text-gray-500 text-sm mt-3">{stat.label}</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SIDEBAR */}
                    <div className="space-y-6">

                        {/* FEES STATUS */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Fees Status</h3>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-medium">₹15,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Paid</span>
                                    <span className="font-medium text-green-600">₹5,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pending</span>
                                    <span className="font-medium text-red-600">₹10,000</span>
                                </div>
                            </div>

                            <Link
                                to="/student/fees"
                                className="mt-5 block w-full bg-blue-600 text-white text-center py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Pay Fees
                            </Link>
                        </div>

                        {/* RESOURCES */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                            <div className="space-y-2">
                                <Link to="/student/books" className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition text-sm font-medium">
                                    📕 Books Issued: 3
                                </Link>
                                <Link to="/student/uniforms" className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition text-sm font-medium">
                                    👕 Uniforms: 3
                                </Link>
                                <Link to="/student/messages" className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition text-sm font-medium">
                                    💬 New Messages: 2
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ANNOUNCEMENTS */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Latest Announcements</h2>
                            <Link
                                to="/student/announcements"
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {recentAnnouncements.map((a, i) => (
                                <div key={i} className="px-6 py-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {a.title}
                                        </h3>
                                        <span className="text-xs text-gray-400">{a.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{a.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>

                {/* QUICK LINKS */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-6">Quick Access</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                            >
                                <span className="text-2xl">{link.icon}</span>
                                <span className="text-xs text-center mt-2 font-medium text-gray-700">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Home