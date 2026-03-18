import { clearMocks } from '@tauri-apps/api/mocks'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver for scroll-area component
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

afterEach(() => clearMocks())
