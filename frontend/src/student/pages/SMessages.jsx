import React from 'react'

const SMessages = () => {
  const messagesData = [
    { id: 1, from: 'Mr. Kumar', subject: 'Assignment Submission', message: 'Please submit your mathematics assignment by Friday.', date: '28 January 2026', read: false },
    { id: 2, from: 'Mrs. Singh', subject: 'Class Test', message: 'English class test will be held on 3rd February.', date: '27 January 2026', read: true },
    { id: 3, from: 'Admin', subject: 'Fee Payment Reminder', message: 'Please pay pending fees as soon as possible.', date: '26 January 2026', read: true },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="space-y-2">
        {messagesData.map(msg => (
          <div key={msg.id} className={`rounded-lg p-4 cursor-pointer hover:shadow-md transition ${
            msg.read ? 'bg-white border' : 'bg-blue-50 border-l-4 border-blue-500'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-semibold ${msg.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {msg.subject}
                </h3>
                <p className="text-sm text-gray-600 mt-1">From: {msg.from}</p>
                <p className="text-gray-600 mt-2">{msg.message}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{msg.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SMessages