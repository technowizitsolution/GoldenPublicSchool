import React from 'react'

const SUniforms = () => {
  const uniformsData = [
    { id: 1, type: 'School Shirt', size: 'Large', issued: '5th January 2026', condition: 'Good' },
    { id: 2, type: 'School Pants', size: 'Large', issued: '5th January 2026', condition: 'Good' },
    { id: 3, type: 'School Tie', size: 'One Size', issued: '5th January 2026', condition: 'Good' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Uniforms</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {uniformsData.map(uniform => (
          <div key={uniform.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">{uniform.type}</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-semibold">Size:</span> {uniform.size}</p>
              <p><span className="font-semibold">Issued:</span> {uniform.issued}</p>
              <p><span className="font-semibold">Condition:</span> 
                <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                  {uniform.condition}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SUniforms