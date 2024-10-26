const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    get,
    save,
    remove,
    getDefaultFilter,
    getFilterFromParams
}

function query(filterBy = getDefaultFilter()) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(bugs => bugs.data)
}

function get(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(bug => bug.data)
        .catch(err => {
            console.log('err:', err)
        })
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL + bug).then(res => res.data)
    }
}

function getDefaultFilter() {
    return { title: '', minSeverity: 0, labels: '', createdAt: '', labels: '', sortBy: '', pageIdx: 0 }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        title: searchParams.title || defaultFilter.title,
        minSeverity: searchParams.minSeverity || defaultFilter.minSeverity,
        labels: searchParams.labels || defaultFilter.labels,
        createdAt: searchParams.createdAt || defaultFilter.createdAt,
        labels: searchParams.labels || defaultFilter.labels,
        sortBy: searchParams.sortBy || defaultFilter.sortBy,
        pageIdx: searchParams.pageIdx || defaultFilter.pageIdx
    }
}
