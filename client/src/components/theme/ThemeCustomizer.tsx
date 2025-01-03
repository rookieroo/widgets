import * as React from 'react'
import {
  CheckIcon,
  ResetIcon,
} from '@radix-ui/react-icons'
import template from 'lodash.template'
import { cn } from '@/utils/utils'
import { init_config, useConfig } from '@/store/useConfig'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { themes } from '@/components/theme/themes'
import { useEffect } from 'react'
import {
  Highlighter,
  Type,
  List,
  LayoutGrid,
  Rows3,
  Sun,
  Moon,
  SunMoon,
} from 'lucide-react'
import { ScrollArea } from '@/ui/scroll-area'
import { Popover, PopoverTrigger, PopoverContent } from '@/ui/popover'
import { SquareMousePointer } from 'lucide-react'
import useToggleTheme from '@/hooks/use-toggle-theme'
import {useTranslation} from "react-i18next";

export function CustomizerWrapper() {
  const [config] = useConfig()
  useToggleTheme(config)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex rounded-full border dark:border-grey-600 px-2 bg-primary aspect-[1] items-center justify-center text-primary bg-button"
          >
            <SquareMousePointer className="h-4 w-4 dark:text-white" />
            <span className="sr-only">Customize</span>
            {/*{!open && <SquareDashedMousePointer className="h-5 w-5" />}*/}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Customizer />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const [config, setConfig] = useConfig()
  const {t, i18n} = useTranslation();

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChangeDirection = (direction) => {
    document.body.dir = direction
    setConfig({
      ...config,
      direction: direction,
    })
  }

  const handleChangeMode = (mode) => {
    setConfig({
      ...config,
      mode: mode,
    })
  }

  return (
    <ScrollArea className="h-auto p-4 dark:text-white">
      <div className="flex items-start pt-4 md:pt-0">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            {t('customize.customizeTitle')}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-[0.5rem]"
          onClick={() => {
            setConfig({
              ...config,
              ...init_config,
            })
          }}
        >
          <ResetIcon />
          <span className="sr-only">
            {t('customize.Reset')}
          </span>
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t('customize.Mode')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {mounted ? (
            <>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => handleChangeMode('light')}
                className={cn(config.mode === 'light' && 'border-2 border-primary')}
              >
                <Sun className="mr-1 w-3 -translate-x-1" />
                {t('customize.Light')}
              </Button>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => handleChangeMode('dark')}
                className={cn(config.mode === 'dark' && 'border-2 border-primary')}
              >
                <Moon className="mr-1 w-3 -translate-x-1" />
                {t('customize.Dark')}
              </Button>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => handleChangeMode('system')}
                className={cn(config.mode === 'system' && 'border-2 border-primary')}
              >
                <SunMoon className="mr-1 w-3 -translate-x-1" />
                {t('customize.System')}
              </Button>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          )}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">{t('customize.Languages')}</Label>
        <div className="grid grid-cols-3 gap-2">
          {mounted ? (
            <>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => i18n.changeLanguage("en")}
                className={cn("en" === i18n.language && 'border-2 border-primary')}
              >
                {t('English')}
              </Button>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => i18n.changeLanguage("zh")}
                className={cn("zh" === i18n.language && 'border-2 border-primary')}
              >
                {t('中文')}
              </Button>
              <Button
                variant={'outline'}
                size="sm"
                onClick={() => i18n.changeLanguage("ja")}
                className={cn("ja" === i18n.language && 'border-2 border-primary')}
              >
                {t('日本語')}
              </Button>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">
            {t('customize.Color')}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => {
              const isActive = config.theme === theme.name

              return mounted ? (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={theme.name}
                  onClick={() => {
                    setConfig({
                      ...config,
                      theme: theme.name,
                    })
                  }}
                  className={cn('justify-start', isActive && 'border-2 border-primary')}
                  style={
                    {
                      '--theme-primary': `hsl(${
                        theme?.activeColor[
                          'light' === 'dark' || theme === 'dark' ? 'dark' : 'light'
                        ]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]'
                    )}
                  >
                    {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                  </span>
                  {t(`customize.colors.${theme.label}`)}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t('customize.Radius')}</Label>
          <div className="grid grid-cols-5 gap-2">
            {['0', '0.3', '0.5', '0.75', '1.0'].map((value) => {
              return (
                <Button
                  variant={'outline'}
                  size="sm"
                  key={value}
                  onClick={() => {
                    setConfig({
                      ...config,
                      radius: parseFloat(value),
                    })
                  }}
                  style={{borderRadius: `calc(${value}rem - 2px)`}}
                  className={cn(config.radius === parseFloat(value) && 'border-2 border-primary', '')}
                >
                  {value}
                </Button>
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">
            {t('customize.Layout')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() =>
                    setConfig({
                      ...config,
                      blogList: 'list',
                    })
                  }
                  className={cn(config.blogList === 'list' && 'border-2 border-primary')}
                >
                  <List className="mr-1 w-3 -translate-x-1" />
                  {t('customize.List')}
                </Button>
                <Button
                  variant={'outline'}
                  size="sm"
                  onClick={() =>
                    setConfig({
                      ...config,
                      blogList: 'grid',
                    })
                  }
                  className={cn(config.blogList === 'grid' && 'border-2 border-primary')}
                >
                  <LayoutGrid className="mr-1 w-3 -translate-x-1" />
                  {t('customize.Grid')}
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

function CustomizerCode() {
  const [config] = useConfig()
  const activeTheme = themes.find((theme) => theme.name === config.theme)

  return (
    <div data-rehype-pretty-code-fragment="">
      <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          <span className="line text-white">@layer base &#123;</span>
          <span className="line text-white">&nbsp;&nbsp;:root &#123;</span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.light['background']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.light['foreground']};
          </span>
          {['card', 'popover', 'primary', 'secondary', 'muted', 'accent', 'destructive'].map(
            (prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                  {activeTheme?.cssVars.light[prefix as keyof typeof activeTheme.cssVars.light]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{' '}
                  {
                    activeTheme?.cssVars.light[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                    ]
                  }
                  ;
                </span>
              </>
            )
          )}
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.light['border']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.light['input']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.light['ring']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--radius: {config.radius}rem;
          </span>
          <span className="line text-white">&nbsp;&nbsp;&#125;</span>
          <span className="line text-white">&nbsp;</span>
          <span className="line text-white">&nbsp;&nbsp;.dark &#123;</span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--background: {activeTheme?.cssVars.dark['background']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--foreground: {activeTheme?.cssVars.dark['foreground']};
          </span>
          {['card', 'popover', 'primary', 'secondary', 'muted', 'accent', 'destructive'].map(
            (prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{' '}
                  {activeTheme?.cssVars.dark[prefix as keyof typeof activeTheme.cssVars.dark]};
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{' '}
                  {
                    activeTheme?.cssVars.dark[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                    ]
                  }
                  ;
                </span>
              </>
            )
          )}
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--border: {activeTheme?.cssVars.dark['border']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--input: {activeTheme?.cssVars.dark['input']};
          </span>
          <span className="line text-white">
            &nbsp;&nbsp;&nbsp;&nbsp;--ring: {activeTheme?.cssVars.dark['ring']};
          </span>
          <span className="line text-white">&nbsp;&nbsp;&#125;</span>
          <span className="line text-white">&#125;</span>
        </code>
      </pre>
    </div>
  )
}

export function getThemeCode(theme, radius: number) {
  if (!theme) {
    return ''
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    name: theme.name,
    radius,
  })
}

const BASE_STYLES_WITH_VARIABLES = `
  @layer base {
    :root {
      --theme: <%- name %>;
      --background: <%- colors.light["background"] %>;
      --foreground: <%- colors.light["foreground"] %>;
      --card: <%- colors.light["card"] %>;
      --card-foreground: <%- colors.light["card-foreground"] %>;
      --popover: <%- colors.light["popover"] %>;
      --popover-foreground: <%- colors.light["popover-foreground"] %>;
      --primary: <%- colors.light["primary"] %>;
      --primary-foreground: <%- colors.light["primary-foreground"] %>;
      --secondary: <%- colors.light["secondary"] %>;
      --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
      --muted: <%- colors.light["muted"] %>;
      --muted-foreground: <%- colors.light["muted-foreground"] %>;
      --accent: <%- colors.light["accent"] %>;
      --accent-foreground: <%- colors.light["accent-foreground"] %>;
      --destructive: <%- colors.light["destructive"] %>;
      --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
      --border: <%- colors.light["border"] %>;
      --input: <%- colors.light["input"] %>;
      --ring: <%- colors.light["ring"] %>;
      --radius: <%- radius %>rem;
    }
  
    .dark {
      --theme: <%- name %>;
      --background: <%- colors.dark["background"] %>;
      --foreground: <%- colors.dark["foreground"] %>;
      --card: <%- colors.dark["card"] %>;
      --card-foreground: <%- colors.dark["card-foreground"] %>;
      --popover: <%- colors.dark["popover"] %>;
      --popover-foreground: <%- colors.dark["popover-foreground"] %>;
      --primary: <%- colors.dark["primary"] %>;
      --primary-foreground: <%- colors.dark["primary-foreground"] %>;
      --secondary: <%- colors.dark["secondary"] %>;
      --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
      --muted: <%- colors.dark["muted"] %>;
      --muted-foreground: <%- colors.dark["muted-foreground"] %>;
      --accent: <%- colors.dark["accent"] %>;
      --accent-foreground: <%- colors.dark["accent-foreground"] %>;
      --destructive: <%- colors.dark["destructive"] %>;
      --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
      --border: <%- colors.dark["border"] %>;
      --input: <%- colors.dark["input"] %>;
      --ring: <%- colors.dark["ring"] %>;
    }
  }
`
