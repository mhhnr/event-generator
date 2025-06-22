import type { Theme } from '../types'

export const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      primary: '#FF6600',
      background: '#FFFFFF',
      text: '#1A1A1A',
      accent: '#F2F2F2'
    },
    className: 'theme-light'
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#FF6600',
      background: '#1A1A1A',
      text: '#FFFFFF',
      accent: '#333333'
    },
    className: 'theme-dark'
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#FF6600',
      background: '#FFFFFF',
      text: '#1A1A1A',
      accent: '#F8F8F8'
    },
    className: 'theme-minimal'
  },
  corporate: {
    name: 'Corporate',
    colors: {
      primary: '#FF6600',
      background: '#F5F5F5',
      text: '#1A1A1A',
      accent: '#E0E0E0'
    },
    className: 'theme-corporate'
  }
}

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || themes.light
}