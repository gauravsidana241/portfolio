"use client"

import './Loader.scss'
import React from 'react'

type LoaderProps = {
  isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
  return (
    <div className={`loader ${!isLoading ? 'loader--hidden' : ''}`}>
      <div className="loader__content">
        <div className="loader__bar">
          <div className="loader__progress"></div>
        </div>
      </div>
    </div>
  )
}