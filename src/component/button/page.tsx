'use client'

import React from 'react'

interface ButtonProps {
    children: React.ReactNode
}

export default function Button({ children }: ButtonProps) {
    return <button className="py-2 px-4 rounded-md bg-yellow text-gray-700 hover:bg-yellow-500">{children}</button>
}
