

import { Highlight, Language } from 'prism-react-renderer'
import { themes } from 'prism-react-renderer'
import { FC, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

interface CodeProps {
  code: string
  show: boolean
  language: Language
  animationDelay?: number
  animated?: boolean
}

const Code: FC<CodeProps> = ({ code, show, animated, animationDelay, language }) => {
  const { theme: nextTheme } = useTheme()
  const [text, setText] = useState<string>(animated ? '' : code)

  useEffect(() => {
    if (show && animated) {
      let i = 0
      setTimeout(() => {
        const intervalId = setInterval(() => {
          setText(code.slice(0, i))
          i++
          if (i > code.length) {
            clearInterval(intervalId)
          }
        }, 15)

        return () => clearInterval(intervalId)
      }, animationDelay || 150)
    }
  }, [code, show, animated, animationDelay])

  // number of lines
  const lines = text.split(/\r\n|\r|\n/).length

  const theme = nextTheme === 'light' ? themes.nightOwlLight : themes.nightOwl

  return (
    <Highlight code={text} language={language} theme={theme}>
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            className + ' no-scrollbar w-fit bg-transparent py-0 transition-all duration-100'
          }
          style={{
            maxHeight: show ? lines * 24 : 0,
            opacity: show ? 1 : 0,
          }}
        >
          {tokens.map((line, i) => {
            // eslint-disable-next-line no-unused-vars
            const { key, ...rest } = getLineProps({ line, key: i })
            return (
              <div key={`line-${i}`} style={{ position: 'relative' }} {...rest}>
                {line.map((token, index) => {
                  // eslint-disable-next-line no-unused-vars
                  const { key, ...props } = getTokenProps({ token, i })
                  return <span key={index} {...props} />
                })}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

export default Code
