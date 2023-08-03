import e from 'express'
import { Database } from './database';
import path from 'path';
import { ServiceError, ToDoItemService } from './service';

const app = e();
const database = new Database();
const service = new ToDoItemService(database);

const api = e.Router();

app.use('/doc', e.static(path.join(__dirname, '..', 'static', 'doc')));
app.use('/client', e.static(path.join(__dirname, '..', 'static', 'client')))
app.use('/api', api);

app.listen(3000, () => {
    database.connect().then(() => {
        console.log('Service listening on port 3000');
    })
})

api.get('/list', async (req, res) => {
    try {
        res.status(200).json({
            status: 'ok',
            items: await service.list()
        })
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: 'Internal. Database query failed'
        })
    }
})

api.put('/add', e.json(), async (req, res) => {
    try {
        await service.add(req.body);
        res.status(200).json({
            status: 'ok'
        })
    } catch (error) {
        if(error instanceof ServiceError) {
            res.status(500).json({
                status: 'failure',
                message: 'Internal error. Failed to insert item'
            })
        }
    }
})