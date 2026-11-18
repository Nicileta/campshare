import { describe, expect, it } from 'vitest'
import { filterAndSortResources, getResourceCounts } from './resources.js'

const resources = [
  { id: 1, title: 'Manual Matematică', category: 'manual', subject: 'Matematică', owner: 'Ana Popescu', description: '', status: 'available', createdAt: '2026-10-28T10:00:00Z' },
  { id: 2, title: 'Ion', category: 'literature', subject: 'Română', owner: 'Elena Dumitru', description: 'Roman', status: 'borrowed', createdAt: '2026-10-21T12:00:00Z' },
  { id: 3, title: 'Culegere Fizică', category: 'workbook', subject: 'Fizică', owner: 'Ana Popescu', description: '', status: 'available', createdAt: '2026-10-26T10:00:00Z' },
]

describe('filterAndSortResources', () => {
  it('filtrează după categorie și text', () => {
    expect(filterAndSortResources(resources, { query: 'fizică', category: 'workbook' }).map((item) => item.id)).toEqual([3])
  })

  it('afișează doar resursele proprietarului în vizualizarea mea', () => {
    expect(filterAndSortResources(resources, { view: 'mine', owner: 'Ana Popescu' }).map((item) => item.id)).toEqual([1, 3])
  })

  it('sortează alfabetic în limba română', () => {
    expect(filterAndSortResources(resources, { sort: 'alphabetical' }).map((item) => item.id)).toEqual([3, 2, 1])
  })
})

describe('getResourceCounts', () => {
  it('calculează resursele totale, disponibile și împrumutate', () => {
    expect(getResourceCounts(resources)).toEqual({ total: 3, available: 2, borrowed: 1 })
  })
})
