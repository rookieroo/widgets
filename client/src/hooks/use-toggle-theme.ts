import { useEffect } from 'react'
import { themes } from '@/components/theme/themes'
import { getThemeCode } from '@/components/theme/ThemeCustomizer'

const useToggleTheme = (config) => {
  useEffect(() => {
    if (!config) {
      return
    }
    const activeTheme = themes.find((theme) => theme.name === config.theme)
    const css = getThemeCode(activeTheme, config.radius)
    const style = document.createElement('style')
    style.textContent = css
    document.head?.appendChild(style)
    return () => {
      try {
        document.head?.removeChild(style)
      }catch (e) {

      }
    }
  }, [config])
}

export default useToggleTheme
