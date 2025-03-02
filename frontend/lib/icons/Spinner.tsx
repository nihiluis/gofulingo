import { Loader } from "lucide-react-native"
import { iconWithClassName } from "./iconWithClassname"
iconWithClassName(Loader)

import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { useEffect } from "react"
import { Easing } from "react-native"

export const AnimatedLoader: React.FC = () => {
  const rotation = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ: `${rotation.value}deg`,
        },
      ],
    }
  }, [rotation.value])

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      200
    )
    return () => cancelAnimation(rotation)
  }, [])

  return <Loader style={[animatedStyles]} />
}
