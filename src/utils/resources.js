export function filterAndSortResources(resources, { query = '', category = 'all', sort = 'recent', view = 'catalog', owner = '' } = {}) {
  return resources
    .filter((resource) => view !== 'mine' || resource.owner === owner)
    .filter((resource) => category === 'all' || resource.category === category)
    .filter((resource) => {
      const searchable = `${resource.title} ${resource.subject} ${resource.owner} ${resource.description}`
      return searchable.toLocaleLowerCase('ro').includes(query.toLocaleLowerCase('ro'))
    })
    .sort((first, second) => {
      if (sort === 'alphabetical') return first.title.localeCompare(second.title, 'ro')
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
    })
}

export function getResourceCounts(resources) {
  const available = resources.filter((resource) => statusAvailable(resource)).length
  return {
    total: resources.length,
    available,
    borrowed: resources.length - available,
  }
}

function statusAvailable(resource) {
  return resource.status === 'available'
}
