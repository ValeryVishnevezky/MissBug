import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 4

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy) {
    return Promise.resolve(bugs)
    .then(bugs => {
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            bugs = bugs.filter(bug => regex.test(bug.title))
        }
        if (filterBy.minSeverity) {
            bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        if (filterBy.createdAt) {
            bugs = bugs.filter(bug => bug.createdAt === filterBy.createdAt)
        }
        if (filterBy.labels && filterBy.labels.length) {
            bugs = bugs.filter(bug =>
                bug.labels && bug.labels.some(label => filterBy.labels.includes(label))
            );
        }
        if (filterBy.sortBy) {
            const sortDir = filterBy.sortDir === '-1' ? -1 : 1
            bugs = bugs.sort((a, b) => {
                if (a[filterBy.sortBy] < b[filterBy.sortBy]) return -1 * sortDir
                if (a[filterBy.sortBy] > b[filterBy.sortBy]) return 1 * sortDir
                return 0
            })
        }
        if (filterBy.pageIdx !== undefined) {
            const startIdx = +filterBy.pageIdx * PAGE_SIZE
            bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        return bugs
    })
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('Cannot find bug', id)
    return Promise.resolve(bug)
}

function remove(id) {
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    if (!bugIdx) return Promise.reject('Cannot find bug', id)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave}
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}