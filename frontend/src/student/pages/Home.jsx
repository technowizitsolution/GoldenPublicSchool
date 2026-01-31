import { Link } from 'react-router-dom'
import { useStudent } from '../../context/studentContext/StudentContext'

const Home = () => {

    const { studentProfile, feesData, issuedBooks, announcements, studentUniforms } = useStudent();

    const totalFees = feesData.totalFees || 0;
    const paidAmount = feesData.paidAmount || 0;
    const pendingAmount = totalFees - paidAmount;

    const studentInfo = {
        name: studentProfile?.username || "Student",
        class: studentProfile?.class.name || "10-A",
        rollNumber: studentProfile?.studentId || "STU001",
        avgGrade: studentProfile?.section || "A",
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const quickStats = [
        { label: "Class", value: studentProfile?.class.name || "4", icon: "📚" },
        { label: "Fees Pending", value: pendingAmount || "₹0", icon: "💰" },
        { label: "Books Issued", value: issuedBooks.filter(b => b.status === 'issued').length || "0", icon: "📕" },
        { label: "Announcements", value: announcements.length || "0", icon: "📢" },
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
        <div className="min-h-screen bg-gray-50 py-2 xs:py-3 sm:py-4 md:py-6 lg:py-8">
            <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col xs:flex-col sm:flex-row justify-between items-start sm:items-center gap-3 xs:gap-4">
                        <div className="flex-1">
                            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                Welcome, {studentInfo.name}!
                            </h1>
                            <p className="text-gray-600 text-xs xs:text-sm mt-0.5 xs:mt-1">
                                Class {studentInfo.class} | Roll No. {studentInfo.rollNumber}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-500 text-xs">Current Section</p>
                            <p className="text-2xl xs:text-3xl sm:text-4xl font-bold text-blue-600 mt-0.5 xs:mt-1">
                                {studentInfo.avgGrade}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QUICK STATS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
                    {quickStats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 md:p-6 hover:shadow-md transition"
                        >
                            <div className="text-xl xs:text-2xl sm:text-3xl">{stat.icon}</div>
                            <p className="text-gray-500 text-xs xs:text-sm mt-2 xs:mt-3">{stat.label}</p>
                            <p className="text-lg xs:text-xl sm:text-2xl font-semibold text-gray-900 mt-0.5 xs:mt-1 truncate">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">

                    {/* SIDEBAR */}
                    <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">

                        {/* FEES STATUS */}
                        <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 md:p-6">
                            <h3 className="font-semibold text-gray-900 text-sm xs:text-base mb-3 xs:mb-4">Fees Status</h3>

                            <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total</span>
                                    <span className="font-medium text-gray-900">{totalFees}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Paid</span>
                                    <span className="font-medium text-green-600">{paidAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Pending</span>
                                    <span className="font-medium text-red-600">{pendingAmount}</span>
                                </div>
                            </div>

                            <Link
                                to="/student/fees"
                                className="mt-3 xs:mt-4 sm:mt-5 block w-full bg-blue-600 text-white text-center py-2 xs:py-2.5 md:py-3 rounded-lg text-xs xs:text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Pay Fees
                            </Link>
                        </div>

                        {/* RESOURCES */}
                        <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 md:p-6">
                            <h3 className="font-semibold text-gray-900 text-sm xs:text-base mb-3 xs:mb-4">Resources</h3>
                            <div className="space-y-2 xs:space-y-3">
                                <Link to="/student/books" className="block w-full px-3 xs:px-4 py-2 xs:py-3 border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition text-xs xs:text-sm font-medium truncate">
                                    📕 Books: {issuedBooks.filter(b => b.status === 'issued').length}
                                </Link>
                                <Link to="/student/uniforms" className="block w-full px-3 xs:px-4 py-2 xs:py-3 border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition text-xs xs:text-sm font-medium truncate">
                                    👕 Uniforms: {studentUniforms.length}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ANNOUNCEMENTS */}
                    <div className="lg:col-span-2 bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm max-h-80 xs:max-h-96 sm:max-h-[420px] md:max-h-[440px] overflow-y-auto scrollbar-hidden">
                        <div className="px-3 xs:px-4 sm:px-5 md:px-6 py-3 xs:py-4 border-b border-gray-100 flex justify-between items-center gap-2">
                            <h2 className="font-semibold text-gray-900 text-sm xs:text-base truncate">Latest Announcements</h2>
                            <Link
                                to="/student/announcements"
                                className="text-blue-600 text-xs xs:text-sm font-medium hover:underline whitespace-nowrap flex-shrink-0"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {announcements.map((a) => (
                                <div key={a._id} className="px-3 xs:px-4 sm:px-5 md:px-6 py-3 xs:py-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-xs xs:text-sm font-medium text-gray-900 flex-1 line-clamp-2">
                                            {a.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{formatDate(a.createdAt)}</span>
                                    </div>
                                    <p className="text-xs xs:text-sm text-gray-600 mt-1.5 xs:mt-2 line-clamp-2">{a.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* QUICK LINKS */}
                <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 xs:p-4 sm:p-5 md:p-6">
                    <h2 className="font-semibold text-gray-900 text-sm xs:text-base mb-4 xs:mb-5 md:mb-6">Quick Access</h2>

                    <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 xs:gap-3 sm:gap-4">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className="flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
                            >
                                <span className="text-base xs:text-lg sm:text-2xl">{link.icon}</span>
                                <span className="text-xs text-center mt-1 xs:mt-2 font-medium text-gray-700 line-clamp-2">
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