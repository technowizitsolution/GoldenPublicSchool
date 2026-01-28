import React from 'react'

const SAnnouncements = () => {
  const announcementsData = [
    { id: 1, title: 'Annual Sports Day', date: '28 January 2026', content: 'Annual sports day will be held on 15th February. All students must participate.' },
    { id: 2, title: 'Exam Schedule Released', date: '25 January 2026', content: 'Final exams schedule has been released. Check your timetable in the portal.' },
    { id: 3, title: 'Holiday Notice', date: '20 January 2026', content: 'School will remain closed on 26th January for Republic Day.' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>
      
      <div className="space-y-4">
        {announcementsData.map(announcement => (
          <div key={announcement.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{announcement.title}</h3>
              <span className="text-gray-500 text-sm">{announcement.date}</span>
            </div>
            <p className="text-gray-600">{announcement.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SAnnouncements