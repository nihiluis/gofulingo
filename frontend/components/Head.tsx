import { useEffect } from "react"
import { Platform } from "react-native"

export default function Head() {
  if (Platform.OS === "web") {
    useEffect(() => {
      document.title = process.env.EXPO_PUBLIC_APP_NAME || "Gofulingo v0"
    }, [])
    return null
  }
  return null
}
