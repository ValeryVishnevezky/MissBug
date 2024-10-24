import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from "./services/bug.service.js";
import { loggerService } from "./services/logger.service.js";

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

// List
app.get('/api/bug', (req, res) => {
    bugService.query()
    .then(bugs => res.send(bugs))
    .catch(err => {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get bugs')
    })
})

// ADD 
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// UPDATE 
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get (READ)
app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params
    const { visitedBugs = [] } = req.cookies

    if (!visitedBugs.includes(id)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(id)
        console.log('visitedBugs', visitedBugs)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 70 })
    }
    bugService.getById(id)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// Delete
app.delete('/api/bug/:id', (req, res) => {
    const { id } = req.params
    bugService.remove(id)
        .then(() => res.send(`bug ${id} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
