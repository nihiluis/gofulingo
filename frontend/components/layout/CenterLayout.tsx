import React, { ReactNode } from "react"
import { View } from "react-native"

type CenterLayoutProps = {
  children: ReactNode
  className?: string
}

const CenterLayout = ({ children, className = "" }: CenterLayoutProps) => {
  return (
    <View className="flex-1">
      <View
        className={`flex-1 max-w-screen-xl mx-auto w-full items-center justify-center ${className} min-w-[300px]`}>
        {children}
      </View>
    </View>
  )
}

export default CenterLayout
