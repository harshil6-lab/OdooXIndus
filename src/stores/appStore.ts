import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  searchOpen: boolean
  setSearchOpen: (open: boolean) => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void

  activeModal: string | null
  setActiveModal: (modal: string | null) => void

  userPreferences: {
    compactMode: boolean
    animationsEnabled: boolean
  }
  setUserPreferences: (prefs: Partial<AppStore['userPreferences']>) => void
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

        searchOpen: false,
        setSearchOpen: (open: boolean) => set({ searchOpen: open }),

        commandPaletteOpen: false,
        setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),

        notificationsOpen: false,
        setNotificationsOpen: (open: boolean) => set({ notificationsOpen: open }),

        activeModal: null,
        setActiveModal: (modal: string | null) => set({ activeModal: modal }),

        userPreferences: {
          compactMode: false,
          animationsEnabled: true,
        },
        setUserPreferences: (prefs) =>
          set((state) => ({
            userPreferences: { ...state.userPreferences, ...prefs },
          })),
      }),
      {
        name: 'core-inventory-app-store',
      }
    )
  )
)
