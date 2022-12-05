import React from 'react'
import { Link } from 'react-router-dom'

export default function Homepage() {
  return (
    <>
      <div>Homepage</div>
      <p>go to <Link to='/activities'>Activities</Link></p>
    </>
  )
}
