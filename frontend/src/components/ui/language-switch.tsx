'use client'

import { useLanguageStore, type Language } from '@/stores/language-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const languages = {
  en: { label: 'English', flag: '🇺🇸', title: 'Switch to English' },
  zh: { label: '中文', flag: '🇨🇳', title: '切换到中文' },
}

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguageStore()
  const { i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 hover:bg-accent transition-colors"
          title={language === 'zh' ? 'Switch Language' : '切换语言'}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { label, flag, title }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={`cursor-pointer ${code === language ? 'bg-accent/50' : ''}`}
            title={title}
          >
            <span className="mr-2">{flag}</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
