console.log('express baby');
const { response } = require('express');
const express = require('express')
const app = express()
const morgan = require('morgan')
const PORT = 3001

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]
function numOfPeople(){
    // return persons.length > 0 ? Math.max(...persons.map(x => x.id)) : 0
    return persons.length
}

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.post('/api/persons', (request, response) => {
    const body = request.body
    // console.log(body);

    if (body.name && body.number) {
        const jsonData = {
            id: Math.floor(Math.random() * 100),
            name: body.name,
            number: body.number
        }
        if (persons.find(x => x.name === body.name)) return response.status(400).json({error: 'name must be unique'})
        persons = persons.concat(jsonData)    
        return response.json(jsonData)
    }
    response.status(400).json({error: 'name must be unique'})
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<h1>Phonebook has info for ${numOfPeople()} PEOPLE</h1><h3>${new Date()}</h3>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    let personWithId = persons.find(x => x.id === id)
    console.log(personWithId);
    personWithId ? response.json(personWithId) : response.status(404).send('<h1>INVALID PERSON</h1>')
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(x => x.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

app.listen(PORT, _ => {
    console.log(`server is running on port ${PORT}`);
})