'use client'

import React, { useEffect } from "react";
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from "./components/Layout";
import { NotificationService } from "../utils/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBox, faList } from "@fortawesome/free-solid-svg-icons"

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'already_logged_in') {
      NotificationService.showInfo('Info', 'You are already logged in.').then(() => {
        router.replace('/')
      })
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mt-11">
        Welcome to your favorite app to manage your shopping lists!
      </h1>
      <div className="flex justify-center items-center space-x-10 mt-10">

        {/* Products */}
        <Link
          href="/product-catalog"
          className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg
                    w-72 h-72 hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faBox} className="text-gray-400 text-[90px] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your products</p>
        </Link>

        {/* Shop Lists */}
        <Link
          href="/shopping-lists"
          className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg
                    w-72 h-72 hover:shadow-2xl hover:scale-105 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faList} className="text-gray-400 text-[90px] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Shop Lists</h2>
          <p className="text-gray-500 text-sm mt-1">View your lists</p>
        </Link>

      </div>
    </div>
  )
}
