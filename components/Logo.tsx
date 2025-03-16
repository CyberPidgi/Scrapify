import { cn } from '@/lib/utils'
import { SquareDashedMousePointer } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Logo = ({ fontSize = "text-2xl", iconSize = 20 }) => {
  return (
    <Link href={"/"}
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
     <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
      <SquareDashedMousePointer size={iconSize} className='stroke-white'/>
     </div>

     <div>
      <span className="bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 text-transparent">
        Scrap
      </span>
      <span className="text-stone-700 dark:text-stone-300">ify</span>
     </div>
    </Link>
  )
}

export default Logo