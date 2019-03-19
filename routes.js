const express = require('express');
const routes = express.Router();
const Hubs = require('./hubs/hubs-model.js');

routes.use(express.json());

routes.get('/', (req, res) => {
	Hubs.find(req.query)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

routes.get('/:id', async (req, res) => {
	try {
		const hub = await Hubs.findById(req.params.id);

		if (hub) {
			res.status(200).json(hub);
		}
		res.status(404).json({ message: 'Hub not found' });
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error retrieving the hub'
		});
	}
});

routes.post('/', async (req, res) => {
	try {
		const hub = await Hubs.add(req.body);
		res.status(201).json(hub);
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error adding the hub'
		});
	}
});

routes.delete('/:id', async (req, res) => {
	try {
		const count = await Hubs.remove(req.params.id);
		if (count > 0) {
			res.status(200).json({ message: 'The hub has been nuked' });
		} else {
			res.status(404).json({ message: 'The hub could not be found' });
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error removing the hub'
		});
	}
});

routes.put('/:id', async (req, res) => {
	try {
		const hub = await Hubs.update(req.params.id, req.body);
		if (hub) {
			res.status(200).json(hub);
		} else {
			res.status(404).json({ message: 'The hub could not be found' });
		}
	} catch (error) {
		// log error to database
		console.log(error);
		res.status(500).json({
			message: 'Error updating the hub'
		});
	}
});

// get messages from a particular hub
routes.get('/:id/messages', async (req, res) => {
	const { id } = req.params;
	try {
		const hub = await Hubs.findHubMessages(id);
		if (hub.length > 0) {
			res.status(200).json(hub);
		} else {
			res.status(404).json({ message: 'Hub with this ID does not exist' });
		}
	} catch (error) {
		res.status(500).json({
			message: 'Error retrieving the hub'
		});
	}
});

// post a new message to a hub
routes.post('/:id/messages', async (req, res) => {
	try {
		const message = await Hubs.addMessage({
			hub_id: null,
			text: req.body.text,
			sender: req.body.sender
		});

		res.status(201).json(message);
	} catch (error) {
		res.status(500).json({ errorMessage: 'something went wrong' });
	}
});

module.exports = routes;
